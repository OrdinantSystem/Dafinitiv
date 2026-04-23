import type {
  ProviderAdapter,
  ProviderResult,
  StructuredGenerationRequest
} from "./types";

interface JsonHttpProviderConfig {
  id: string;
  displayName: string;
  defaultModel: string;
  endpoint: string;
  apiKey?: string;
  apiKeyHeader?: string;
  extraHeaders?: Record<string, string>;
  mapRequest?<T>(request: StructuredGenerationRequest<T>, model: string): unknown;
  parseText?(payload: unknown): string;
}

function parseJsonObject<T>(rawText: string): T {
  return JSON.parse(rawText) as T;
}

export function createJsonHttpProviderAdapter(
  config: JsonHttpProviderConfig
): ProviderAdapter {
  return {
    id: config.id,
    displayName: config.displayName,
    defaultModel: config.defaultModel,
    supportsStructuredOutput: true,
    async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<ProviderResult<T>> {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...config.extraHeaders
      };

      if (config.apiKey) {
        headers[config.apiKeyHeader ?? "Authorization"] =
          config.apiKeyHeader === "Authorization"
            ? "Bearer " + config.apiKey
            : config.apiKey;
      }

      const body =
        config.mapRequest?.(request, config.defaultModel) ?? {
          model: config.defaultModel,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt }
          ]
        };

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (response.ok === false) {
        throw new Error("Provider " + config.id + " failed with status " + response.status + ".");
      }

      const payload = (await response.json()) as unknown;
      const rawText = config.parseText?.(payload) ?? JSON.stringify(payload);

      return {
        providerId: config.id,
        model: config.defaultModel,
        content: parseJsonObject<T>(rawText),
        rawText
      };
    }
  };
}
