import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon, type IconName } from "@/components/ui/icon";
import { MetricCard } from "@/components/ui/metric-card";
import { Pill } from "@/components/ui/pill";
import type { DashboardViewModel } from "@/lib/mappers/types";

const SECTION_ICONS: Record<string, IconName> = {
  hoeren: "headphones",
  lesen: "book",
  schreiben: "pencil",
  sprechen: "mic"
};

const LINE_COLORS = ["#00685f", "#0f172a", "#6c7a92", "#7fd7cb"];

function buildSeries(score: number, index: number): number[] {
  const seed = 6 + index * 4;
  return [score - seed, score - seed / 2, score - 5, score - 2, score].map((point) =>
    Math.max(24, Math.min(95, point))
  );
}

function buildPath(points: number[]): string {
  return points
    .map((point, index) => {
      const x = (index / Math.max(1, points.length - 1)) * 100;
      const y = 100 - point;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function DashboardOverview({ viewModel }: { viewModel: DashboardViewModel }) {
  const recommendedTasks = viewModel.studyPlan.slice(0, 2);

  return (
    <div className="mx-auto max-w-editorial space-y-10">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {viewModel.sections.map((section) => (
          <MetricCard
            badge={section.tdn}
            detail={`Aktueller Trend für ${section.label.toLowerCase()} mit stabilem Vorwärtsmomentum.`}
            icon={SECTION_ICONS[section.section]}
            key={section.section}
            label={section.label}
            progress={section.score}
            value={`${section.score}%`}
          />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="space-y-8">
          <Card className="space-y-8" tone="default">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="editorial-kicker">Competency Profile</p>
                <h2 className="mt-2 text-[1.85rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Präzisionsanalyse der Kompetenzbereiche
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {viewModel.sections.map((section, index) => (
                  <div className="flex items-center gap-2" key={section.section}>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: LINE_COLORS[index] }}
                    />
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                      {section.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-surface-container-low px-5 py-6 md:px-6">
              <svg className="h-56 w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {[20, 40, 60, 80].map((line) => (
                  <line
                    key={line}
                    stroke="rgb(var(--color-outline-variant) / 0.24)"
                    strokeDasharray="2 4"
                    strokeWidth="0.5"
                    x1="0"
                    x2="100"
                    y1={line}
                    y2={line}
                  />
                ))}
                {viewModel.sections.map((section, index) => {
                  const points = buildSeries(section.score, index);
                  const path = buildPath(points);
                  const finalX = 100;
                  const finalY = 100 - points[points.length - 1];

                  return (
                    <g key={section.section}>
                      <path
                        d={path}
                        fill="none"
                        stroke={LINE_COLORS[index]}
                        strokeWidth="2.6"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle cx={finalX} cy={finalY} fill={LINE_COLORS[index]} r="2.4" />
                    </g>
                  );
                })}
              </svg>
              <div className="mt-4 flex justify-between text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/55">
                <span>01 Okt</span>
                <span>04 Okt</span>
                <span>07 Okt</span>
                <span>10 Okt</span>
                <span className="text-primary">Aktuell</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {viewModel.weakSkills.map((skill) => (
                <div
                  className="rounded-[1.5rem] bg-surface-container-low px-4 py-4"
                  key={skill.label}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-bold tracking-[-0.02em] text-on-surface">{skill.label}</p>
                    <Pill size="sm" tone="soft">
                      L{skill.level}
                    </Pill>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    Vertrauenswert {skill.confidence.toFixed(2)}. Ideal für die nächste fokussierte
                    Korrekturschleife.
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="editorial-kicker">Recommended Next</p>
                <h2 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Nächste priorisierte Schleifen
                </h2>
              </div>
              <Link
                className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary"
                href="/lesen"
              >
                Alle Aufgaben
                <AppIcon className="h-4 w-4" name="arrow-right" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              {recommendedTasks.map((item, index) => (
                <Card
                  className="flex h-full flex-col gap-5"
                  key={item.id}
                  tone={index === 0 ? "default" : "muted"}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Pill tone="soft">{item.mode}</Pill>
                    <span className="inline-flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                      <AppIcon className="h-4 w-4" name="clock" />
                      {index === 0 ? "12 Min" : "25 Min"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.03em] text-on-surface">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-7 text-on-surface-variant">{item.reason}</p>
                  </div>
                  <ButtonLink className="mt-auto w-full" href={item.href} variant={index === 0 ? "secondary" : "primary"}>
                    {index === 0 ? "Task öffnen" : "Workspace starten"}
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </section>

          <Card className="relative min-h-[320px] overflow-hidden" tone="night">
            <div className="relative z-10 max-w-xl">
              <p className="editorial-kicker-contrast">New Feature</p>
              <h2 className="mt-5 text-[3rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-white">
                Bereit für eine echte Prüfungssimulation?
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/74">
                Wechsle in den Mock-Modus und arbeite unter klarerer Taktung, strengerem
                Prüfungschrome und verzögertem Feedback.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ButtonLink href="/mock-test" size="lg">
                  Start Simulation
                </ButtonLink>
                <div className="flex items-center gap-2 text-sm font-semibold text-white/65">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <AppIcon className="h-4 w-4" name="target" />
                  </span>
                  Prüfungspfad mit kompletter Roadmap
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 right-2 text-white/10">
              <AppIcon className="h-48 w-48" name="rocket" strokeWidth={1.5} />
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="space-y-8" tone="night">
            <div>
              <p className="editorial-kicker-contrast">Focus Agenda</p>
              <h2 className="mt-3 text-[2.15rem] font-light leading-tight tracking-[-0.04em] text-white">
                Daily <span className="font-extrabold">Study Plan</span>
              </h2>
            </div>
            <div className="space-y-7">
              {viewModel.studyPlan.map((item, index) => (
                <Link className="group flex gap-5" href={item.href} key={item.id}>
                  <span className="text-lg font-extrabold tracking-[-0.03em] text-white/28 group-hover:text-primary-fixed">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-base font-bold tracking-[-0.02em] text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/58">{item.reason}</p>
                  </div>
                </Link>
              ))}
            </div>
            <ButtonLink className="w-full" href={viewModel.studyPlan[0]?.href ?? "/lesen"} size="lg" variant="inverse">
              Resume Session
            </ButtonLink>
          </Card>

          <Card className="space-y-6" tone="inset">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="editorial-kicker">Recent Activity</p>
                <h2 className="mt-2 text-[1.65rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Verlauf der letzten Sessions
                </h2>
              </div>
              <Pill tone="soft">{viewModel.llmStatus}</Pill>
            </div>
            <div className="space-y-5">
              {viewModel.recentActivity.map((item, index) => (
                <Link
                  className="group flex gap-4"
                  href={item.href}
                  key={item.id}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <AppIcon
                        className="h-4 w-4"
                        name={index === 0 ? "check" : index === 1 ? "sparkles" : "target"}
                      />
                    </div>
                    {index < viewModel.recentActivity.length - 1 ? (
                      <span className="mt-2 h-full w-px bg-outline-variant/30" />
                    ) : null}
                  </div>
                  <div className="min-w-0 pb-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-base font-bold tracking-[-0.02em] text-on-surface group-hover:text-primary">
                        {item.title}
                      </p>
                      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/55">
                        {index === 0 ? "Heute" : index === 1 ? "Heute, früher" : "Gestern"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
