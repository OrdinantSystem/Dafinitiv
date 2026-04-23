import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { buildMockWorkspaceHref } from "@/lib/workspace-context";
import type { MockExamPlan } from "@/src/domain/types";
import { formatSectionLabel } from "@/lib/utils";

const READINESS_ITEMS = [
  "Stabile Internetverbindung",
  "Ruhige Umgebung",
  "Kopfhörer / Mikrofon bereit",
  "Systemrechte erlaubt"
];

export function MockTestSetup({
  mockPlan,
  runtimeLabel
}: {
  mockPlan: MockExamPlan;
  runtimeLabel: string;
}) {
  const fullMockHref = buildMockWorkspaceHref("full", {
    sourcePage: "mock_setup",
    agentRole: "mock_exam_runner"
  });

  return (
    <div className="mx-auto max-w-editorial space-y-12">
      <section className="max-w-3xl">
        <Pill>{runtimeLabel}</Pill>
        <h1 className="editorial-title mt-5">Mock Exam Simulation</h1>
        <p className="editorial-subtitle mt-5">
          Bereite Kopf und Taktung auf die Prüfung vor. Wähle zwischen vollständiger Simulation
          und gezieltem Sektionsmodus.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-12 lg:col-span-8">
          <section className="grid gap-6 md:grid-cols-2">
            <Card className="relative overflow-hidden" tone="default">
              <div className="relative z-10 flex h-full flex-col gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-white shadow-lift">
                  <AppIcon className="h-6 w-6" name="layers" />
                </div>
                <div>
                  <h2 className="text-[1.85rem] font-extrabold tracking-[-0.04em] text-on-surface">
                    Full Mock Exam
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    Eine vollständige {mockPlan.totalMinutesApprox}-Minuten-Simulation über alle vier
                    Kernkompetenzen mit strenger Sequenz und verzögerter Rückmeldung.
                  </p>
                </div>
                <ButtonLink href={fullMockHref}>Select Simulation</ButtonLink>
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/8" />
            </Card>

            <Card className="flex h-full flex-col gap-6" tone="muted">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-secondary shadow-soft">
                <AppIcon className="h-6 w-6" name="target" />
              </div>
              <div>
                <h2 className="text-[1.85rem] font-extrabold tracking-[-0.04em] text-on-surface">
                  Single-Section
                </h2>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  Fokussiere eine einzelne Sektion, um Technik und Taktung gezielt zu verfeinern.
                </p>
              </div>
              <div className="grid gap-3">
                {mockPlan.sections.map((section) => (
                  <Link
                    className="flex items-center justify-between rounded-[1.35rem] bg-surface-container-lowest px-4 py-4 shadow-soft ghost-outline"
                    href={buildMockWorkspaceHref(section.section, {
                      sourcePage: "mock_setup",
                      section: section.section,
                      agentRole: "mock_exam_runner"
                    })}
                    key={section.section}
                  >
                    <div>
                      <p className="text-sm font-bold tracking-[-0.02em] text-on-surface">
                        {formatSectionLabel(section.section)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-on-surface-variant">
                        {section.approximateMinutes} Min
                      </p>
                    </div>
                    <AppIcon className="h-4 w-4 text-primary" name="arrow-right" />
                  </Link>
                ))}
              </div>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="editorial-kicker">Curriculum Structure</p>
                <h2 className="mt-2 text-[1.9rem] font-extrabold tracking-[-0.03em] text-on-surface">
                  Breakdown of the current examination framework
                </h2>
              </div>
              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary">
                Version 2024.2
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {mockPlan.sections.map((section) => (
                <Card className="flex items-center justify-between gap-4" key={section.section} tone="muted">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-soft">
                      <AppIcon
                        className="h-4 w-4"
                        name={
                          section.section === "lesen"
                            ? "book"
                            : section.section === "hoeren"
                              ? "headphones"
                              : section.section === "schreiben"
                                ? "pencil"
                                : "mic"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-base font-bold tracking-[-0.02em] text-on-surface">
                        {formatSectionLabel(section.section)}
                      </p>
                      <p className="mt-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
                        {section.exerciseIds.length} Aufgaben
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-light tracking-[-0.03em] text-on-surface">
                    {section.approximateMinutes}m
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8 lg:col-span-4 lg:sticky lg:top-[5.75rem]">
          <Card className="space-y-6" tone="night">
            <p className="editorial-kicker-contrast">Session Protocols</p>
            <div className="space-y-6">
              {mockPlan.rules.map((rule, index) => (
                <div className="flex gap-4" key={rule}>
                  <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-primary-fixed">
                    <AppIcon className="h-4 w-4" name={index === 0 ? "clock" : index === 1 ? "layers" : "check"} />
                  </span>
                  <p className="text-sm leading-7 text-white/72">{rule}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-6" tone="inset">
            <p className="editorial-kicker">Readiness Check</p>
            <div className="space-y-4">
              {READINESS_ITEMS.map((item) => (
                <div className="flex items-center gap-3" key={item}>
                  <span className="h-5 w-5 rounded-sm bg-surface-container-lowest ghost-outline" />
                  <span className="text-sm font-medium text-on-surface">{item}</span>
                </div>
              ))}
            </div>
            <ButtonLink className="w-full justify-center" href={fullMockHref} size="lg">
              Launch Simulation
            </ButtonLink>
            <p className="text-center text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/65">
              Verification begins immediately
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
