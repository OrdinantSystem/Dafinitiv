import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { CHAT_EXERCISES } from "@/lib/chat-exercises/catalog";

export default function ChatExercisesPage() {
  return (
    <div className="mx-auto max-w-editorial space-y-10">
      <section className="max-w-3xl">
        <Pill>Chat Exercises</Pill>
        <h1 className="editorial-title mt-5">Five focused chat trainers for live MiniMax practice</h1>
        <p className="editorial-subtitle mt-5">
          Each view runs on the same live chat backend, but every trainer locks in a different
          system prompt so the conversation teaches a distinct TestDaF-related skill.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CHAT_EXERCISES.map((exercise) => (
          <Card className="flex h-full flex-col gap-5" key={exercise.slug} tone="default">
            <div className="space-y-3">
              <Pill size="sm" tone="soft">
                {exercise.eyebrow}
              </Pill>
              <h2 className="text-[1.45rem] font-extrabold tracking-[-0.03em] text-on-surface">
                {exercise.title}
              </h2>
              <p className="text-sm leading-7 text-on-surface-variant">{exercise.summary}</p>
            </div>

            <div className="space-y-3">
              <p className="editorial-kicker">Training goal</p>
              <p className="text-sm leading-7 text-on-surface">{exercise.trainingGoal}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {exercise.focusAreas.map((area) => (
                <Pill key={area} size="sm" tone="soft">
                  {area}
                </Pill>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-4">
              <ButtonLink href={`/chat-exercises/${exercise.slug}`}>Open trainer</ButtonLink>
              <Link
                className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary"
                href="/llm-test"
              >
                Free chat
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
