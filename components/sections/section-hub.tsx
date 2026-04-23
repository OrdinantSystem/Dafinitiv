import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon, type IconName } from "@/components/ui/icon";
import { MetricCard } from "@/components/ui/metric-card";
import { Pill } from "@/components/ui/pill";
import type { SectionHubViewModel } from "@/lib/mappers/types";
import { cn } from "@/lib/utils";

const SECTION_THEMES: Record<
  SectionHubViewModel["section"],
  {
    accentIcon: IconName;
    accentLabel: string;
    challengeText: string;
    challengeTitle: string;
    intro: string;
    metrics: [IconName, IconName, IconName];
  }
> = {
  lesen: {
    accentIcon: "book",
    accentLabel: "B2/C1 Niveau",
    challengeText:
      "Teste dein Lesetempo in einer vollständigen Simulation oder springe gezielt in ein priorisiertes Format.",
    challengeTitle: "Lesen mit Prüfungstakt und stärkerer Tiefenschärfe",
    intro: "Adaptive reading strategies and analysis based on recent activity.",
    metrics: ["chart", "clock", "layers"]
  },
  hoeren: {
    accentIcon: "headphones",
    accentLabel: "B2/C1 Niveau",
    challengeText:
      "Arbeite text-first weiter an Hörlogik und Notizpräzision oder wechsle in den exam-like Modus.",
    challengeTitle: "Hören mit mehr Signalwort- und Strukturkontrolle",
    intro: "Daily adaptive insights based on your last 14 sessions.",
    metrics: ["chart", "pencil", "wave"]
  },
  schreiben: {
    accentIcon: "pencil",
    accentLabel: "B2/C1 Niveau",
    challengeText:
      "Simuliere das komplette Schreibmodul oder schärfe nur die nächste priorisierte Produktionsschleife.",
    challengeTitle: "Schreiben mit stärkerer Verdichtung und C1-Register",
    intro: "Daily adaptive insights for source synthesis and argumentation.",
    metrics: ["chart", "layers", "sparkles"]
  },
  sprechen: {
    accentIcon: "mic",
    accentLabel: "C1 Advanced",
    challengeText:
      "Bleib im text-first Strategiemodus oder setze mit Mock-Chrome einen härteren zeitlichen Rahmen.",
    challengeTitle: "Sprechen mit klarerem Aufbau und kontrollierter Argumentation",
    intro: "Daily adaptive insights based on your speaking performance.",
    metrics: ["chart", "target", "wave"]
  }
};

