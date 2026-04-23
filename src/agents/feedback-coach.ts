import { getExerciseSpec } from "../domain/testdaf";
import type { CoachingFeedback, EvaluationReport } from "../domain/types";

export function buildCoachingFeedback(report: EvaluationReport): CoachingFeedback {
  const spec = getExerciseSpec(report.exerciseId);
  const recommendedPromptIds =
    report.section === "schreiben" || report.section === "sprechen"
      ? ["training.skills.remediation", "training.skills.transfer"]
      : ["training.grammar.remediation", "training.skills.transfer"];

  return {
    attemptId: report.attemptId,
    headline: spec.officialLabel + ": " + report.estimatedTdn.toUpperCase(),
    userFacingFeedback:
      "You handled the " +
      spec.officialLabel +
      " format with an estimated " +
      report.estimatedTdn +
      ". Focus next on " +
      report.nextActions.slice(0, 2).join(" "),
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    nextActions: report.nextActions,
    recommendedPromptIds
  };
}
