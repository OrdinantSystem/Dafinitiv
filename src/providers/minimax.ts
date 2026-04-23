import { createJsonHttpProviderAdapter } from "./json-http";
import type { ProviderAdapter } from "./types";

export interface MiniMaxProviderConfig {
  endpoint: string;
  model: string;
  apiKey?: string;
}

export function createMiniMaxProviderAdapter(
  config: MiniMaxProviderConfig
): ProviderAdapter {
  return createJsonHttpProviderAdapter({
    id: "minimax",
    displayName: "MiniMax",
    defaultModel: config.model,
    endpoint: config.endpoint,
    apiKey: config.apiKey
  });
}
