import { estimateTdn } from "./evaluation";
import { getExerciseSpec } from "./testdaf";
import { SKILL_CATEGORIES, SKILL_LABELS, SKILL_TAGS } from "./skill-taxonomy";
import type {
  EvaluationReport,
  EvidenceRecord,
  LearnerState,
  SkillDelta,
  SkillNode,
  StudyPlanItem
} from "./types";
import type { ExerciseId } from "./exercise-ids";
import type { SkillTag } from "./skill-taxonomy";

const ALL_EXERCISE_IDS: ExerciseId[] = [
  "lesen.lueckentext_ergaenzen",
  "lesen.textabschnitte_ordnen",
  "lesen.multiple_choice",
  "lesen.sprachhandlungen_zuordnen",
  "lesen.aussagen_kategorien_zuordnen",
  "lesen.aussagen_begriffspaar_zuordnen",
  "lesen.fehler_in_zusammenfassung",
  "hoeren.uebersicht_ergaenzen",
  "hoeren.textstellen_begriffspaar",
  "hoeren.fehler_in_zusammenfassung",
  "hoeren.aussagen_personen_zuordnen",
  "hoeren.gliederungspunkte_erganzen",
  "hoeren.multiple_choice",
  "hoeren.laut_schriftbild_abgleichen",
  "schreiben.argumentativen_text_schreiben",
  "schreiben.text_und_grafik_zusammenfassen",
  "sprechen.rat_geben",
  "sprechen.optionen_abwaegen",
  "sprechen.text_zusammenfassen",
  "sprechen.informationen_abgleichen_stellung_nehmen",
  "sprechen.thema_praesentieren",
  "sprechen.argumente_wiedergeben_stellung_nehmen",
  "sprechen.massnahmen_kritisieren"
];

function clampLevel(level: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(level))) as 1 | 2 | 3 | 4 | 5;
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function targetLevelFromScore(score01: number): 1 | 2 | 3 | 4 | 5 {
  if (score01 >= 0.9) {
    return 5;
  }
  if (score01 >= 0.75) {
    return 4;
  }
  if (score01 >= 0.55) {
    return 3;
  }
  if (score01 >= 0.35) {
    return 2;
  }
  return 1;
}

export function createDefaultSkillGraph(): SkillNode[] {
  return SKILL_TAGS.map((skillId) => ({
    id: skillId,
    label: SKILL_LABELS[skillId],
    category: SKILL_CATEGORIES[skillId],
    level: 2,
    confidence: 0.25,
    lastEvidenceAt: null,
    evidenceCount: 0,
    decay: 0.5
  }));
}

export function extractEvidence(report: EvaluationReport): EvidenceRecord[] {
  return report.criterionScores.flatMap((criterion) =>
    criterion.skillTags.map((skillTag) => ({
      exerciseId: report.exerciseId,
      skillTag,
      score01: criterion.score01,
      confidence: report.confidence,
      observedAt: new Date().toISOString(),
      sourceCriterion: criterion.criterion
    }))
  );
}

export function applyEvidenceToSkillGraph(
  currentGraph: SkillNode[],
  evidenceRecords: EvidenceRecord[]
): { skillGraph: SkillNode[]; deltas: SkillDelta[] } {
  const nextGraph = currentGraph.map((node) => ({ ...node }));
  const deltas: SkillDelta[] = [];

  for (const evidence of evidenceRecords) {
    const node = nextGraph.find((entry) => entry.id === evidence.skillTag);
    if (node === undefined) {
      continue;
    }

    const targetLevel = targetLevelFromScore(evidence.score01);
    const shift = targetLevel > node.level ? 1 : targetLevel < node.level ? -1 : 0;
    const nextLevel = clampLevel(node.level + shift);
    const nextConfidence = clampConfidence(node.confidence + (evidence.confidence * 0.2) - 0.02);
    const nextDecay = clampConfidence(node.decay + (nextLevel <= 2 ? 0.06 : -0.04));

    deltas.push({
      skillId: node.id,
      previousLevel: node.level,
      nextLevel,
      previousConfidence: node.confidence,
      nextConfidence
    });

    node.level = nextLevel;
    node.confidence = nextConfidence;
    node.lastEvidenceAt = evidence.observedAt;
    node.evidenceCount += 1;
    node.decay = nextDecay;
  }

  return { skillGraph: nextGraph, deltas };
}

export function buildLearnerState(userId: string): LearnerState {
  return {
    userId,
    skillGraph: createDefaultSkillGraph(),
    recentEvaluations: [],
    preferredMode: "guided"
  };
}

export function rankWeakSkills(skillGraph: SkillNode[]): SkillNode[] {
  return [...skillGraph].sort((left, right) => {
    const leftPriority = left.level + (1 - left.confidence) + left.decay;
    const rightPriority = right.level + (1 - right.confidence) + right.decay;
    return leftPriority - rightPriority;
  });
}

function exerciseIdsForSkill(skillTag: SkillTag): ExerciseId[] {
  return ALL_EXERCISE_IDS.filter((exerciseId) => getExerciseSpec(exerciseId).skillTags.includes(skillTag)).slice(0, 3);
}

export function buildStudyPlanItems(skillGraph: SkillNode[]): StudyPlanItem[] {
  return rankWeakSkills(skillGraph)
    .slice(0, 5)
    .map((skillNode, index) => ({
      id: "study-item-" + String(index + 1),
      title: "Reinforce " + skillNode.label,
      reason: "Current level " + String(skillNode.level) + "/5 with confidence " + skillNode.confidence.toFixed(2) + " suggests targeted practice is still needed.",
      exerciseIds: exerciseIdsForSkill(skillNode.id),
      promptIds: ["training.grammar.remediation", "training.skills.transfer"],
      focusSkills: [skillNode.id],
      recommendedMode: "guided"
    }));
}

export function estimateSectionTrend(reports: EvaluationReport[]): Record<string, string> {
  const bySection = new Map<string, number[]>();
  for (const report of reports) {
    const list = bySection.get(report.section) ?? [];
    list.push(report.overallScore01);
    bySection.set(report.section, list);
  }

  const summary: Record<string, string> = {};
  for (const [section, scores] of bySection.entries()) {
    const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    summary[section] = estimateTdn(average);
  }

  return summary;
}
