import { ProviderRouter } from "@/src/providers/provider-router";
import type {
  ProviderAdapter,
  ProviderResult,
  StructuredGenerationRequest
} from "@/src/providers/types";

import {
  getProviderRuntimeStatus,
  readServerEnv,
  type ProviderRuntimeStatus,
  type ServerEnv
} from "@/lib/server/env";
import { serverDebugLog } from "@/lib/server/debug-log";
import { createOpenAICompatibleProviderAdapter } from "@/lib/server/openai-compatible-provider";

function createFallbackProviderAdapter(): ProviderAdapter {
  return {
    id: "local-fallback",
    displayName: "Local Fallback",
    defaultModel: "heuristic",
    supportsStructuredOutput: true,
    async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<ProviderResult<T>> {
      return {
        providerId: "local-fallback",
        model: "heuristic",
        content: request.fallback,
        rawText: JSON.stringify(request.fallback)
      };
    }
  };
}

export interface WebProviderRouterBundle {
  env: ServerEnv;
  router: ProviderRouter;
  runtime: ProviderRuntimeStatus;
}

export function createWebProviderRouter(
  source: Record<string, string | undefined> = process.env
): WebProviderRouterBundle {
  const env = readServerEnv(source);
  const runtime = getProviderRuntimeStatus(env);
  const fallbackProvider = createFallbackProviderAdapter();

  serverDebugLog("provider-router", "runtime.resolved", {
    runtimeMode: runtime.mode,
    realLlmEnabled: runtime.enabled,
    model: env.OPENAI_MODEL,
    baseUrl: env.OPENAI_BASE_URL
  });

  if (!runtime.enabled || !env.OPENAI_API_KEY) {
    return {
      env,
      router: new ProviderRouter([fallbackProvider], fallbackProvider.id),
      runtime
    };
  }

  const liveProvider = createOpenAICompatibleProviderAdapter({
    id: "minimax-openai",
    displayName: "MiniMax via OpenAI SDK",
    baseURL: env.OPENAI_BASE_URL,
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL
  });

  return {
    env,
    router: new ProviderRouter([liveProvider, fallbackProvider], liveProvider.id),
    runtime
  };
}
