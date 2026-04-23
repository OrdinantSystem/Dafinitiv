import { averageCriterionScore, estimateTdn, toBand15 } from "../domain/evaluation";
import { getExerciseSpec } from "../domain/testdaf";
import type {
  CriterionScore,
  EvaluateAttemptInput,
  EvaluationReport
} from "../domain/types";
import type { ProviderAdapter, StructuredGenerationRequest } from "../providers/types";

function objectiveAccuracy(selectedOptions: string[] | undefined, answerKey: string[] | undefined): number {
  if (selectedOptions === undefined || answerKey === undefined || answerKey.length === 0) {
    return 0.4;
  }

  const matches = answerKey.filter((entry) => selectedOptions.includes(entry)).length;
  return matches / answerKey.length;
}

function shortTextCoverage(
  responseFields: Record<string, string> | undefined,
  responseText: string | undefined,
  expectedItems: number | undefined
): number {
  const expectedCount = expectedItems ?? 1;

  if (responseFields && Object.keys(responseFields).length > 0) {
    const filledFields = Object.values(responseFields).filter((value) => value.trim().length > 0).length;
    return Math.max(0.2, filledFields / expectedCount);
  }

  if (responseText) {
    const chunks = responseText
      .split(/\n+/)
      .map((value) => value.trim())
      .filter(Boolean);
    return Math.max(0.2, chunks.length / expectedCount);
  }

  return 0.2;
}

function productiveHeuristics(responseText: string | undefined, expectedMinWords?: number): number {
  if (responseText === undefined) {
    return 0.1;
  }

  const words = responseText.trim().split(/\s+/).filter(Boolean).length;
  if (expectedMinWords === undefined) {
    return words >= 80 ? 0.7 : words >= 30 ? 0.55 : 0.35;
  }

  if (words >= expectedMinWords) {
    return 0.72;
  }
  if (words >= expectedMinWords * 0.75) {
    return 0.55;
  }
  return 0.3;
}

function fallbackCriterion(
  criterion: string,
  score01: number,
  skillTags: CriterionScore["skillTags"],
  rationale: string
): CriterionScore {
  return {
    criterion,
    score01,
    band15: toBand15(score01),
    rationale,
    evidence: [],
    skillTags
  };
}

function fallbackEvaluate(input: EvaluateAttemptInput): EvaluationReport {
  const spec = getExerciseSpec(input.attempt.exerciseId);
  const objectiveScore =
    spec.responseKind === "selection"
      ? objectiveAccuracy(input.attempt.selectedOptions, input.answerKey)
      : spec.responseKind === "short_text"
        ? shortTextCoverage(
            input.attempt.responseFields,
            input.attempt.responseText,
            spec.itemCount
          )
      : productiveHeuristics(
          input.attempt.responseText ?? input.attempt.transcript,
          spec.wordCount?.min ?? spec.wordCount?.targetMin
        );

  const criterionScores: CriterionScore[] = spec.rubricCriteria.map((criterion) =>
    fallbackCriterion(
      criterion,
      objectiveScore,
      spec.skillTags.slice(0, 3),
      "Fallback local heuristic based on objective accuracy or response length."
    )
  );

  const overallScore01 = averageCriterionScore(criterionScores);

  return {
    attemptId: input.attempt.attemptId,
    exerciseId: spec.id,
    section: spec.section,
    overallScore01,
    estimatedTdn: estimateTdn(overallScore01),
    confidence: 0.35,
    criterionScores,
    strengths: overallScore01 >= 0.6 ? ["Response appears structurally plausible."] : [],
    weaknesses:
      overallScore01 < 0.6
        ? ["The response still needs stronger task coverage or linguistic precision."]
        : ["Needs richer evidence-based evaluation from the configured LLM."],
    recurringErrors: [],
    nextActions: [
      "Run the structured evaluator prompt for a fuller judgement.",
      "Feed the result into the skill graph update pipeline."
    ],
    summary: "Local fallback evaluation only. Replace with structured LLM scoring in production.",
    providerTrace: {
      mode: "local_fallback",
      providerId: "local",
      model: "heuristic"
    }
  };
}

export function buildEvaluationRequest(
  input: EvaluateAttemptInput
): StructuredGenerationRequest<EvaluationReport> {
  const spec = getExerciseSpec(input.attempt.exerciseId);

  return {
    operationName: "evaluate_" + spec.id,
    systemPrompt:
      "Use prompt pack " + spec.promptPath + " with shared evaluator, feedback, skill extraction, json policy, and originality guardrails.",
    userPrompt:
      "Evaluate the learner attempt for " + spec.officialLabel + ". Return criterion scores, strengths, weaknesses, recurring errors, next actions, and an estimated TDN tendency.",
    jsonSchemaName: "EvaluationReport",
    metadata: {
      exerciseId: spec.id,
      section: spec.section
    },
    fallback: fallbackEvaluate(input)
  };
}

export async function evaluateAttempt(
  provider: ProviderAdapter | null,
  input: EvaluateAttemptInput
): Promise<EvaluationReport> {
  if (provider === null) {
    return fallbackEvaluate(input);
  }

  try {
    const result = await provider.generateStructured(buildEvaluationRequest(input));
    return result.content;
  } catch {
    return fallbackEvaluate(input);
  }
}

export function createExerciseEvaluatorRegistry() {
  const registry = Object.create(null) as Record<string, typeof buildEvaluationRequest>;
  for (const exerciseId of [
    "lesen.lueckentext_ergaenzen",
    "lesen.textabschnitte_ordnen",
    "lesen.multiple_choice",
    "lesen.sprachhandlungen_zuordnen",
    "lesen.aussagen_kategorien_zuordnen",
    "lesen.aussagen_begriffspaar_zuordnen",
    "lesen.fehler_in_zusammenfassung",
    "hoeren.uebersicht_ergaenzen",
    "hoeren.textstellen_begriffspaar",
    "hoeren.fehler_in_zusammenfassung",
    "hoeren.aussagen_personen_zuordnen",
    "hoeren.gliederungspunkte_erganzen",
    "hoeren.multiple_choice",
    "hoeren.laut_schriftbild_abgleichen",
    "schreiben.argumentativen_text_schreiben",
    "schreiben.text_und_grafik_zusammenfassen",
    "sprechen.rat_geben",
    "sprechen.optionen_abwaegen",
    "sprechen.text_zusammenfassen",
    "sprechen.informationen_abgleichen_stellung_nehmen",
    "sprechen.thema_praesentieren",
    "sprechen.argumente_wiedergeben_stellung_nehmen",
    "sprechen.massnahmen_kritisieren"
  ]) {
    registry[exerciseId] = buildEvaluationRequest;
  }
  return registry;
}
