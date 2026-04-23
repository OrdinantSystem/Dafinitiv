"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  generateWorkspaceReadyState,
  submitWorkspaceResponse
} from "@/app/workspace/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import type {
  WorkspaceSubmissionInput,
  WorkspaceSubmissionResult,
  WorkspaceViewModel
} from "@/lib/mappers/types";
import { cn } from "@/lib/utils";

function collectPayload(viewModel: WorkspaceViewModel, values: Record<string, string>): WorkspaceSubmissionInput {
  const radioFields = viewModel.responseFields.filter((field) => field.kind === "radio");
  const textFields = viewModel.responseFields.filter((field) => field.kind !== "radio");
  const selectedOptions = radioFields.map((field) => values[field.id]).filter(Boolean);
  const responseFields =
    textFields.length > 1
      ? Object.fromEntries(textFields.map((field) => [field.id, values[field.id] ?? ""]))
      : undefined;
  const singleTextField = textFields.length === 1 ? values[textFields[0].id] ?? "" : undefined;

  return {
    variant: viewModel.variant,
    mode: viewModel.mode,
    postSubmitMode: viewModel.postSubmitMode,
    responseKind: viewModel.responseKind,
    exerciseId: viewModel.exerciseId,
    exerciseInstanceId: viewModel.exerciseInstanceId,
    answerKey: viewModel.answerKey,
    responseText: singleTextField,
    responseFields,
    selectedOptions
  };
}

function buildSubmissionPreview(
  responseFields: WorkspaceViewModel["responseFields"],
  values: Record<string, string>
): string {
  const orderedValues = responseFields
    .map((field) => values[field.id]?.trim())
    .filter(Boolean) as string[];

  return orderedValues.join(" ").slice(0, 280) || "Antwort gesendet.";
}

