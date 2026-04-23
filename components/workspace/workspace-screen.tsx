import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { WorkspaceClient } from "@/components/workspace/workspace-client";
import type { WorkspaceViewModel } from "@/lib/mappers/types";

export function WorkspaceScreen({ viewModel }: { viewModel: WorkspaceViewModel }) {
  return (
    <div className="mx-auto max-w-editorial space-y-8 px-4 md:px-8">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Pill>{viewModel.eyebrow}</Pill>
          <Pill tone="soft">{viewModel.progressLabel}</Pill>
          <Pill tone={viewModel.strictChrome ? "neutral" : "primary"}>{viewModel.timerLabel}</Pill>
          <Pill tone="soft">{viewModel.contextLabel}</Pill>
          <Pill tone={viewModel.strictChrome ? "neutral" : "soft"}>{viewModel.agentLabel}</Pill>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="max-w-4xl">
            <p className="editorial-kicker">{viewModel.resolvedFrom}</p>
            <h1 className="editorial-title">{viewModel.title}</h1>
            <p className="editorial-subtitle mt-5">{viewModel.description}</p>
          </div>

          <Card className="flex flex-col gap-4" tone={viewModel.strictChrome ? "night" : "glass"}>
            <p className={viewModel.strictChrome ? "editorial-kicker-contrast" : "editorial-kicker"}>
              Workspace Framing
            </p>
            <p
              className={
                viewModel.strictChrome
                  ? "text-sm leading-7 text-white/74"
                  : "text-sm leading-7 text-on-surface"
              }
            >
              {viewModel.helperText}
            </p>
            <div className="flex flex-wrap gap-2">
              {viewModel.shellUtilityItems.map((item) => (
                <Pill key={item.label} size="sm" tone={viewModel.strictChrome ? "contrast" : "soft"}>
                  {item.label}: {item.value}
                </Pill>
              ))}
            </div>
            {viewModel.nextLink ? (
              <div className="mt-auto">
                <ButtonLink href={viewModel.nextLink.href} variant={viewModel.strictChrome ? "inverse" : "secondary"}>
                  {viewModel.nextLink.label}
                </ButtonLink>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {viewModel.workspaceMeta.map((item) => (
            <div
              className="rounded-[1.6rem] bg-surface-container-lowest px-5 py-5 shadow-soft ghost-outline"
              key={item.label}
            >
              <p className="editorial-kicker">{item.label}</p>
              <p className="mt-2 text-lg font-extrabold tracking-[-0.02em] text-on-surface">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {viewModel.debug?.enabled ? (
          <Card className="space-y-4" tone="inset">
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone={viewModel.debug.realLlmEnabled ? "primary" : "soft"}>
                Runtime: {viewModel.debug.runtimeMode}
              </Pill>
              <Pill tone={viewModel.debug.usesLlmOnReady ? "primary" : "soft"}>
                Ready: {viewModel.debug.usesLlmOnReady ? "LLM" : "Local"}
              </Pill>
              <Pill tone={viewModel.debug.usesLlmOnSubmit ? "primary" : "soft"}>
                Submit: {viewModel.debug.usesLlmOnSubmit ? "LLM" : "Local"}
              </Pill>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <p className="editorial-kicker">Ruta</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">{viewModel.debug.route}</p>
              </div>
              <div>
                <p className="editorial-kicker">Proveedor</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">{viewModel.debug.runtimeLabel}</p>
              </div>
              <div>
                <p className="editorial-kicker">Modelo</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">{viewModel.debug.configuredModel}</p>
              </div>
              <div>
                <p className="editorial-kicker">Host API</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">{viewModel.debug.baseUrlHost}</p>
              </div>
              <div>
                <p className="editorial-kicker">Logs</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">
                  {viewModel.debug.debugLoggingEnabled ? "Terminal + browser console" : "Desactivados"}
                </p>
              </div>
              <div>
                <p className="editorial-kicker">LLM real</p>
                <p className="mt-2 text-sm leading-7 text-on-surface">
                  {viewModel.debug.realLlmEnabled ? "Sí" : "No"}
                </p>
              </div>
            </div>
          </Card>
        ) : null}
      </section>

      <WorkspaceClient viewModel={viewModel} />
    </div>
  );
}
