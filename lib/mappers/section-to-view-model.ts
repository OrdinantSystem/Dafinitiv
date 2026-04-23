import { rankWeakSkills } from "@/src/domain/skills";
import type { SectionId } from "@/src/domain/exercise-ids";
import type { ExerciseSpec, LearnerState } from "@/src/domain/types";

import type { SectionHubViewModel } from "@/lib/mappers/types";
import { buildExerciseWorkspaceHref } from "@/lib/workspace-context";
import {
  average,
  formatExerciseTimingLabel,
  formatResponseKind,
  formatSectionLabel,
  formatSupportLevel,
  toPercent
} from "@/lib/utils";

const TEXT_FIRST_SECTIONS: Partial<Record<SectionId, string>> = {
  hoeren: "Text-first simuliert die Aufgabenstruktur, während Audio- und Video-Pipelines als nächster Ausbaupunkt vorbereitet bleiben.",
  sprechen: "Sprechen bleibt in v1 text-first und strategieorientiert, damit Timing, Sequenz und Feedback bereits sauber funktionieren."
};

export function mapSectionHubToViewModel(input: {
  section: SectionId;
  exercises: ExerciseSpec[];
  learnerState: LearnerState;
}): SectionHubViewModel {
  const relevantReports = input.learnerState.recentEvaluations.filter(
    (report) => report.section === input.section
  );
  const weakSkillIds = new Set(rankWeakSkills(input.learnerState.skillGraph).slice(0, 6).map((skill) => skill.id));
  const averageScore = average(relevantReports.map((report) => report.overallScore01)) || 0.58;
  const exerciseCards = input.exercises.map((exercise) => ({
    id: exercise.id,
    slug: exercise.slug,
    label: exercise.officialLabel,
    timing: formatExerciseTimingLabel(exercise.timing),
    responseKind: formatResponseKind(exercise.responseKind),
    supportNote: formatSupportLevel(exercise.supportLevel),
    href: buildExerciseWorkspaceHref(exercise.id, {
      sourcePage: "section_hub",
      section: input.section,
      focusSkill: exercise.skillTags[0],
      agentRole: "exercise_generator"
    }),
    skillTags: exercise.skillTags.slice(0, 3)
  }));

  const focusCards = [...input.exercises]
    .sort((left, right) => {
      const leftWeight = left.skillTags.filter((skillTag) => weakSkillIds.has(skillTag)).length;
      const rightWeight = right.skillTags.filter((skillTag) => weakSkillIds.has(skillTag)).length;
      return rightWeight - leftWeight;
    })
    .slice(0, 2)
    .map((exercise) => ({
      title: exercise.officialLabel,
      description: exercise.communicativeGoal,
      badge: exercise.skillTags[0] ?? "Task fit",
      href: buildExerciseWorkspaceHref(exercise.id, {
        sourcePage: "section_hub",
        section: input.section,
        focusSkill: exercise.skillTags[0],
        agentRole: "exercise_generator"
      }),
      ctaLabel: "Direkt öffnen"
    }));

  return {
    section: input.section,
    title: formatSectionLabel(input.section) + " Hub",
    subtitle: "Aufgabenarchitektur, adaptive Fokuspunkte und direkte Einstiege in die LLM-gestützte Übungsansicht.",
    accentLabel: averageScore >= 0.7 ? "Stabiler Trend" : "Höchster Hebel heute",
    textFirstNote: TEXT_FIRST_SECTIONS[input.section],
    metrics: [
      {
        label: "Aktuelle Sicherheit",
        value: String(toPercent(averageScore)) + "%",
        detail: "Gemittelt aus den jüngsten strukturierten Auswertungen.",
        progress: toPercent(averageScore),
        tone: "primary"
      },
      {
        label: "Aufgabenabdeckung",
        value: String(input.exercises.length) + " Typen",
        detail: "Alle offiziellen digitalen TestDaF-Formate der Sektion sind verlinkt.",
        progress: 100,
        tone: "secondary"
      },
      {
        label: "Adaptiver Fokus",
        value: String(focusCards.length) + " Empfehlungen",
        detail: "Gewichtet nach Skill-Graph und jüngsten Evaluationen.",
        progress: 68,
        tone: "tertiary"
      }
    ],
    focusCards,
    exercises: exerciseCards,
    challenge: {
      title: input.exercises[input.exercises.length - 1]?.officialLabel ?? "Nächste Aufgabe",
      description: "Wechsle direkt in die gemeinsame Workspace-Ansicht und bearbeite die nächste priorisierte Aufgabe.",
      href: exerciseCards[0]?.href ?? "/",
      ctaLabel: "Workspace öffnen"
    }
  };
}