function ResultPanel({
  result,
  viewModel
}: {
  result: WorkspaceSubmissionResult;
  viewModel: WorkspaceViewModel;
}) {
  const deferred = result.mode !== "evaluated";

  return (
    <Card className="space-y-6" tone={deferred ? "night" : "default"}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Pill tone={deferred ? "contrast" : "primary"}>{result.mode}</Pill>
          {result.providerMode ? (
            <Pill tone={deferred ? "contrast" : "soft"}>provider: {result.providerMode}</Pill>
          ) : null}
        </div>
        <h3 className={deferred ? "text-[2rem] font-extrabold tracking-[-0.04em] text-white" : "text-[2rem] font-extrabold tracking-[-0.04em] text-on-surface"}>
          {result.headline}
        </h3>
        <p className={deferred ? "text-sm leading-7 text-white/74" : "text-sm leading-7 text-on-surface-variant"}>
          {result.summary}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Stärken", items: result.strengths },
          { label: "Zu verstärken", items: result.weaknesses },
          { label: "Nächste Schritte", items: result.nextActions }
        ].map((group) => (
          <div
            className={cn(
              "rounded-[1.5rem] p-5",
              deferred ? "bg-white/10" : "bg-surface-container-low"
            )}
            key={group.label}
          >
            <p className={cn("text-[0.68rem] font-extrabold uppercase tracking-[0.18em]", deferred ? "text-white/65" : "text-on-surface-variant")}>
              {group.label}
            </p>
            <ul className={cn("mt-4 space-y-3 text-sm leading-7", deferred ? "text-white/82" : "text-on-surface")}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {viewModel.postSubmitOptions?.length ? (
        <div className="flex flex-wrap gap-3">
          {viewModel.postSubmitOptions.map((option) => (
            <ButtonLink
              href={option.href}
              key={option.label}
              variant={option.variant === "primary" ? (deferred ? "inverse" : "primary") : deferred ? "quiet" : "secondary"}
            >
              {option.label}
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export function WorkspaceClient({ viewModel }: { viewModel: WorkspaceViewModel }) {
  const [currentViewModel, setCurrentViewModel] = useState<WorkspaceViewModel>(viewModel);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<WorkspaceSubmissionResult | null>(null);
  const [submittedPreview, setSubmittedPreview] = useState<string | null>(null);
  const [isPreparing, startPreparingTransition] = useTransition();
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const hasAnyValue = useMemo(
    () => Object.values(values).some((value) => value.trim().length > 0),
    [values]
  );
  const radioFields = currentViewModel.responseFields.filter((field) => field.kind === "radio");
  const textFields = currentViewModel.responseFields.filter((field) => field.kind !== "radio");
  const waitingForReady = currentViewModel.generation.status === "pending";

  useEffect(() => {
    setCurrentViewModel(viewModel);
    setValues({});
    setResult(null);
    setSubmittedPreview(null);
  }, [viewModel]);

  useEffect(() => {
    if (!currentViewModel.debug?.enabled) {
      return;
    }

    console.info("[workspace] mounted", {
      route: currentViewModel.debug.route,
      runtimeMode: currentViewModel.debug.runtimeMode,
      realLlmEnabled: currentViewModel.debug.realLlmEnabled,
      usesLlmOnReady: currentViewModel.debug.usesLlmOnReady,
      usesLlmOnSubmit: currentViewModel.debug.usesLlmOnSubmit,
      model: currentViewModel.debug.configuredModel,
      generationStatus: currentViewModel.generation.status
    });
  }, [currentViewModel]);

  const prepareWorkspace = () => {
    startPreparingTransition(async () => {
      if (currentViewModel.debug?.enabled) {
        console.info("[workspace] ready.start", {
          route: currentViewModel.debug.route,
          variant: currentViewModel.variant,
          slug: currentViewModel.slug
        });
      }

      const nextViewModel = await generateWorkspaceReadyState({
        variant: currentViewModel.variant,
        slug: currentViewModel.slug,
        launchContext: currentViewModel.launchContext
      });

      setCurrentViewModel(nextViewModel);
      setValues({});
      setResult(null);
      setSubmittedPreview(null);

      if (nextViewModel.debug?.enabled) {
        console.info("[workspace] ready.complete", {
          route: nextViewModel.debug.route,
          variant: nextViewModel.variant,
          exerciseId: nextViewModel.exerciseId ?? null,
          generationStatus: nextViewModel.generation.status
        });
      }
    });
  };

  const submit = () => {
    startSubmittingTransition(async () => {
      if (currentViewModel.debug?.enabled) {
        console.info("[workspace] submit.start", {
          route: currentViewModel.debug.route,
          exerciseId: currentViewModel.exerciseId,
          responseKind: currentViewModel.responseKind,
          filledFields: Object.values(values).filter((value) => value.trim().length > 0).length
        });
      }

      setSubmittedPreview(buildSubmissionPreview(currentViewModel.responseFields, values));
      const submission = await submitWorkspaceResponse(collectPayload(currentViewModel, values));
      setResult(submission);

      if (currentViewModel.debug?.enabled) {
        console.info("[workspace] submit.complete", {
          route: currentViewModel.debug.route,
          mode: submission.mode,
          providerMode: submission.providerMode ?? null,
          estimatedTdn: submission.estimatedTdn ?? null
        });
      }
    });
  };

  return (
    <div className="workspace-grid items-start pb-8">
      <aside className="space-y-6 xl:sticky xl:top-[5.75rem]">
        <Card className="space-y-5" tone={currentViewModel.strictChrome ? "night" : "default"}>
          <div className="flex flex-wrap items-center gap-3">
            <Pill tone={currentViewModel.strictChrome ? "contrast" : "primary"}>{currentViewModel.supportBadge}</Pill>
            <Pill tone={currentViewModel.strictChrome ? "contrast" : "soft"}>{currentViewModel.timerLabel}</Pill>
            <Pill tone={currentViewModel.strictChrome ? "contrast" : "soft"}>{currentViewModel.agentLabel}</Pill>
          </div>
          <div>
            <p className={currentViewModel.strictChrome ? "editorial-kicker-contrast" : "editorial-kicker"}>
              Task Context
            </p>
            <h2
              className={
                currentViewModel.strictChrome
                  ? "mt-3 text-[1.8rem] font-extrabold leading-tight tracking-[-0.04em] text-white"
                  : "mt-3 text-[1.8rem] font-extrabold leading-tight tracking-[-0.04em] text-on-surface"
              }
            >
              {currentViewModel.taskTitle}
            </h2>
            <p className={currentViewModel.strictChrome ? "mt-4 text-sm leading-7 text-white/72" : "mt-4 text-sm leading-7 text-on-surface-variant"}>
              {currentViewModel.taskInstructions}
            </p>
            <p className={currentViewModel.strictChrome ? "mt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/58" : "mt-4 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant"}>
              {currentViewModel.contextLabel} • {currentViewModel.resolvedFrom}
            </p>
          </div>
          {currentViewModel.nextLink ? (
            <div className="pt-2">
              <ButtonLink href={currentViewModel.nextLink.href} variant={currentViewModel.strictChrome ? "inverse" : "secondary"}>
                {currentViewModel.nextLink.label}
              </ButtonLink>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-5" tone="inset">
          <p className="editorial-kicker">Conversation Frame</p>
          <div className="space-y-5">
            {currentViewModel.timeline.map((message) => (
              <div className="flex gap-3" key={message.id}>
                <div
                  className={cn(
                    "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-secondary-container text-secondary"
                      : "bg-surface-container-lowest text-on-surface-variant ghost-outline"
                  )}
                >
                  <AppIcon className="h-4 w-4" name={message.role === "assistant" ? "sparkles" : "layers"} />
                </div>
                <div>
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                    {message.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-on-surface">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </aside>

      <div className="space-y-8">
        <div className="space-y-6">
          {currentViewModel.timeline.map((message) => (
            <div className="flex gap-5" key={`${message.id}-bubble`}>
              <div
                className={cn(
                  "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  message.role === "assistant"
                    ? "bg-secondary-container text-secondary"
                    : "bg-surface-container-high text-on-surface-variant"
                )}
              >
                <AppIcon className="h-4 w-4" name={message.role === "assistant" ? "sparkles" : "layers"} />
              </div>
              <div className="space-y-2">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/65">
                  {message.label}
                </span>
                <p className="max-w-3xl text-base leading-8 text-on-surface">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <Card className="relative overflow-visible" tone="muted">
          <div className="absolute -top-4 left-6">
            <Pill>{currentViewModel.taskTitle}</Pill>
          </div>
          <div className="space-y-8 pt-4">
            <div>
              <p className="editorial-kicker">{currentViewModel.materialsLabel}</p>
              <h2 className="mt-2 text-[1.9rem] font-extrabold tracking-[-0.03em] text-on-surface">
                {currentViewModel.taskTitle}
              </h2>
            </div>

            {waitingForReady ? (
              <div className="rounded-[1.6rem] bg-surface-container-lowest p-8 shadow-soft ghost-outline">
                <p className="editorial-kicker">Manual Start</p>
                <h3 className="mt-3 text-[1.75rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Ready when you are
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-on-surface-variant">
                  {currentViewModel.generation.prompt ??
                    "Die Aufgabe wird erst erzeugt, wenn du aktiv auf Ready klickst."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button disabled={isPreparing} onClick={prepareWorkspace}>
                    {isPreparing ? "Wird vorbereitet..." : currentViewModel.generation.ctaLabel ?? "Ready"}
                  </Button>
                  <p className="max-w-xl text-sm leading-7 text-on-surface-variant">
                    {currentViewModel.helperText}
                  </p>
                </div>
              </div>
            ) : (
              <div className={cn("grid gap-4", currentViewModel.materials.length > 1 && "xl:grid-cols-2")}>
                {currentViewModel.materials.map((material, index) => (
                  <div
                    className={cn(
                      "rounded-[1.5rem] bg-surface-container-lowest p-6 shadow-soft ghost-outline",
                      index === 0 && currentViewModel.materials.length === 1 && "xl:max-w-none"
                    )}
                    key={material.title}
                  >
                    <p className="editorial-kicker">{material.kind}</p>
                    <h3 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-on-surface">
                      {material.title}
                    </h3>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-on-surface-variant">
                      {material.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!waitingForReady && radioFields.length > 0 ? (
              <div className="space-y-8 border-t border-outline-variant/18 pt-8">
                {radioFields.map((field, fieldIndex) => (
                  <div className="space-y-4" key={field.id}>
                    <p className="text-base font-bold tracking-[-0.02em] text-on-surface">
                      {fieldIndex + 1}. {field.label}
                    </p>
                    <div className="grid gap-3">
                      {field.options?.map((option) => {
                        const active = values[field.id] === option;

                        return (
                          <label
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-[1.2rem] bg-surface-container-lowest px-4 py-4 transition-colors shadow-soft ghost-outline",
                              active && "bg-primary-fixed/20"
                            )}
                            key={option}
                          >
                            <input
                              checked={active}
                              className="mt-1 h-4 w-4 accent-[rgb(var(--color-primary))]"
                              name={field.id}
                              onChange={() => setValues((current) => ({ ...current, [field.id]: option }))}
                              type="radio"
                            />
                            <span className="text-sm leading-7 text-on-surface">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>

        {!waitingForReady && textFields.length > 0 ? (
          <Card className="space-y-6" tone="default">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="editorial-kicker">{currentViewModel.responseLabel}</p>
                <h2 className="mt-2 text-[1.75rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Formuliere deine Antwort
                </h2>
              </div>
              <Pill tone="soft">{currentViewModel.responseKind}</Pill>
            </div>
            <div className="space-y-5">
              {textFields.map((field) => (
                <div className="space-y-3" key={field.id}>
                  <label className="block text-sm font-bold tracking-[-0.01em] text-on-surface" htmlFor={field.id}>
                    {field.label}
                  </label>
                  {field.kind === "textarea" ? (
                    <textarea
                      className="min-h-48 w-full rounded-[1.6rem] bg-surface-container-low px-5 py-4 text-sm leading-8 text-on-surface placeholder:text-on-surface-variant/55 focus:bg-surface-container-lowest"
                      id={field.id}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.id]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      value={values[field.id] ?? ""}
                    />
                  ) : (
                    <input
                      className="w-full rounded-[1.6rem] bg-surface-container-low px-5 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/55 focus:bg-surface-container-lowest"
                      id={field.id}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, [field.id]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      value={values[field.id] ?? ""}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {!waitingForReady && submittedPreview ? (
          <div className="flex justify-end gap-5">
            <div className="max-w-2xl space-y-2 text-right">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/65">
                Du • eben gesendet
              </span>
              <div className="inline-block rounded-[1.5rem] bg-surface-container-lowest px-5 py-5 text-left shadow-soft ghost-outline">
                <p className="text-sm leading-7 text-on-surface">{submittedPreview}</p>
              </div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
              <AppIcon className="h-4 w-4" name="check" />
            </div>
          </div>
        ) : null}

        {!waitingForReady && result ? <ResultPanel result={result} viewModel={currentViewModel} /> : null}

        {!waitingForReady ? (
          <div className="sticky bottom-4 z-30">
            <Card className="rounded-full px-3 py-3 shadow-ambient" tone="glass">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2.5 shadow-soft ghost-outline">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-primary">
                    <AppIcon className="h-4 w-4" name="layers" />
                  </button>
                  <div className="min-w-0 flex-1 px-1">
                    <p className="truncate text-sm text-on-surface-variant">{currentViewModel.composerPlaceholder}</p>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-primary">
                    <AppIcon className="h-4 w-4" name="mic" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <p className="hidden max-w-sm text-sm leading-7 text-on-surface-variant lg:block">
                    {currentViewModel.helperText}
                  </p>
                  <Button disabled={!hasAnyValue || isSubmitting} onClick={submit}>
                    {isSubmitting ? "Wird verarbeitet..." : currentViewModel.submitLabel}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
