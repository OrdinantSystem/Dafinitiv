import OpenAI from "openai";

import type {
  ProviderAdapter,
  ProviderResult,
  StructuredGenerationRequest
} from "@/src/providers/types";
import { serverDebugLog } from "@/lib/server/debug-log";

interface OpenAICompatibleProviderConfig {
  id: string;
  displayName: string;
  baseURL: string;
  apiKey: string;
  model: string;
}

export function createOpenAICompatibleProviderAdapter(
  config: OpenAICompatibleProviderConfig
): ProviderAdapter {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL
  });

  return {
    id: config.id,
    displayName: config.displayName,
    defaultModel: config.model,
    supportsStructuredOutput: true,
    async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<ProviderResult<T>> {
      const startedAt = Date.now();
      serverDebugLog("provider", "request.start", {
        providerId: config.id,
        operation: request.operationName,
        model: config.model
      });

      try {
        const response = await client.chat.completions.create({
          model: config.model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt }
          ]
        });
        const rawText = response.choices[0]?.message?.content ?? JSON.stringify(request.fallback);
        const durationMs = Date.now() - startedAt;

        try {
          const content = JSON.parse(rawText) as T;
          serverDebugLog("provider", "request.success", {
            providerId: config.id,
            operation: request.operationName,
            model: config.model,
            durationMs
          });

          return {
            providerId: config.id,
            model: config.model,
            content,
            rawText,
            usedFallback: false
          };
        } catch {
          serverDebugLog("provider", "request.invalid_json_fallback", {
            providerId: config.id,
            operation: request.operationName,
            model: config.model,
            durationMs
          });

          return {
            providerId: config.id,
            model: config.model,
            content: request.fallback,
            rawText,
            usedFallback: true,
            errorMessage: "Provider returned invalid JSON."
          };
        }
      } catch (error) {
        serverDebugLog("provider", "request.error_fallback", {
          providerId: config.id,
          operation: request.operationName,
          model: config.model,
          durationMs: Date.now() - startedAt,
          message: error instanceof Error ? error.message : "Unknown provider error"
        });

        return {
          providerId: config.id,
          model: config.model,
          content: request.fallback,
          rawText: JSON.stringify(request.fallback),
          usedFallback: true,
          errorMessage: error instanceof Error ? error.message : "Unknown provider error"
        };
      }
    }
  };
}
