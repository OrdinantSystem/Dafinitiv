import { rankWeakSkills } from "../domain/skills";
import type { LearnerState } from "../domain/types";

export function buildGrammarTrainingBrief(learnerState: LearnerState): {
  promptId: string;
  focusSkills: string[];
  rationale: string;
} {
  const weakGrammar = rankWeakSkills(learnerState.skillGraph)
    .filter((skill) => skill.category === "grammar")
    .slice(0, 3);

  return {
    promptId:
      weakGrammar.length > 1
        ? "training.grammar.micro_cycle"
        : "training.grammar.remediation",
    focusSkills: weakGrammar.map((skill) => skill.id),
    rationale: "Select the weakest grammar nodes and turn them into short adaptive drills."
  };
}
