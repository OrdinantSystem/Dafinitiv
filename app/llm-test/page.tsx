import { LlmTestChat } from "@/components/llm-test/llm-test-chat";
import { getWebApplicationService } from "@/lib/server/app-service";
import { listLlmTestSystemPromptOptions } from "@/lib/server/llm-test-prompts";
import type { LlmTestChatMessage } from "@/lib/llm-test/types";

export const dynamic = "force-dynamic";

function getBaseUrlHost(baseUrl: string): string {
  try {
    return new URL(baseUrl).host;
  } catch {
    return baseUrl;
  }
}

export default function LlmTestPage() {
  const { env, runtime } = getWebApplicationService();
  const systemPromptOptions = listLlmTestSystemPromptOptions();
  const initialTimestamp = new Date().toISOString();
  const initialMessages: LlmTestChatMessage[] = runtime.enabled
    ? [
        {
          id: "assistant-welcome",
          role: "assistant",
          content:
            "Let's chat!",
          meta: {
            model: env.OPENAI_MODEL,
            timestamp: initialTimestamp
          }
        }
      ]
    : [
        {
          id: "system-disabled",
          role: "system",
          content:
            "Live MiniMax is currently disabled. Turn on APP_ENABLE_REAL_LLM and restart the dev server before using this test chat.",
          meta: {
            timestamp: initialTimestamp
          }
        }
      ];

  return (
    <LlmTestChat
      initialMessages={initialMessages}
      runtime={{
        runtimeMode: runtime.mode,
        runtimeLabel: runtime.label,
        model: env.OPENAI_MODEL,
        baseUrlHost: getBaseUrlHost(env.OPENAI_BASE_URL),
        debugLogsEnabled: env.APP_ENABLE_DEBUG_LOGS,
        liveEnabled: runtime.enabled
      }}
      systemPromptOptions={systemPromptOptions}
    />
  );
}
