import { getExerciseSpec } from "../domain/testdaf";
import { getPromptPack } from "../prompts/catalog";
import type { ExerciseInstance, GenerateExerciseInput } from "../domain/types";
import type { ProviderAdapter, StructuredGenerationRequest } from "../providers/types";

function makeInstanceId(exerciseId: string): string {
  return exerciseId + "-" + Date.now();
}

function buildSelectionOptions(questionId: string): string[] {
  return [
    questionId.toUpperCase() + " · Aussage A",
    questionId.toUpperCase() + " · Aussage B",
    questionId.toUpperCase() + " · Aussage C"
  ];
}

function buildFallbackExercise(input: GenerateExerciseInput): ExerciseInstance {
  const spec = getExerciseSpec(input.exerciseId);
  const questions = Array.from({ length: spec.itemCount ?? 1 }, (_, index) => {
    const questionId = "q" + String(index + 1);

    return {
      id: questionId,
      prompt:
        spec.responseKind === "selection"
          ? "Wählen Sie die passendste Aussage für Teil " + String(index + 1) + "."
          : "Bearbeiten Sie Teil " + String(index + 1) + " für " + spec.officialLabel + ".",
      options: spec.responseKind === "selection" ? buildSelectionOptions(questionId) : undefined,
      expectedResponseShape:
        spec.responseKind === "short_text" ? "Kurzantwort mit 1 bis 4 Wörtern" : spec.responseKind
    };
  });
  const answerKey =
    spec.responseKind === "selection"
      ? questions.flatMap((question) => (question.options ? [question.options[1]] : []))
      : undefined;

  return {
    instanceId: makeInstanceId(spec.id),
    exerciseId: spec.id,
    title: spec.officialLabel,
    instructions: "Offline scaffold for " + spec.officialLabel + ". Replace with model-generated content in production.",
    mode: input.mode,
    materials: [
      {
        kind: spec.inputModality.includes("graphic") ? "chart_brief" : "text",
        title: "Generation brief",
        content:
          "Create original TestDaF-style material for " +
          spec.officialLabel +
          ". Target communicative goal: " +
          spec.communicativeGoal
      }
    ],
    questions,
    answerConstraints: {
      minWords: spec.wordCount?.min ?? spec.wordCount?.targetMin,
      maxWords: spec.wordCount?.max ?? spec.wordCount?.targetMax,
      maxWordsPerField: spec.responseKind === "short_text" ? 4 : undefined,
      exactSelections: spec.itemCount && spec.responseKind === "selection" ? spec.itemCount : undefined
    },
    promptPackId: spec.id,
    originalityChecklist: [
      "Do not reuse official texts, audio scripts, graphics, or solutions.",
      "Keep the task shape faithful, but make the source material fully original.",
      "Use modern university-related or social topics."
    ],
    answerKey
  };
}

export function buildExerciseGenerationRequest(
  input: GenerateExerciseInput
): StructuredGenerationRequest<ExerciseInstance> {
  const spec = getExerciseSpec(input.exerciseId);
  const promptPack = getPromptPack(spec.id);
  const weakSkillSummary = input.learnerState.skillGraph
    .slice(0, 4)
    .map((node) => node.id + ":" + String(node.level))
    .join(", ");

  return {
    operationName: "generate_" + spec.id,
    systemPrompt:
      "Use prompt pack " + promptPack.promptPath + " and shared blocks " + promptPack.sharedBlocks.join(", ") + ".",
    userPrompt:
      "Generate an original " + spec.officialLabel + " exercise for mode=" + input.mode + ". Weak skills: " + weakSkillSummary + ".",
    jsonSchemaName: "ExerciseInstance",
    metadata: {
      exerciseId: spec.id,
      section: spec.section,
      mode: input.mode
    },
    fallback: buildFallbackExercise(input)
  };
}

export async function generateExercise(
  provider: ProviderAdapter,
  input: GenerateExerciseInput
): Promise<ExerciseInstance> {
  const request = buildExerciseGenerationRequest(input);
  const result = await provider.generateStructured(request);
  return result.content;
}

export function createExerciseGeneratorRegistry() {
  const registry = Object.create(null) as Record<string, typeof buildExerciseGenerationRequest>;
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
    registry[exerciseId] = buildExerciseGenerationRequest;
  }
  return registry;
}
