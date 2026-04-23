import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}, z.string().optional());

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
}, z.boolean());

const envSchema = z.object({
  OPENAI_API_KEY: optionalString,
  OPENAI_BASE_URL: z.string().default("https://api.minimax.io/v1"),
  OPENAI_MODEL: z.string().default("MiniMax-M2.5"),
  APP_ENABLE_REAL_LLM: booleanFromEnv.default(false),
  APP_ENABLE_DEBUG_LOGS: booleanFromEnv.default(false),
  APP_DEMO_USER_ID: z.string().default("demo-lerner")
});

export type ServerEnv = z.infer<typeof envSchema>;

export interface ProviderRuntimeStatus {
  enabled: boolean;
  mode: "live" | "fallback";
  label: string;
  description: string;
}

export function readServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  return envSchema.parse(source);
}

export function isRealLlmEnabled(env: ServerEnv): boolean {
  return env.APP_ENABLE_REAL_LLM && Boolean(env.OPENAI_API_KEY && env.OPENAI_BASE_URL && env.OPENAI_MODEL);
}

export function getProviderRuntimeStatus(env: ServerEnv): ProviderRuntimeStatus {
  if (isRealLlmEnabled(env)) {
    return {
      enabled: true,
      mode: "live",
      label: "MiniMax live",
      description: "Das Workspace-Backend verwendet MiniMax-M2.5 über das OpenAI SDK."
    };
  }

  return {
    enabled: false,
    mode: "fallback",
    label: "Demo-Fallback",
    description: "Ohne API-Zugang bleibt die Web-App mit strukturierten Offline-Fallbacks vollständig nutzbar."
  };
}
