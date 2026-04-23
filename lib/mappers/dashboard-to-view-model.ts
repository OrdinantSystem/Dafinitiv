import { estimateSectionTrend, rankWeakSkills } from "@/src/domain/skills";
import { TESTDAF_EXERCISES, getExerciseSpec } from "@/src/domain/testdaf";
import type { SectionId } from "@/src/domain/exercise-ids";
import type { EstimatedTdn } from "@/src/domain/types";
import type { LearnerState, StudyPlanItem } from "@/src/domain/types";

import type { DemoActivityItem } from "@/lib/mock-data/demo";
import type { DashboardViewModel } from "@/lib/mappers/types";
import {
  buildExerciseWorkspaceHref,
  buildGrammarWorkspaceHref,
  buildMistakeWorkspaceHref
} from "@/lib/workspace-context";
import {
  average,
  formatEstimatedTdn,
  formatSectionLabel,
  getSectionHref,
  toPercent
} from "@/lib/utils";

function mapStudyPlanHref(item: StudyPlanItem): string {
  if (item.exerciseIds.length > 0) {
    const exercise = getExerciseSpec(item.exerciseIds[0]);

    return buildExerciseWorkspaceHref(item.exerciseIds[0], {
      sourcePage: "study_plan",
      section: exercise.section,
      focusSkill: item.focusSkills[0],
      agentRole: "study_planner"
    });
  }

  if (item.promptIds.some((promptId) => promptId.startsWith("training.grammar"))) {
    return buildGrammarWorkspaceHref("grammar-focus", {
      sourcePage: "study_plan",
      focusSkill: item.focusSkills[0],
      agentRole: "grammar_trainer"
    });
  }

  return buildMistakeWorkspaceHref("subordinate-clause-order", {
    sourcePage: "study_plan",
    focusSkill: item.focusSkills[0],
    agentRole: "feedback_coach"
  });
}

function mapRecentActivityHref(item: DemoActivityItem): string {
  if (item.accent === "grammar") {
    return buildGrammarWorkspaceHref("grammar-focus", {
      sourcePage: "dashboard",
      agentRole: "grammar_trainer"
    });
  }

  const slug = item.href.split("/").pop();
  const matchedExercise = TESTDAF_EXERCISES.find((exercise) => exercise.slug === slug);

  if (!matchedExercise) {
    return item.href;
  }

  return buildExerciseWorkspaceHref(matchedExercise.id, {
    sourcePage: "dashboard",
    section: matchedExercise.section,
    focusSkill: matchedExercise.skillTags[0],
    agentRole: "study_planner"
  });
}

export function mapDashboardToViewModel(input: {
  learnerState: LearnerState;
  studyPlan: StudyPlanItem[];
  recentActivity: DemoActivityItem[];
  llmStatus: string;
}): DashboardViewModel {
  const sectionTrend = estimateSectionTrend(input.learnerState.recentEvaluations);
  const allSections: SectionId[] = ["lesen", "hoeren", "schreiben", "sprechen"];
  const sections = allSections.map((section) => {
    const reports = input.learnerState.recentEvaluations.filter((report) => report.section === section);
    const averageScore = average(reports.map((report) => report.overallScore01));
    const rawTrend = sectionTrend[section];
    const normalizedTrend: EstimatedTdn =
      rawTrend === "tdn_5" || rawTrend === "tdn_4" || rawTrend === "tdn_3" || rawTrend === "under_tdn_3"
        ? rawTrend
        : "tdn_4";

    return {
      section,
      label: formatSectionLabel(section),
      score: toPercent(averageScore || 0.56),
      tdn: formatEstimatedTdn(normalizedTrend),
      href: getSectionHref(section)
    };
  });

  const weakSkills = rankWeakSkills(input.learnerState.skillGraph)
    .slice(0, 4)
    .map((skill) => ({
      label: skill.label,
      level: skill.level,
      confidence: Number(skill.confidence.toFixed(2))
    }));

  const studyPlan = input.studyPlan.slice(0, 4).map((item) => ({
    id: item.id,
    title: item.title,
    reason: item.reason,
    href: mapStudyPlanHref(item),
    mode: item.recommendedMode === "guided" ? "Geführtes Training" : "Mock"
  }));

  return {
    llmStatus: input.llmStatus,
    sections,
    weakSkills,
    studyPlan,
    recentActivity: input.recentActivity.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: mapRecentActivityHref(item),
      accent: item.accent
    }))
  };
}
