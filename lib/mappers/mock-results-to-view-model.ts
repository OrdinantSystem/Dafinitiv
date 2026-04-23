import { estimateSectionTrend } from "@/src/domain/skills";
import { getExerciseSpec } from "@/src/domain/testdaf";
import type { EstimatedTdn } from "@/src/domain/types";
import type { MockExamPlan, LearnerState, StudyPlanItem } from "@/src/domain/types";

import type { MockResultsViewModel } from "@/lib/mappers/types";
import {
  buildExerciseWorkspaceHref,
  buildGrammarWorkspaceHref
} from "@/lib/workspace-context";
import {
  average,
  formatEstimatedTdn,
  formatSectionLabel,
  toPercent
} from "@/lib/utils";

export function mapMockResultsToViewModel(input: {
  sessionId: string;
  learnerState: LearnerState;
  mockPlan: MockExamPlan;
  studyPlan: StudyPlanItem[];
}): MockResultsViewModel {
  const trend = estimateSectionTrend(input.learnerState.recentEvaluations);
  const sectionResults = input.mockPlan.sections.map((section) => {
    const reports = input.learnerState.recentEvaluations.filter(
      (report) => report.section === section.section
    );
    const averageScore = average(reports.map((report) => report.overallScore01)) || 0.58;
    const rawTrend = trend[section.section];
    const normalizedTrend: EstimatedTdn =
      rawTrend === "tdn_5" || rawTrend === "tdn_4" || rawTrend === "tdn_3" || rawTrend === "under_tdn_3"
        ? rawTrend
        : "tdn_4";

    return {
      section: section.section,
      label: formatSectionLabel(section.section),
      score: toPercent(averageScore),
      tdn: formatEstimatedTdn(normalizedTrend),
      href: "/" + section.section
    };
  });

  const overallAccuracy = Math.round(average(sectionResults.map((section) => section.score)));
  const targetDelta = String(Math.max(0, 85 - overallAccuracy)) + " Punkte bis TDN 5";
  const weakestSections = [...sectionResults]
    .sort((left, right) => left.score - right.score)
    .slice(0, 2);
  const weakestSection = weakestSections[0] ?? sectionResults[0];

  return {
    sessionId: input.sessionId,
    headline: "TDN 4 erreicht.",
    summary:
      "Die Mock-Auswertung zeigt ein belastbares Profil mit klaren Hebeln in Verdichtung, Hörpräzision und argumentativer Feingliederung.",
    overallAccuracy,
    targetDelta,
    heroStats: [
      { label: "Global Rank", value: "Top 8%" },
      { label: "Accuracy", value: `${overallAccuracy}%` }
    ],
    bridge: {
      title: "Bridge the Gap: Path to TDN 5",
      progressPercent: Math.max(48, Math.min(88, overallAccuracy)),
      currentLevel: "4",
      thresholdLevel: "4.5",
      targetLevel: "5",
      requiredGains: weakestSections.map((section) => ({
        label: section.label,
        delta: `+${Math.max(6, 85 - section.score)}% Needed`
      })),
      insightTitle: "AI Insight",
      insightText:
        weakestSection?.label === "Schreiben"
          ? 'Dein schriftlicher Ausdruck ist tragfähig, braucht aber variablere akademische Übergänge, damit Argumente weniger generisch wirken.'
          : `${weakestSection?.label ?? "Die nächste Sektion"} profitiert am stärksten von wiederholter Präzisionsarbeit mit klarerem strategischem Fokus.`
    },
    sectionResults,
    roadmap: input.studyPlan.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      text: item.reason,
      href: item.exerciseIds[0]
        ? buildExerciseWorkspaceHref(item.exerciseIds[0], {
            sourcePage: "mock_results",
            section: getExerciseSpec(item.exerciseIds[0]).section,
            focusSkill: item.focusSkills[0],
            agentRole: "study_planner"
          })
        : buildGrammarWorkspaceHref("grammar-focus", {
            sourcePage: "mock_results",
            focusSkill: item.focusSkills[0],
            agentRole: "grammar_trainer"
          })
    })),
    cta: {
      title: "Bereit für den Sprung zu TDN 5?",
      text:
        "Setze den nächsten Mock oder öffne direkt die priorisierte Remediation, solange die Auswertung noch frisch im Kopf ist.",
      primaryLabel: "Book Coaching",
      primaryHref: "/grammar-library",
      secondaryLabel: "Next Mock Exam",
      secondaryHref: "/mock-test"
    }
  };
}