export function SectionHub({ viewModel }: { viewModel: SectionHubViewModel }) {
  const theme = SECTION_THEMES[viewModel.section];

  return (
    <div className="mx-auto max-w-editorial space-y-12">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Pill>{theme.accentLabel}</Pill>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <p className="text-sm font-medium text-on-surface-variant">{theme.intro}</p>
          </div>
          <div className="max-w-3xl">
            <h1 className="editorial-title">{viewModel.title}</h1>
            <p className="editorial-subtitle mt-5">{viewModel.subtitle}</p>
          </div>
        </div>

        <Card className="flex flex-col gap-5" tone="glass">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary text-white shadow-lift">
              <AppIcon className="h-5 w-5" name={theme.accentIcon} />
            </div>
            <div>
              <p className="editorial-kicker">Adaptive Focus</p>
              <p className="mt-1 text-[1.5rem] font-extrabold tracking-[-0.03em] text-on-surface">
                {viewModel.accentLabel}
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-on-surface">
            {viewModel.textFirstNote ?? theme.challengeText}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={viewModel.focusCards[0]?.href ?? viewModel.challenge.href}>
              Direkter Fokus
            </ButtonLink>
            <ButtonLink href="/mock-test" variant="secondary">
              Mock öffnen
            </ButtonLink>
          </div>
        </Card>
      </section>

      {viewModel.textFirstNote ? (
        <Card className="space-y-4" tone="muted">
          <p className="editorial-kicker">Text-First Framing</p>
          <p className="max-w-4xl text-lg leading-8 text-on-surface">
            {viewModel.textFirstNote}
          </p>
        </Card>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        {viewModel.metrics.map((metric, index) => (
          <MetricCard
            detail={metric.detail}
            icon={theme.metrics[index]}
            key={metric.label}
            label={metric.label}
            progress={metric.progress}
            value={metric.value}
          />
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="editorial-kicker">
              {viewModel.section === "sprechen" ? "Empfohlener Fokus" : "Recommended Focus"}
            </p>
            <h2 className="mt-2 text-[1.9rem] font-extrabold tracking-[-0.03em] text-on-surface">
              Module mit dem größten Hebel
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary"
            href="/mock-test"
          >
            View Roadmap
            <AppIcon className="h-4 w-4" name="arrow-right" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {viewModel.focusCards.map((card, index) => (
            <Card
              className="relative overflow-hidden"
              key={card.title}
              tone={index === 0 ? "accent" : "muted"}
            >
              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="flex gap-2">
                  <Pill tone={index === 0 ? "contrast" : "soft"}>{index === 0 ? "12 Min" : "25 Min"}</Pill>
                  <Pill tone={index === 0 ? "contrast" : "soft"}>
                    {index === 0 ? "Level C1" : "B2/C1"}
                  </Pill>
                </div>
                <div>
                  <h3
                    className={cn(
                      "text-[2rem] font-extrabold leading-tight tracking-[-0.04em]",
                      index === 0 ? "text-white" : "text-on-surface"
                    )}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-4 max-w-md text-sm leading-7",
                      index === 0 ? "text-white/74" : "text-on-surface-variant"
                    )}
                  >
                    {card.description}
                  </p>
                </div>
                <ButtonLink href={card.href} variant={index === 0 ? "quiet" : "primary"}>
                  {card.ctaLabel}
                </ButtonLink>
              </div>
              <div
                className={cn(
                  "pointer-events-none absolute -bottom-8 -right-8",
                  index === 0 ? "text-white/10" : "text-primary/8"
                )}
              >
                <AppIcon className="h-36 w-36" name={index === 0 ? theme.accentIcon : "sparkles"} strokeWidth={1.4} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="editorial-kicker">
            {viewModel.section === "sprechen" ? "Aufgabentypen" : "Task Typologies"}
          </p>
          <h2 className="mt-2 text-[1.9rem] font-extrabold tracking-[-0.03em] text-on-surface">
            Direkte Einstiege in den Workspace
          </h2>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant">
            Tiefe Übung für die offiziellen digitalen TestDaF-Formate mit ruhigerem, editoriellem Layout.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2.4rem] bg-outline-variant/18 sm:grid-cols-2 lg:grid-cols-4">
          {viewModel.exercises.map((exercise, index) => (
            <Link
              className={cn(
                "group flex min-h-[270px] flex-col bg-surface px-6 py-7 transition-colors hover:bg-surface-container-low md:px-7 md:py-8",
                viewModel.section === "sprechen" &&
                  index === viewModel.exercises.length - 1 &&
                  "sm:col-span-2 lg:col-span-2"
              )}
              href={exercise.href}
              key={exercise.id}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-4xl font-black tracking-[-0.04em] text-outline-variant/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-surface-container px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                  {exercise.timing}
                </span>
              </div>
              <div className="mt-8 flex-1">
                <h3 className="text-[1.18rem] font-extrabold leading-tight tracking-[-0.03em] text-on-surface">
                  {exercise.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {exercise.supportNote}. Skill-Fokus: {exercise.skillTags.join(", ")}.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Format wählen
                </span>
                <AppIcon className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" name="arrow-right" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between" tone="muted">
        <div className="max-w-2xl">
          <p className="editorial-kicker">Ready for a challenge?</p>
          <h2 className="mt-3 text-[2.2rem] font-extrabold leading-tight tracking-[-0.04em] text-on-surface">
            {theme.challengeTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-on-surface-variant">{theme.challengeText}</p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <ButtonLink className="justify-center" href={viewModel.challenge.href} size="lg" variant="secondary">
            Practice Mode
          </ButtonLink>
          <ButtonLink className="justify-center" href="/mock-test" size="lg">
            Launch Full Simulation
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
