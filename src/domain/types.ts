import type { ExerciseId, SectionId } from "./exercise-ids";
import type { SkillTag } from "./skill-taxonomy";

export type SessionMode = "guided" | "mock";
export type AgentRole =
  | "session_orchestrator"
  | "exercise_generator"
  | "exercise_evaluator"
  | "feedback_coach"
  | "skill_profiler"
  | "grammar_trainer"
  | "study_planner"
  | "mock_exam_runner"
  | "provider_router";
export type SupportLevel = "fully_supported" | "strategy_first" | "voice_ready";
export type ResponseKind =
  | "selection"
  | "short_text"
  | "essay"
  | "speech"
  | "integrated";
export type EstimatedTdn = "under_tdn_3" | "tdn_3" | "tdn_4" | "tdn_5";
export type SessionStatus = "pending" | "active" | "completed";

export interface TimingPhase {
  label: string;
  seconds: number;
}

export interface ExerciseTiming {
  taskTimeSec?: number;
  previewSec?: number;
  reviewSec?: number;
  readingSec?: number;
  preparationSec?: number;
  speakingSec?: number;
  totalMinutesApprox?: number;
  phases?: TimingPhase[];
  notes?: string;
}

export interface ExerciseSpec {
  id: ExerciseId;
  section: SectionId;
  order: number;
  officialLabel: string;
  slug: string;
  promptPath: string;
  responseKind: ResponseKind;
  inputModality: Array<"text" | "audio" | "video" | "graphic">;
  supportLevel: SupportLevel;
  itemCount?: number;
  wordCount?: {
    min?: number;
    max?: number;
    targetMin?: number;
    targetMax?: number;
  };
  timing: ExerciseTiming;
  communicativeGoal: string;
  rubricCriteria: string[];
  skillTags: SkillTag[];
  sourceNotes: string[];
}

export interface PromptPack {
  id: string;
  exerciseId?: ExerciseId;
  label: string;
  purpose: string;
  promptPath: string;
  sharedBlocks: string[];
  supportedModes: SessionMode[];
  outputSchemaName: string;
  skillTags: SkillTag[];
}

export interface PromptBlock {
  id: string;
  promptPath: string;
  purpose: string;
}

export interface ExerciseMaterial {
  kind: "text" | "table" | "bullet_list" | "chart_brief" | "audio_brief" | "video_brief";
  title: string;
  content: string;
}

export interface ExerciseQuestion {
  id: string;
  prompt: string;
  options?: string[];
  expectedResponseShape: string;
}

export interface ExerciseInstance {
  instanceId: string;
  exerciseId: ExerciseId;
  title: string;
  instructions: string;
  mode: SessionMode;
  materials: ExerciseMaterial[];
  questions: ExerciseQuestion[];
  answerConstraints: {
    minWords?: number;
    maxWords?: number;
    maxWordsPerField?: number;
    exactSelections?: number;
  };
  promptPackId: string;
  originalityChecklist: string[];
  answerKey?: string[];
}

export interface AttemptArtifact {
  attemptId: string;
  exerciseInstanceId: string;
  exerciseId: ExerciseId;
  userId: string;
  submittedAt: string;
  responseText?: string;
  responseFields?: Record<string, string>;
  selectedOptions?: string[];
  transcript?: string;
  notes?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface Attempt {
  id: string;
  sessionId: string;
  artifact: AttemptArtifact;
  evaluationStatus: "pending" | "evaluated";
  createdAt: string;
}

export interface CriterionScore {
  criterion: string;
  score01: number;
  band15: 1 | 2 | 3 | 4 | 5;
  rationale: string;
  evidence: string[];
  skillTags: SkillTag[];
}

export interface EvaluationReport {
  attemptId: string;
  exerciseId: ExerciseId;
  section: SectionId;
  overallScore01: number;
  estimatedTdn: EstimatedTdn;
  confidence: number;
  criterionScores: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
  recurringErrors: string[];
  nextActions: string[];
  summary: string;
  providerTrace: {
    mode: "structured_llm" | "local_fallback";
    providerId: string;
    model: string;
  };
}

export interface EvidenceRecord {
  exerciseId: ExerciseId;
  skillTag: SkillTag;
  score01: number;
  confidence: number;
  observedAt: string;
  sourceCriterion: string;
}

export interface SkillNode {
  id: SkillTag;
  label: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
  confidence: number;
  lastEvidenceAt: string | null;
  evidenceCount: number;
  decay: number;
}

export interface SkillDelta {
  skillId: SkillTag;
  previousLevel: 1 | 2 | 3 | 4 | 5;
  nextLevel: 1 | 2 | 3 | 4 | 5;
  previousConfidence: number;
  nextConfidence: number;
}

export interface LearnerState {
  userId: string;
  skillGraph: SkillNode[];
  recentEvaluations: EvaluationReport[];
  preferredMode: SessionMode;
  targetSections?: SectionId[];
}

export interface CoachingFeedback {
  attemptId: string;
  headline: string;
  userFacingFeedback: string;
  strengths: string[];
  weaknesses: string[];
  nextActions: string[];
  recommendedPromptIds: string[];
}

export interface StudyPlanItem {
  id: string;
  title: string;
  reason: string;
  exerciseIds: ExerciseId[];
  promptIds: string[];
  focusSkills: SkillTag[];
  recommendedMode: SessionMode;
}

export interface Session {
  id: string;
  userId: string;
  mode: SessionMode;
  status: SessionStatus;
  queue: ExerciseId[];
  currentIndex: number;
  targetSection?: SectionId;
  targetExerciseId?: ExerciseId;
  createdAt: string;
  rules: {
    allowBacktracking: boolean;
    immediateFeedback: boolean;
    strictTiming: boolean;
    textFirst: boolean;
  };
}

export interface MockSectionPlan {
  section: SectionId;
  approximateMinutes: number;
  exerciseIds: ExerciseId[];
}

export interface MockExamPlan {
  mode: "mock";
  sections: MockSectionPlan[];
  totalMinutesApprox: number;
  rules: string[];
}

export interface CreateSessionInput {
  userId: string;
  mode: SessionMode;
  targetSection?: SectionId;
  targetExerciseId?: ExerciseId;
}

export interface GenerateExerciseInput {
  exerciseId: ExerciseId;
  mode: SessionMode;
  learnerState: LearnerState;
}

export interface EvaluateAttemptInput {
  attempt: AttemptArtifact;
  learnerState?: LearnerState;
  answerKey?: string[];
}
