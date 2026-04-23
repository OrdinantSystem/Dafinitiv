import { buildStudyPlanItems } from "../domain/skills";
import type { LearnerState, StudyPlanItem } from "../domain/types";

export function generateStudyPlan(learnerState: LearnerState): StudyPlanItem[] {
  return buildStudyPlanItems(learnerState.skillGraph);
}
