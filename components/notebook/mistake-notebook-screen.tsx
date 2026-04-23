import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import type { MistakeNotebookViewModel } from "@/lib/mappers/types";
import { cn } from "@/lib/utils";

export function MistakeNotebookScreen({ viewModel }: { viewModel: MistakeNotebookViewModel }) {
  return (
    <div className="mx-auto max-w-editorial space-y-12">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="editorial-title">{viewModel.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Pill>{viewModel.meta.countLabel}</Pill>
            <span className="text-sm font-medium text-on-surface-variant">{viewModel.meta.updatedLabel}</span>
          </div>
        </div>
        <ButtonLink href={viewModel.featuredEntry.href} size="lg">
          Analysis View
        </ButtonLink>
      </section>

      <section className="flex flex-wrap gap-4">
        {viewModel.filterChips.map((chip) => (
          <Pill key={chip.label} size="md" tone={chip.active ? "primary" : "soft"}>
            {chip.label}
          </Pill>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <Card className="space-y-8 lg:col-span-8" tone="default">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <AppIcon className="h-4 w-4 text-primary" name="sparkles" />
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
                  {viewModel.featuredEntry.category}
                </span>
              </div>
              <h2 className="text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
                {viewModel.featuredEntry.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
                {viewModel.featuredEntry.explanation}
              </p>
            </div>
            <Pill tone="soft">{viewModel.featuredEntry.statusLabel}</Pill>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-error-container/35 p-6">
              <p className="editorial-kicker text-error">Incorrect Form</p>
              <p className="mt-4 text-lg italic leading-8 text-on-surface">{viewModel.featuredEntry.mistake}</p>
            </div>
            <div className="rounded-[1.5rem] bg-primary/5 p-6">
              <p className="editorial-kicker text-primary">Corrected Form</p>
              <p className="mt-4 text-lg font-bold leading-8 text-on-surface">
                {viewModel.featuredEntry.correction}
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-surface-container-low p-6">
            <p className="editorial-kicker">Rule / Explanation</p>
            <p className="mt-4 text-sm leading-7 text-on-surface">{viewModel.featuredEntry.explanation}</p>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {viewModel.featuredEntry.tags.map((tag) => (
                <Pill key={tag} size="sm" tone="soft">
                  {tag}
                </Pill>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={viewModel.featuredEntry.href} variant="secondary">
                Start Practice
              </ButtonLink>
              <ButtonLink href={viewModel.featuredEntry.href}>Recommended Practice</ButtonLink>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-8 lg:col-span-4">
          <Card className="flex h-full flex-col gap-6" tone="default">
            <div className="flex items-center justify-between gap-4">
              <Pill size="sm" tone="soft">
                {viewModel.supportingEntry.statusLabel}
              </Pill>
              <AppIcon className="h-5 w-5 text-on-surface-variant/30" name="layers" />
            </div>
            <div>
              <h3 className="text-[1.45rem] font-extrabold tracking-[-0.03em] text-on-surface">
                {viewModel.supportingEntry.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                {viewModel.supportingEntry.explanation}
              </p>
            </div>
            <div className="mt-auto space-y-4 rounded-[1.5rem] bg-surface-container-low p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-on-surface">{viewModel.supportingEntry.statLabel}</span>
                <ButtonLink href={viewModel.supportingEntry.href} variant="secondary">
                  Drill
                </ButtonLink>
              </div>
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Launch Drill
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden" tone="accent">
            <div className="relative z-10">
              <p className="editorial-kicker-contrast">Vocabulary Command</p>
              <h3 className="mt-3 text-[2rem] font-extrabold tracking-[-0.04em] text-white">
                82% Mastery
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Synonym usage has increased by 12% in the last 30 days. Du klingst präziser und
                deutlich kontrollierter.
              </p>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 text-white/12">
              <AppIcon className="h-28 w-28" name="chart" strokeWidth={1.4} />
            </div>
          </Card>
        </div>

        <Card className="flex flex-col gap-6 lg:col-span-4" tone="default">
          <div className="flex items-center gap-2">
            <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
              {viewModel.compactEntry.category}
            </span>
          </div>
          <div>
            <h3 className="text-[1.45rem] font-extrabold tracking-[-0.03em] text-on-surface">
              {viewModel.compactEntry.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              {viewModel.compactEntry.explanation}
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-error-container/30 p-4">
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-error">
                Mistake
              </span>
              <p className="mt-2 text-sm italic text-on-surface">{viewModel.compactEntry.mistake}</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Correction
              </span>
              <p className="mt-2 text-sm font-bold text-on-surface">{viewModel.compactEntry.correction}</p>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between gap-4">
            <ButtonLink href={viewModel.compactEntry.href} variant="secondary">
              Start Practice
            </ButtonLink>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
              <AppIcon className="h-4 w-4" name="menu" />
            </button>
          </div>
        </Card>

        <Card className="relative overflow-hidden lg:col-span-8" tone="muted">
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
                {viewModel.roadmap.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-on-surface-variant">{viewModel.roadmap.text}</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <ButtonLink href={viewModel.roadmap.primaryHref} size="lg">
                  {viewModel.roadmap.primaryCtaLabel}
                </ButtonLink>
                <ButtonLink href={viewModel.roadmap.secondaryHref} size="lg" variant="secondary">
                  {viewModel.roadmap.secondaryCtaLabel}
                </ButtonLink>
              </div>
            </div>
            <div className="relative flex justify-center md:w-[220px]">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-primary/5">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                  <AppIcon className="h-10 w-10 text-primary" name="sparkles" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <footer className="flex flex-col gap-8 border-t border-transparent pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-10">
          {viewModel.footerStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-2 text-2xl font-extrabold tracking-[-0.03em] text-on-surface",
                  stat.tone === "secondary" && "text-secondary"
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 rounded-full bg-surface-container-low px-6 py-4">
          <p className="text-sm font-medium text-on-surface-variant">{viewModel.footerPrompt}</p>
          <ButtonLink href={viewModel.featuredEntry.href} variant="ghost">
            Update AI Analysis
          </ButtonLink>
        </div>
      </footer>
    </div>
  );
}
