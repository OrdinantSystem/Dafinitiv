import { TESTDAF_EXERCISES } from "../domain/testdaf";
import type { PromptBlock, PromptPack } from "../domain/types";

export const SHARED_PROMPT_BLOCKS: PromptBlock[] = [
  {
    id: "shared.tutor_core",
    promptPath: "prompts/shared/tutor-core.md",
    purpose: "Defines the coaching voice and learner-first interaction style."
  },
  {
    id: "shared.evaluator_core",
    promptPath: "prompts/shared/evaluator-core.md",
    purpose: "Defines evidence-based scoring behavior and structured evaluation output."
  },
  {
    id: "shared.feedback_style",
    promptPath: "prompts/shared/feedback-style.md",
    purpose: "Keeps feedback precise, motivating, and exam-relevant."
  },
  {
    id: "shared.skill_extraction",
    promptPath: "prompts/shared/skill-extraction.md",
    purpose: "Maps performance evidence to skill graph deltas."
  },
  {
    id: "shared.study_planner",
    promptPath: "prompts/shared/study-planner.md",
    purpose: "Turns structured learner state into sequenced study recommendations."
  },
  {
    id: "shared.json_policy",
    promptPath: "prompts/shared/json-policy.md",
    purpose: "Forces provider-neutral JSON responses."
  },
  {
    id: "shared.originality_guardrails",
    promptPath: "prompts/shared/originality-guardrails.md",
    purpose: "Prevents reuse of official copyrighted materials."
  }
];

export const TESTDAF_PROMPT_PACKS: PromptPack[] = TESTDAF_EXERCISES.map((exercise) => ({
  id: exercise.id,
  exerciseId: exercise.id,
  label: exercise.officialLabel,
  purpose: "Generate, evaluate, and coach the learner for " + exercise.officialLabel + ".",
  promptPath: exercise.promptPath,
  sharedBlocks: SHARED_PROMPT_BLOCKS.map((block) => block.id),
  supportedModes: ["guided", "mock"],
  outputSchemaName: "ExerciseAgentOutput",
  skillTags: exercise.skillTags
}));

export const TRAINING_PROMPT_PACKS: PromptPack[] = [
  {
    id: "training.grammar.remediation",
    label: "Grammar remediation drills",
    purpose: "Generate targeted grammar drills based on weak nodes in the skill graph.",
    promptPath: "prompts/training/grammar/grammar-remediation.md",
    sharedBlocks: SHARED_PROMPT_BLOCKS.map((block) => block.id),
    supportedModes: ["guided"],
    outputSchemaName: "TrainingDrillOutput",
    skillTags: [
      "grammar.word_order",
      "grammar.verb_position",
      "grammar.case_and_articles",
      "grammar.prepositions",
      "grammar.connectors_and_subordination",
      "grammar.adjective_endings"
    ]
  },
  {
    id: "training.grammar.micro_cycle",
    label: "Grammar micro-cycle",
    purpose: "Create a short sequence of escalating grammar tasks with corrections and transfer.",
    promptPath: "prompts/training/grammar/grammar-micro-cycle.md",
    sharedBlocks: SHARED_PROMPT_BLOCKS.map((block) => block.id),
    supportedModes: ["guided"],
    outputSchemaName: "TrainingDrillOutput",
    skillTags: [
      "grammar.word_order",
      "grammar.verb_position",
      "grammar.case_and_articles",
      "grammar.prepositions"
    ]
  },
  {
    id: "training.skills.remediation",
    label: "Integrated skill remediation",
    purpose: "Create non-exam exercises to reinforce weak TestDaF-related competencies.",
    promptPath: "prompts/training/skills/skill-remediation.md",
    sharedBlocks: SHARED_PROMPT_BLOCKS.map((block) => block.id),
    supportedModes: ["guided"],
    outputSchemaName: "TrainingDrillOutput",
    skillTags: [
      "task.source_mediation",
      "task.argumentation",
      "discourse.cohesion",
      "discourse.register",
      "writing.written_production",
      "speaking.spoken_production"
    ]
  },
  {
    id: "training.skills.transfer",
    label: "Transfer and reflection",
    purpose: "Push newly learned structures into freer production and reflection.",
    promptPath: "prompts/training/skills/transfer-and-reflection.md",
    sharedBlocks: SHARED_PROMPT_BLOCKS.map((block) => block.id),
    supportedModes: ["guided"],
    outputSchemaName: "TrainingDrillOutput",
    skillTags: [
      "task.task_fulfillment",
      "task.argumentation",
      "discourse.cohesion",
      "writing.written_production",
      "speaking.spoken_production"
    ]
  }
];

export const PROMPT_PACKS: PromptPack[] = [...TESTDAF_PROMPT_PACKS, ...TRAINING_PROMPT_PACKS];

export function getPromptPack(promptPackId: string): PromptPack {
  const promptPack = PROMPT_PACKS.find((entry) => entry.id === promptPackId);
  if (promptPack === undefined) {
    throw new Error("Unknown prompt pack: " + promptPackId);
  }
  return promptPack;
}
