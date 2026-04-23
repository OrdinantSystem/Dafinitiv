import { applyEvidenceToSkillGraph, extractEvidence } from "../domain/skills";
import type { EvaluationReport, LearnerState } from "../domain/types";

export function updateLearnerStateFromEvaluation(
  learnerState: LearnerState,
  report: EvaluationReport
): LearnerState {
  const evidence = extractEvidence(report);
  const result = applyEvidenceToSkillGraph(learnerState.skillGraph, evidence);

  return {
    ...learnerState,
    skillGraph: result.skillGraph,
    recentEvaluations: [...learnerState.recentEvaluations, report]
  };
}
