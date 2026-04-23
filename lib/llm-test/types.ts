export interface LlmTestRuntimeSnapshot {
  runtimeMode: "live" | "fallback";
  runtimeLabel: string;
  model: string;
  baseUrlHost: string;
  debugLogsEnabled: boolean;
  liveEnabled: boolean;
}

export interface LlmTestChatMessage {
  id: string;
  role: "assistant" | "system" | "user";
  content: string;
  rawContent?: string;
  thinking?: string;
  meta?: {
    durationMs?: number;
    model?: string;
    timestamp: string;
  };
}

export interface LlmTestSystemPromptOption {
  id: string;
  label: string;
  purpose: string;
  category: string;
  content: string;
  promptPath?: string;
}

export interface LlmTestHistoryMessage {
  role: "assistant" | "user";
  content: string;
}

export interface LlmTestChatRequest {
  history: LlmTestHistoryMessage[];
  systemPromptId?: string | null;
  userMessage: string;
}

export interface LlmTestChatSuccess {
  ok: true;
  assistantMessage: {
    content: string;
  };
  meta: {
    durationMs: number;
    model: string;
    runtimeMode: "live" | "fallback";
    timestamp: string;
  };
}

export interface LlmTestChatFailure {
  ok: false;
  error: string;
  meta: {
    model: string;
    runtimeMode: "live" | "fallback";
    timestamp: string;
  };
}

export type LlmTestChatResponse = LlmTestChatSuccess | LlmTestChatFailure;

export type LlmTestStreamEvent =
  | {
      type: "reasoning";
      delta: string;
    }
  | {
      type: "delta";
      delta: string;
    }
  | {
      type: "usage";
      usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    }
  | {
      type: "done";
      meta: {
        durationMs: number;
        model: string;
        runtimeMode: "live" | "fallback";
        timestamp: string;
      };
    }
  | {
      type: "error";
      error: string;
      meta: {
        model: string;
        runtimeMode: "live" | "fallback";
        timestamp: string;
      };
    };

export interface LlmTestUsageViewModel {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  exact: boolean;
}
