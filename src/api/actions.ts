import { evaluateAttempt } from "../agents/exercise-evaluator";
import { generateExercise } from "../agents/exercise-generator";
import { buildCoachingFeedback } from "../agents/feedback-coach";
import { buildGrammarTrainingBrief } from "../agents/grammar-trainer";
import { buildMockExamPlan } from "../agents/mock-exam-runner";
import { createSession } from "../agents/session-orchestrator";
import { updateLearnerStateFromEvaluation } from "../agents/skill-profiler";
import { generateStudyPlan } from "../agents/study-planner";
import { buildLearnerState } from "../domain/skills";
import type {
  AttemptArtifact,
  CreateSessionInput,
  EvaluateAttemptInput,
  GenerateExerciseInput,
  LearnerState
} from "../domain/types";
import type { ProviderRouter } from "../providers/provider-router";

export function createApplicationService(providerRouter: ProviderRouter) {
  return {
    createSession(input: CreateSessionInput) {
      return createSession(input);
    },

    buildLearnerState(userId: string): LearnerState {
      return buildLearnerState(userId);
    },

    async generateExercise(input: GenerateExerciseInput) {
      const provider = providerRouter.resolve();
      return generateExercise(provider, input);
    },

    submitAttempt(attemptArtifact: AttemptArtifact): AttemptArtifact {
      return attemptArtifact;
    },

    async evaluateAttempt(input: EvaluateAttemptInput) {
      const provider = providerRouter.resolve();
      return evaluateAttempt(provider, input);
    },

    recomputeSkills(learnerState: LearnerState, report: Awaited<ReturnType<typeof evaluateAttempt>>) {
      return updateLearnerStateFromEvaluation(learnerState, report);
    },

    generateStudyPlan(learnerState: LearnerState) {
      return generateStudyPlan(learnerState);
    },

    buildFeedback(report: Awaited<ReturnType<typeof evaluateAttempt>>) {
      return buildCoachingFeedback(report);
    },

    buildGrammarTrainingBrief(learnerState: LearnerState) {
      return buildGrammarTrainingBrief(learnerState);
    },

    buildMockExamPlan() {
      return buildMockExamPlan();
    }
  };
}
