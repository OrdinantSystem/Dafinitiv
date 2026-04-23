import OpenAI from "openai";

import { readServerEnv, getProviderRuntimeStatus } from "@/lib/server/env";
import { serverDebugLog } from "@/lib/server/debug-log";
import { getLlmTestSystemPromptOption } from "@/lib/server/llm-test-prompts";
import type {
  LlmTestChatRequest,
  LlmTestStreamEvent
} from "@/lib/llm-test/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_MINIMAX_ATTEMPTS = 3;
const RETRYABLE_MINIMAX_CODES = new Set(["1000", "1001", "1002", "1013", "1024", "1033"]);

function getBaseUrlHost(baseUrl: string): string {
  try {
    return new URL(baseUrl).host;
  } catch {
    return baseUrl;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function extractMiniMaxErrorDetails(error: unknown): {
  code: string | null;
  message: string;
} {
  let message = "";
  let code: string | null = null;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string" && error.message.trim().length > 0) {
      message = error.message;
    }

    if ("code" in error && (typeof error.code === "string" || typeof error.code === "number")) {
      code = String(error.code);
    }

    if ("error" in error && error.error && typeof error.error === "object") {
      if (
        "message" in error.error &&
        typeof error.error.message === "string" &&
        error.error.message.trim().length > 0 &&
        message.length === 0
      ) {
        message = error.error.message;
      }

      if (
        "code" in error.error &&
        (typeof error.error.code === "string" || typeof error.error.code === "number") &&
        code === null
      ) {
        code = String(error.error.code);
      }
    }
  }

  if (message.length === 0 && error instanceof Error && error.message.trim().length > 0) {
    message = error.message;
  }

  if (code === null) {
    code = message.match(/\((\d{3,4})\)/)?.[1] ?? null;
  }

  return {
    code,
    message: message.length > 0 ? message : "Unknown MiniMax error."
  };
}

function formatMiniMaxError(error: unknown): string {
  const details = extractMiniMaxErrorDetails(error);

  if (details.code === "1000") {
    return "MiniMax temporary server error (1000). The provider asked us to retry.";
  }

  if (details.code === "1001") {
    return "MiniMax request timeout (1001). Please retry in a moment.";
  }

  if (details.code === "1002") {
    return "MiniMax rate limit reached (1002). Please retry in a moment.";
  }

  if (details.code === "1013") {
    return "MiniMax internal service error (1013). Please retry in a moment.";
  }

  if (details.code === "1024") {
    return "MiniMax internal upstream error (1024). Please retry in a moment.";
  }

  if (details.code === "1033") {
    return "MiniMax service is temporarily unavailable (1033). Please retry in a moment.";
  }

  return `MiniMax request failed: ${details.message}`;
}

function getRetryDelayMs(attempt: number): number {
  return attempt === 0 ? 280 : 900;
}

function encodeEvent(encoder: TextEncoder, event: LlmTestStreamEvent): Uint8Array {
  return encoder.encode(JSON.stringify(event) + "\n");
}

function normalizeStreamText(snapshotOrDelta: string, previous: string): {
  delta: string;
  next: string;
} {
  if (snapshotOrDelta.length === 0) {
    return {
      delta: "",
      next: previous
    };
  }

  if (snapshotOrDelta.startsWith(previous)) {
    return {
      delta: snapshotOrDelta.slice(previous.length),
      next: snapshotOrDelta
    };
  }

  if (previous.endsWith(snapshotOrDelta)) {
    return {
      delta: "",
      next: previous
    };
  }

  return {
    delta: snapshotOrDelta,
    next: previous + snapshotOrDelta
  };
}

function extractReasoningSnapshot(value: unknown): string {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((detail) => {
      if (!detail || typeof detail !== "object") {
        return "";
      }

      const text = "text" in detail ? detail.text : undefined;
      return typeof text === "string" ? text : "";
    })
    .join("");
}

function buildErrorEvent(input: {
  error: string;
  model: string;
  runtimeMode: "live" | "fallback";
}): LlmTestStreamEvent {
  return {
    type: "error",
    error: input.error,
    meta: {
      model: input.model,
      runtimeMode: input.runtimeMode,
      timestamp: new Date().toISOString()
    }
  };
}

