import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { GrammarLibraryViewModel } from "@/lib/mappers/types";
import { cn } from "@/lib/utils";

export function GrammarLibraryScreen({ viewModel }: { viewModel: GrammarLibraryViewModel }) {
  return (
    <div className="mx-auto max-w-editorial space-y-10">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <Pill>Adaptive Förderung</Pill>
          <h1 className="editorial-title mt-5">{viewModel.title}</h1>
          <p className="editorial-subtitle mt-5">{viewModel.subtitle}</p>
        </div>
        <div className="rounded-[2rem] bg-surface-container-lowest px-6 py-6 shadow-paper ghost-outline md:min-w-[220px] md:px-8">
          <p className="editorial-kicker">Gesamtbeherrschung</p>
          <p className="mt-3 text-5xl font-extrabold tracking-[-0.05em] text-primary">
            {viewModel.mastery}%
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="relative xl:col-span-6" tone="accent">
          <div className="relative z-10 flex h-full flex-col gap-6">
            <Pill tone="contrast">Priorisierte Empfehlung</Pill>
            <div>
              <h2 className="text-[2.25rem] font-extrabold leading-tight tracking-[-0.04em] text-white">
                {viewModel.featuredRecommendation.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/78">
                {viewModel.featuredRecommendation.rationale}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {viewModel.featuredRecommendation.focusSkills.map((skill) => (
                <Pill className="max-w-full truncate" key={skill} size="sm" tone="contrast">
                  {skill}
                </Pill>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-4">
              <ButtonLink href={viewModel.featuredRecommendation.href} variant="quiet">
                Praxis starten
              </ButtonLink>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/72">
                <AppIcon className="h-4 w-4" name="clock" />
                {viewModel.featuredRecommendation.durationLabel} • {viewModel.featuredRecommendation.levelLabel}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-8 text-white/16">
            <AppIcon className="h-40 w-40" name="book" strokeWidth={1.4} />
          </div>
        </Card>

        {viewModel.secondaryRecommendations.map((card, index) => (
          <Card
            className="flex h-full flex-col justify-between gap-5 xl:col-span-3"
            key={card.title}
            tone={card.accent === "teal" ? "muted" : "default"}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    card.accent === "teal"
                      ? "bg-secondary-container text-secondary"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  <AppIcon className="h-4 w-4" name={index === 0 ? "pencil" : "layers"} />
                </div>
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                  {card.levelLabel}
                </span>
              </div>
              <h3 className="mt-6 text-[1.35rem] font-extrabold tracking-[-0.03em] text-on-surface">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{card.summary}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Link className="text-sm font-bold text-primary" href={card.href}>
                {card.statusLabel}
              </Link>
              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/65">
                {card.durationLabel}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          {viewModel.curriculumGroups.map((group, groupIndex) => (
            <section key={group.title}>
              <div className="mb-6 flex items-center gap-3">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    group.accent === "primary"
                      ? "bg-primary"
                      : group.accent === "secondary"
                        ? "bg-secondary"
                        : "bg-tertiary"
                  )}
                />
                <h2 className="text-sm font-extrabold uppercase tracking-[0.22em] text-on-surface-variant">
                  {group.title}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.lessons.map((lesson) => (
                  <Link href={lesson.href} key={lesson.title}>
                    <Card
                      className={cn(
                        "flex h-full flex-col gap-5 transition-colors hover:bg-surface-container-low",
                        lesson.emphasis && "ring-1 ring-primary/15"
                      )}
                      tone="default"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Pill size="sm" tone={lesson.emphasis ? "primary" : "soft"}>
                          {lesson.badge}
                        </Pill>
                        <AppIcon className="h-4 w-4 text-on-surface-variant/50" name="arrow-right" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-[1.05rem] font-extrabold tracking-[-0.02em] text-on-surface">
                          {lesson.title}
                        </h3>
                        <p className="text-sm leading-7 text-on-surface-variant">{lesson.summary}</p>
                      </div>
                      <div className="mt-auto space-y-4">
                        {typeof lesson.progressPercent === "number" ? (
                          <ProgressBar value={lesson.progressPercent} />
                        ) : null}
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                            {lesson.statusLabel}
                          </span>
                          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/65">
                            {lesson.durationLabel}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {groupIndex === 0 ? <div className="mt-10 h-px w-full bg-transparent" /> : null}
            </section>
          ))}
        </div>

        <aside className="space-y-8 xl:sticky xl:top-[5.75rem] xl:self-start">
          <Card className="space-y-8" tone="inset">
            <h3 className="editorial-kicker">Bibliothek verfeinern</h3>

            <div className="space-y-4">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Lernstatus
              </p>
              <div className="space-y-3">
                {viewModel.filters.statuses.map((status) => (
                  <div className="flex items-center gap-3" key={status.label}>
                    <span
                      className={cn(
                        "h-4 w-4 rounded-sm",
                        status.active ? "bg-primary" : "bg-surface-container-lowest ghost-outline"
                      )}
                    />
                    <span className="text-sm font-medium text-on-surface-variant">{status.label}</span>
                    <span className="ml-auto text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/45">
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Kompetenzniveau
              </p>
              <div className="flex gap-2">
                {viewModel.filters.levels.map((level) => (
                  <span
                    className={cn(
                      "flex-1 rounded-full px-4 py-2 text-center text-[0.68rem] font-extrabold uppercase tracking-[0.18em]",
                      level.active
                        ? "bg-primary text-white"
                        : "bg-surface-container-lowest text-on-surface ghost-outline"
                    )}
                    key={level.label}
                  >
                    {level.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Fertigkeitsrelevanz
              </p>
              <div className="flex flex-wrap gap-2">
                {viewModel.filters.skills.map((skill) => (
                  <Pill key={skill.label} size="sm" tone={skill.active ? "primary" : "soft"}>
                    {skill.label}
                  </Pill>
                ))}
              </div>
            </div>

            <ButtonLink className="w-full justify-center" href="/grammar-library" variant="secondary">
              Alle Filter löschen
            </ButtonLink>
          </Card>

          <Card className="relative overflow-hidden" tone="night">
            <div className="relative z-10">
              <h3 className="text-lg font-extrabold tracking-[-0.03em] text-white">
                {viewModel.pulse.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{viewModel.pulse.text}</p>
              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <p className="editorial-kicker-contrast">{viewModel.pulse.metricLabel}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-white">
                    {viewModel.pulse.metricValue}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <span
                      className={cn(
                        "block w-1.5 rounded-full bg-white",
                        bar > 3 && "opacity-30"
                      )}
                      key={bar}
                      style={{ height: `${bar <= 3 ? 18 : 12}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 text-white/10">
              <AppIcon className="h-32 w-32" name="chart" strokeWidth={1.4} />
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}
