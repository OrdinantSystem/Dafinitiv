import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { MockResultsViewModel } from "@/lib/mappers/types";

export function MockResultsScreen({ viewModel }: { viewModel: MockResultsViewModel }) {
  return (
    <div className="mx-auto max-w-editorial space-y-12">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Pill>Mock Exam #{viewModel.sessionId} • Completed</Pill>
          <h1 className="editorial-title">{viewModel.headline}</h1>
          <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">{viewModel.summary}</p>
        </div>
        <div className="flex items-center gap-4 rounded-[1.6rem] bg-surface-container-low px-4 py-4 shadow-soft ghost-outline">
          {viewModel.heroStats.map((stat, index) => (
            <div className="px-4 text-center" key={stat.label}>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                {stat.label}
              </span>
              <span className="mt-2 block text-3xl font-black tracking-[-0.04em] text-primary">
                {stat.value}
              </span>
              {index < viewModel.heroStats.length - 1 ? (
                <span className="absolute" />
              ) : null}
            </div>
          ))}
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-3">
        <Card className="space-y-8 lg:col-span-2" tone="default">
          <div>
            <h2 className="text-[1.8rem] font-extrabold tracking-[-0.03em] text-on-surface">
              {viewModel.bridge.title}
            </h2>
          </div>

          <div className="relative py-10">
            <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-surface-container">
              <div
                className="h-full rounded-full bg-cta-gradient"
                style={{ width: `${viewModel.bridge.progressPercent}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {[
                { label: "Current Level", value: viewModel.bridge.currentLevel, active: true },
                { label: "The Threshold", value: viewModel.bridge.thresholdLevel, active: false },
                { label: "Target TDN", value: viewModel.bridge.targetLevel, active: false }
              ].map((step, index) => (
                <div className="flex flex-col items-center gap-4" key={step.label}>
                  <div
                    className={
                      index === 0
                        ? "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lift"
                        : index === 1
                          ? "flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low border border-primary/20 text-primary"
                          : "flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant"
                    }
                  >
                    <span className="font-extrabold">{step.value}</span>
                  </div>
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 border-t border-outline-variant/20 pt-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AppIcon className="h-5 w-5 text-primary" name="chart" />
                <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-on-surface">
                  Required Gains
                </h3>
              </div>
              <div className="space-y-3">
                {viewModel.bridge.requiredGains.map((gain) => (
                  <div
                    className="flex items-center justify-between rounded-[1.2rem] bg-surface-container-low px-4 py-3"
                    key={gain.label}
                  >
                    <span className="text-sm font-medium text-on-surface">{gain.label}</span>
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                      {gain.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AppIcon className="h-5 w-5 text-secondary" name="sparkles" />
                <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-on-surface">
                  {viewModel.bridge.insightTitle}
                </h3>
              </div>
              <p className="text-sm leading-7 text-on-surface-variant">{viewModel.bridge.insightText}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-7" tone="inset">
          <h2 className="text-[1.35rem] font-extrabold tracking-[-0.03em] text-on-surface">
            Sectional Snapshot
          </h2>
          <div className="space-y-5">
            {viewModel.sectionResults.map((section, index) => (
              <Link className="block" href={section.href} key={section.section}>
                <div className="flex justify-between gap-4 text-[0.68rem] font-extrabold uppercase tracking-[0.18em]">
                  <span>{section.label}</span>
                  <span className="text-primary">{section.tdn}</span>
                </div>
                <ProgressBar
                  className="mt-2"
                  tone={index === viewModel.sectionResults.length - 1 ? "tertiary" : "primary"}
                  value={section.score}
                />
              </Link>
            ))}
          </div>
          <ButtonLink className="w-full justify-center" href={viewModel.sectionResults[0]?.href ?? "/lesen"} variant="ghost">
            View Detailed Skill Breakdown
          </ButtonLink>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-on-surface">
          Prioritized Roadmap • Week 05
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {viewModel.roadmap.map((item, index) => (
            <Link href={item.href} key={item.id}>
              <Card className="flex h-full flex-col gap-6 transition-colors hover:bg-surface-container-lowest" tone="muted">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <Pill size="sm" tone={index === 0 ? "primary" : "soft"}>
                    {index === 0 ? "HIGH PRIORITY" : index === 1 ? "SKILL DRILL" : "REVISION"}
                  </Pill>
                </div>
                <div>
                  <h3 className="text-[1.2rem] font-extrabold tracking-[-0.03em] text-on-surface">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.text}</p>
                </div>
                <div className="mt-auto rounded-[1.2rem] bg-surface-container px-4 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                  45m Practice Session
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Card className="relative overflow-hidden" tone="glass">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-[2rem] font-extrabold tracking-[-0.04em] text-on-surface">
              {viewModel.cta.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-on-surface-variant">{viewModel.cta.text}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href={viewModel.cta.primaryHref} size="lg">
              {viewModel.cta.primaryLabel}
            </ButtonLink>
            <ButtonLink href={viewModel.cta.secondaryHref} size="lg" variant="secondary">
              {viewModel.cta.secondaryLabel}
            </ButtonLink>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-primary-fixed/30 blur-3xl" />
      </Card>
    </div>
  );
}