export async function POST(request: Request) {
  let input: LlmTestChatRequest;

  try {
    input = (await request.json()) as LlmTestChatRequest;
  } catch {
    return new Response(
      JSON.stringify(
        buildErrorEvent({
          error: "Invalid request payload.",
          model: "unknown",
          runtimeMode: "fallback"
        })
      ) + "\n",
      {
        status: 400,
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8"
        }
      }
    );
  }

  const env = readServerEnv();
  const runtimeStatus = getProviderRuntimeStatus(env);
  const trimmedMessage = input.userMessage.trim();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      if (trimmedMessage.length === 0) {
        controller.enqueue(
          encodeEvent(
            encoder,
            buildErrorEvent({
              error: "Write a message before sending it to the test chat.",
              model: env.OPENAI_MODEL,
              runtimeMode: runtimeStatus.mode
            })
          )
        );
        controller.close();
        return;
      }

      if (!runtimeStatus.enabled || !env.OPENAI_API_KEY) {
        controller.enqueue(
          encodeEvent(
            encoder,
            buildErrorEvent({
              error:
                "Live MiniMax is disabled. Set APP_ENABLE_REAL_LLM=true, make sure OPENAI_API_KEY is present, and restart the dev server.",
              model: env.OPENAI_MODEL,
              runtimeMode: runtimeStatus.mode
            })
          )
        );
        controller.close();
        return;
      }

      const client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: env.OPENAI_BASE_URL
      });
      const history = input.history.slice(-10).map((message) => ({
        role: message.role,
        content: message.content
      }));
      const selectedSystemPrompt = getLlmTestSystemPromptOption(input.systemPromptId);
      const startedAt = Date.now();
      let model = env.OPENAI_MODEL;
      let visibleText = "";
      let reasoningText = "";
      let visibleBuffer = "";
      let reasoningBuffer = "";
      let retryCount = 0;
      let usageSnapshot:
        | {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
          }
        | null = null;

      serverDebugLog("llm-test-stream", "chat.start", {
        model: env.OPENAI_MODEL,
        messageCount: history.length + 1,
        baseUrlHost: getBaseUrlHost(env.OPENAI_BASE_URL),
        systemPromptId: selectedSystemPrompt?.id ?? "none"
      });

      try {
        const promptMessages = selectedSystemPrompt
          ? [
              {
                role: "system" as const,
                content: selectedSystemPrompt.content
              }
            ]
          : [];
        for (let attempt = 0; attempt < MAX_MINIMAX_ATTEMPTS; attempt += 1) {
          try {
            const requestBody = {
              model: env.OPENAI_MODEL,
              stream: true,
              stream_options: {
                include_usage: true
              },
              extra_body: {
                reasoning_split: true
              },
              messages: [
                ...promptMessages,
                ...history,
                {
                  role: "user",
                  content: trimmedMessage
                }
              ]
            } as unknown as Parameters<typeof client.chat.completions.create>[0];

            const response = (await client.chat.completions.create(requestBody, {
              signal: request.signal
            })) as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;

            for await (const chunk of response) {
              model = chunk.model ?? model;
              if (chunk.usage) {
                usageSnapshot = {
                  promptTokens: chunk.usage.prompt_tokens ?? 0,
                  completionTokens: chunk.usage.completion_tokens ?? 0,
                  totalTokens:
                    chunk.usage.total_tokens ??
                    (chunk.usage.prompt_tokens ?? 0) + (chunk.usage.completion_tokens ?? 0)
                };

                controller.enqueue(
                  encodeEvent(encoder, {
                    type: "usage",
                    usage: usageSnapshot
                  })
                );
              }
              const choice = chunk.choices[0];
              const delta = choice?.delta;
              const reasoningSnapshot = extractReasoningSnapshot(
                delta && typeof delta === "object" && "reasoning_details" in delta
                  ? delta.reasoning_details
                  : undefined
              );
              const normalizedReasoning = normalizeStreamText(reasoningSnapshot, reasoningBuffer);
              const contentSnapshot =
                typeof choice?.delta?.content === "string" ? choice.delta.content : "";
              const normalizedContent = normalizeStreamText(contentSnapshot, visibleBuffer);

              reasoningBuffer = normalizedReasoning.next;
              visibleBuffer = normalizedContent.next;

              if (normalizedReasoning.delta.length > 0) {
                reasoningText += normalizedReasoning.delta;
                controller.enqueue(
                  encodeEvent(encoder, {
                    type: "reasoning",
                    delta: normalizedReasoning.delta
                  })
                );
              }

              if (normalizedContent.delta.length > 0) {
                visibleText += normalizedContent.delta;
                controller.enqueue(
                  encodeEvent(encoder, {
                    type: "delta",
                    delta: normalizedContent.delta
                  })
                );
              }
            }

            break;
          } catch (error) {
            const details = extractMiniMaxErrorDetails(error);
            const shouldRetry =
              attempt < MAX_MINIMAX_ATTEMPTS - 1 &&
              visibleText.length === 0 &&
              reasoningText.length === 0 &&
              details.code !== null &&
              RETRYABLE_MINIMAX_CODES.has(details.code);

            if (!shouldRetry) {
              throw new Error(formatMiniMaxError(error));
            }

            serverDebugLog("llm-test-stream", "chat.retry", {
              attempt: attempt + 1,
              code: details.code,
              message: details.message
            });
            retryCount += 1;
            await sleep(getRetryDelayMs(attempt));
          }
        }

        if (visibleText.length === 0) {
          controller.enqueue(
            encodeEvent(
              encoder,
              buildErrorEvent({
                error: "MiniMax returned an empty response.",
                model,
                runtimeMode: runtimeStatus.mode
              })
            )
          );
          controller.close();
          return;
        }

        const durationMs = Date.now() - startedAt;
        serverDebugLog("llm-test-stream", "chat.success", {
          model,
          durationMs,
          responseChars: visibleText.length,
          reasoningChars: reasoningText.length,
          systemPromptId: selectedSystemPrompt?.id ?? "none",
          promptTokens: usageSnapshot?.promptTokens ?? 0,
          completionTokens: usageSnapshot?.completionTokens ?? 0,
          totalTokens: usageSnapshot?.totalTokens ?? 0
        });

        controller.enqueue(
          encodeEvent(encoder, {
            type: "done",
            meta: {
              durationMs,
              model,
              runtimeMode: runtimeStatus.mode,
              timestamp: new Date().toISOString()
            }
          })
        );
      } catch (error) {
        const durationMs = Date.now() - startedAt;
        const message = formatMiniMaxError(error);
        const finalMessage =
          retryCount > 0 ? `${message} We already retried ${retryCount} time(s).` : message;

        serverDebugLog("llm-test-stream", "chat.error", {
          model,
          durationMs,
          message: finalMessage,
          systemPromptId: selectedSystemPrompt?.id ?? "none"
        });

        controller.enqueue(
          encodeEvent(
            encoder,
            buildErrorEvent({
              error: finalMessage,
              model,
              runtimeMode: runtimeStatus.mode
            })
          )
        );
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
}
