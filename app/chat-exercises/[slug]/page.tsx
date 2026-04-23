import { notFound } from "next/navigation";

import { LlmTestChat } from "@/components/llm-test/llm-test-chat";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import {
  CHAT_EXERCISES,
  getChatExerciseBySlug
} from "@/lib/chat-exercises/catalog";
import type { LlmTestChatMessage } from "@/lib/llm-test/types";
import { getWebApplicationService } from "@/lib/server/app-service";
import { getLlmTestSystemPromptOption } from "@/lib/server/llm-test-prompts";

function getBaseUrlHost(baseUrl: string): string {
  try {
    return new URL(baseUrl).host;
  } catch {
    return baseUrl;
  }
}

export function generateStaticParams() {
  return CHAT_EXERCISES.map((exercise) => ({
    slug: exercise.slug
  }));
}

export default async function ChatExerciseDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exercise = getChatExerciseBySlug(slug);

  if (!exercise) {
    notFound();
  }

  const selectedPrompt = getLlmTestSystemPromptOption(exercise.promptPath);

  if (!selectedPrompt) {
    notFound();
  }

  const { env, runtime } = getWebApplicationService();
  const initialMessages: LlmTestChatMessage[] = [
    {
      id: `${exercise.slug}-welcome`,
      role: "assistant",
      content: `${exercise.title}. Start when you're ready.`,
      meta: {
        model: env.OPENAI_MODEL,
        timestamp: new Date().toISOString()
      }
    }
  ];

  return (
    <div className="mx-auto max-w-editorial space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="max-w-4xl">
          <Pill>{exercise.eyebrow}</Pill>
          <h1 className="editorial-title mt-5">{exercise.title}</h1>
          <p className="editorial-subtitle mt-5">{exercise.summary}</p>
        </div>

        <Card className="space-y-5" tone="glass">
          <div>
            <p className="editorial-kicker">Training goal</p>
            <p className="mt-3 text-sm leading-7 text-on-surface">{exercise.trainingGoal}</p>
          </div>
          <div>
            <p className="editorial-kicker">Try one of these</p>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-on-surface-variant">
              {exercise.starterPrompts.map((starter) => (
                <li key={starter}>• {starter}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            {exercise.focusAreas.map((area) => (
              <Pill key={area} size="sm" tone="soft">
                {area}
              </Pill>
            ))}
          </div>
        </Card>
      </section>

      <LlmTestChat
        conversationSubtitle="Exercise"
        conversationTitle={exercise.title}
        defaultSystemPromptId={selectedPrompt.id}
        initialMessages={initialMessages}
        lockSystemPrompt
        mobileEdgeToEdge
        exerciseMode
        runtime={{
          runtimeMode: runtime.mode,
          runtimeLabel: runtime.label,
          model: env.OPENAI_MODEL,
          baseUrlHost: getBaseUrlHost(env.OPENAI_BASE_URL),
          debugLogsEnabled: env.APP_ENABLE_DEBUG_LOGS,
          liveEnabled: runtime.enabled
        }}
        systemPromptOptions={[selectedPrompt]}
      />
    </div>
  );
}
