"use server";

import { getWebApplicationService } from "@/lib/server/app-service";
import { generateWorkspaceExerciseViewModel } from "@/lib/server/page-data";
import { buildDemoLearnerState } from "@/lib/mock-data/demo";
import type { WorkspaceLaunchContext } from "@/lib/workspace-context";
import { serverDebugLog } from "@/lib/server/debug-log";
import type {
  WorkspaceVariant,
  WorkspaceSubmissionInput,
  WorkspaceSubmissionResult,
  WorkspaceViewModel
} from "@/lib/mappers/types";

export async function generateWorkspaceReadyState(input: {
  variant: WorkspaceVariant;
  slug: string;
  launchContext?: WorkspaceLaunchContext;
}): Promise<WorkspaceViewModel> {
  if (input.variant !== "exercise" && input.variant !== "mock") {
    throw new Error("Manual generation is only supported for exercise and mock workspaces.");
  }

  serverDebugLog("workspace-ready", "requested", {
    variant: input.variant,
    slug: input.slug,
    sourcePage: input.launchContext?.sourcePage ?? null
  });

  return generateWorkspaceExerciseViewModel({
    variant: input.variant,
    slug: input.slug,
    context: input.launchContext
  });
}

export async function submitWorkspaceResponse(
  input: WorkspaceSubmissionInput
): Promise<WorkspaceSubmissionResult> {
  const { env, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);

  serverDebugLog("workspace-submit", "received", {
    variant: input.variant,
    mode: input.mode,
    postSubmitMode: input.postSubmitMode,
    responseKind: input.responseKind,
    exerciseId: input.exerciseId ?? null
  });

  if (input.postSubmitMode === "deferred") {
    serverDebugLog("workspace-submit", "deferred", {
      variant: input.variant,
      exerciseId: input.exerciseId ?? null
    });

    return {
      mode: "deferred",
      headline: "Antwort gesichert",
      summary:
        "Im Mock-Modus wird die Antwort aufgenommen und für die spätere Gesamtauswertung vorgemerkt.",
      strengths: ["Sequenz und Timing bleiben im Prüfungsmodus intakt."],
      weaknesses: ["Feedback wird bewusst erst nach dem Mock eingeblendet."],
      nextActions: ["Zur nächsten Aufgabe oder zurück zur Mock-Übersicht wechseln."]
    };
  }

  if (input.postSubmitMode === "reflection" || !input.exerciseId) {
    serverDebugLog("workspace-submit", "reflection_only", {
      variant: input.variant,
      exerciseId: input.exerciseId ?? null
    });

    return {
      mode: "reflection",
      headline: "Notiz aktualisiert",
      summary:
        "Deine Eingabe ist als Transfer- oder Fehlerreflexion erfasst und kann direkt in die nächste Übung überführt werden.",
      strengths: ["Die Workspace-Variante bleibt im selben Arbeitsfluss."],
      weaknesses: ["Tiefe Trainingsagenten für Grammar und Notebook folgen im nächsten Ausbau."],
      nextActions: ["Eine offizielle Aufgabe mit direkter Evaluation anschließen."]
    };
  }

  const responseText =
    input.responseText ??
    (input.responseFields
      ? Object.values(input.responseFields)
          .map((value) => value.trim())
          .filter(Boolean)
          .join("\n")
      : undefined);

  const attempt = {
    attemptId: "attempt-" + Date.now(),
    exerciseInstanceId: input.exerciseInstanceId ?? "workspace-instance",
    exerciseId: input.exerciseId,
    userId: env.APP_DEMO_USER_ID,
    submittedAt: new Date().toISOString(),
    responseText:
      input.responseKind === "essay" ||
      input.responseKind === "integrated" ||
      input.responseKind === "speech"
        ? responseText
        : undefined,
    responseFields: input.responseFields,
    selectedOptions: input.selectedOptions,
    transcript: input.responseKind === "speech" ? responseText : undefined
  };

  serverDebugLog("workspace-submit", "evaluation.start", {
    exerciseId: input.exerciseId,
    responseTextLength: responseText?.length ?? 0,
    selectedOptionsCount: input.selectedOptions?.length ?? 0,
    responseFieldCount: input.responseFields ? Object.keys(input.responseFields).length : 0
  });

  const evaluation = await service.evaluateAttempt({
    attempt,
    learnerState,
    answerKey: input.answerKey
  });
  const feedback = service.buildFeedback(evaluation);

  serverDebugLog("workspace-submit", "evaluation.complete", {
    exerciseId: input.exerciseId,
    providerMode: evaluation.providerTrace.mode,
    estimatedTdn: evaluation.estimatedTdn
  });

  return {
    mode: "evaluated",
    headline: feedback.headline,
    summary: feedback.userFacingFeedback,
    strengths: feedback.strengths,
    weaknesses: feedback.weaknesses,
    nextActions: feedback.nextActions,
    recommendedPromptIds: feedback.recommendedPromptIds,
    estimatedTdn: evaluation.estimatedTdn,
    providerMode: evaluation.providerTrace.mode
  };
}
