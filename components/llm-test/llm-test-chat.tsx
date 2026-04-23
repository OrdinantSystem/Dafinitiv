"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";

import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { MarkdownPreview } from "@/components/ui/markdown-preview";
import { Pill } from "@/components/ui/pill";
import type {
  LlmTestChatMessage,
  LlmTestHistoryMessage,
  LlmTestStreamEvent,
  LlmTestRuntimeSnapshot,
  LlmTestSystemPromptOption,
  LlmTestUsageViewModel
} from "@/lib/llm-test/types";
import { cn } from "@/lib/utils";

const THINK_OPEN_TAG = "<think>";
const THINK_CLOSE_TAG = "</think>";

function createMessageId(prefix: string): string {
  return prefix + "-" + Date.now() + "-" + Math.round(Math.random() * 100000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function estimateTokens(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }

  return Math.max(1, Math.round(trimmed.length / 4));
}

function estimatePromptTokens(history: LlmTestHistoryMessage[], userMessage: string): number {
  const promptPayload =
    "system:You are the live MiniMax test assistant inside DaFinitv." +
    history.map((message) => `${message.role}:${message.content}`).join("\n") +
    "\nuser:" +
    userMessage;

  return estimateTokens(promptPayload);
}

function suffixPrefixLength(value: string, token: string): number {
  const maxLength = Math.min(value.length, token.length - 1);

  for (let length = maxLength; length > 0; length -= 1) {
    if (token.startsWith(value.slice(-length))) {
      return length;
    }
  }

  return 0;
}

function createThinkParser() {
  let mode: "text" | "thinking" = "text";
  let pending = "";

  return {
    push(input: string) {
      let source = pending + input;
      pending = "";
      let textDelta = "";
      let thinkingDelta = "";

      while (source.length > 0) {
        if (mode === "text") {
          const openIndex = source.indexOf(THINK_OPEN_TAG);

          if (openIndex === -1) {
            const keep = suffixPrefixLength(source, THINK_OPEN_TAG);
            textDelta += source.slice(0, source.length - keep);
            pending = source.slice(source.length - keep);
            break;
          }

          textDelta += source.slice(0, openIndex);
          source = source.slice(openIndex + THINK_OPEN_TAG.length);
          mode = "thinking";
          continue;
        }

        const closeIndex = source.indexOf(THINK_CLOSE_TAG);

        if (closeIndex === -1) {
          const keep = suffixPrefixLength(source, THINK_CLOSE_TAG);
          thinkingDelta += source.slice(0, source.length - keep);
          pending = source.slice(source.length - keep);
          break;
        }

        thinkingDelta += source.slice(0, closeIndex);
        source = source.slice(closeIndex + THINK_CLOSE_TAG.length);
        mode = "text";
      }

      return { textDelta, thinkingDelta };
    },
    flush() {
      if (pending.length === 0) {
        return { textDelta: "", thinkingDelta: "" };
      }

      const token = mode === "text" ? THINK_OPEN_TAG : THINK_CLOSE_TAG;
      const unresolvedPartial = token.startsWith(pending);
      const value = unresolvedPartial ? "" : pending;
      pending = "";

      return mode === "text"
        ? { textDelta: value, thinkingDelta: "" }
        : { textDelta: "", thinkingDelta: value };
    }
  };
}

function appendStreamDelta(input: {
  delta: string;
  field: "content" | "thinking";
  messageId: string;
  setMessages: Dispatch<SetStateAction<LlmTestChatMessage[]>>;
}): void {
  if (input.delta.length === 0) {
    return;
  }

  input.setMessages((current) =>
    current.map((message) => {
      if (message.id !== input.messageId) {
        return message;
      }

      const currentValue = message[input.field] ?? "";
      const nextValue = currentValue + input.delta;
      const nextContent = input.field === "content" ? nextValue : message.content;
      const nextThinking = input.field === "thinking" ? nextValue : message.thinking ?? "";

      return {
        ...message,
        [input.field]: nextValue,
        rawContent: composeAssistantRawContent(nextContent, nextThinking)
      };
    })
  );
}

async function appendAnimatedDelta(input: {
  delta: string;
  field: "content" | "thinking";
  messageId: string;
  setMessages: Dispatch<SetStateAction<LlmTestChatMessage[]>>;
  shouldContinue?: () => boolean;
}) {
  if (input.delta.length === 0) {
    return;
  }

  const segmentSize = input.delta.length > 36 ? 3 : input.delta.length > 18 ? 2 : 1;

  for (let index = 0; index < input.delta.length; index += segmentSize) {
    if (input.shouldContinue && !input.shouldContinue()) {
      return;
    }

    const segment = input.delta.slice(index, index + segmentSize);
    appendStreamDelta({
      ...input,
      delta: segment
    });

    if (index + segmentSize < input.delta.length) {
      await sleep(6);
    }
  }
}

function formatUsage(value: number, exact: boolean): string {
  return exact ? String(value) : `~${value}`;
}

function composeAssistantRawContent(content: string, thinking?: string): string {
  const normalizedContent = content === "…" ? "" : content;
  const normalizedThinking = thinking ?? "";

  return normalizedThinking.length > 0
    ? `${THINK_OPEN_TAG}${normalizedThinking}${THINK_CLOSE_TAG}${normalizedContent}`
    : normalizedContent;
}

function ThinkingDots() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant/78">
      <span>Thinking</span>
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-surface-variant/60"
            key={index}
            style={{
              animationDelay: `${index * 180}ms`,
              animationDuration: "900ms"
            }}
          />
        ))}
      </span>
    </div>
  );
}

export function LlmTestChat({
  initialMessages,
  runtime,
  systemPromptOptions,
  defaultSystemPromptId = "none",
  lockSystemPrompt = false,
  mobileEdgeToEdge = false,
  exerciseMode = false,
  conversationTitle = "MiniMax Test Chat",
  conversationSubtitle = "Conversation"
}: {
  initialMessages: LlmTestChatMessage[];
  runtime: LlmTestRuntimeSnapshot;
  systemPromptOptions: LlmTestSystemPromptOption[];
  defaultSystemPromptId?: string;
  lockSystemPrompt?: boolean;
  mobileEdgeToEdge?: boolean;
  exerciseMode?: boolean;
  conversationTitle?: string;
  conversationSubtitle?: string;
}) {
  const [messages, setMessages] = useState<LlmTestChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [usage, setUsage] = useState<LlmTestUsageViewModel>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    exact: false
  });
  const [selectedSystemPromptId, setSelectedSystemPromptId] = useState(defaultSystemPromptId);
  const [renderMode, setRenderMode] = useState<"preview" | "raw">("preview");
  const [showSelectedSystemPrompt, setShowSelectedSystemPrompt] = useState(false);
  const [streamPhase, setStreamPhase] = useState<"idle" | "connecting" | "thinking" | "answering">(
    "idle"
  );
  const [openPromptGroups, setOpenPromptGroups] = useState<Record<string, boolean>>(() => {
    const groupState: Record<string, boolean> = {};

    for (const option of systemPromptOptions) {
      if (option.id === "none" || option.category in groupState) {
        continue;
      }

      groupState[option.category] = option.category === "Shared Blocks";
    }

    return groupState;
  });
  const [openThinkingIds, setOpenThinkingIds] = useState<Record<string, boolean>>({});
  const messageScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const requestLogCountRef = useRef(0);
  const autoScrollRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeStreamRunIdRef = useRef(0);
  const historyIndexRef = useRef<number | null>(null);
  const historyDraftRef = useRef("");
  const thinkingCount = useMemo(
    () =>
      messages.filter(
        (message) => message.role === "assistant" && Boolean(message.thinking?.trim().length)
      ).length,
    [messages]
  );
  const selectedSystemPrompt = useMemo(
    () =>
      systemPromptOptions.find((option) => option.id === selectedSystemPromptId) ?? systemPromptOptions[0],
    [selectedSystemPromptId, systemPromptOptions]
  );
  const promptGroups = useMemo(() => {
    const groups = new Map<string, LlmTestSystemPromptOption[]>();

    for (const option of systemPromptOptions) {
      if (option.id === "none") {
        continue;
      }

      const existing = groups.get(option.category);

      if (existing) {
        existing.push(option);
        continue;
      }

      groups.set(option.category, [option]);
    }

    return Array.from(groups.entries()).map(([category, options]) => ({
      category,
      options
    }));
  }, [systemPromptOptions]);
  const userInputHistory = useMemo(
    () =>
      messages
        .filter((message): message is LlmTestChatMessage & { role: "user" } => message.role === "user")
        .map((message) => message.content),
    [messages]
  );
  const hasSelectedSystemPrompt = selectedSystemPrompt.id !== "none";
  const composerStatus =
    isStreaming && streamPhase === "connecting"
      ? "Connecting to MiniMax..."
      : isStreaming && streamPhase === "thinking"
        ? "MiniMax is thinking..."
        : isStreaming && streamPhase === "answering"
          ? "MiniMax is replying..."
          : !runtime.liveEnabled
            ? "Live mode is off."
            : null;

  const canSend = runtime.liveEnabled && input.trim().length > 0 && !isStreaming;
  const minimumComposerHeight = exerciseMode ? 24 : 28;
  const composerPlaceholder = exerciseMode ? "Type here…" : `Message ${runtime.model}...`;
  const conversationHistory = useMemo(
    () =>
      messages
        .filter(
          (message): message is LlmTestChatMessage & { role: LlmTestHistoryMessage["role"] } =>
            message.role === "assistant" || message.role === "user"
        )
        .map((message) => ({
          role: message.role,
          content: message.role === "assistant" ? message.rawContent ?? message.content : message.content
        })),
    [messages]
  );

  useEffect(() => {
    setSelectedSystemPromptId(defaultSystemPromptId);
    setShowSelectedSystemPrompt(defaultSystemPromptId !== "none");
  }, [defaultSystemPromptId]);

  useEffect(() => {
    console.info("[llm-test] runtime", {
      runtimeMode: runtime.runtimeMode,
      runtimeLabel: runtime.runtimeLabel,
      model: runtime.model,
      baseUrlHost: runtime.baseUrlHost,
      liveEnabled: runtime.liveEnabled,
      debugLogsEnabled: runtime.debugLogsEnabled
    });
  }, [runtime]);

  useEffect(() => {
    console.info("[llm-test] system-prompt", {
      id: selectedSystemPrompt.id,
      label: selectedSystemPrompt.label,
      promptPath: selectedSystemPrompt.promptPath ?? "none"
    });
  }, [selectedSystemPrompt]);

  useEffect(() => {
    const scrollNode = messageScrollRef.current;

    if (!scrollNode || !autoScrollRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollNode.scrollTo({
        top: scrollNode.scrollHeight,
        behavior: isStreaming ? "auto" : "smooth"
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "0px";
    const nextHeight = Math.min(Math.max(textareaRef.current.scrollHeight, minimumComposerHeight), 220);
    textareaRef.current.style.height = `${nextHeight}px`;
  }, [input, minimumComposerHeight]);

  const toggleThinking = (messageId: string) => {
    setOpenThinkingIds((current) => ({
      ...current,
      [messageId]: !current[messageId]
    }));
  };
  const toggleRenderMode = () => {
    setRenderMode((current) => (current === "preview" ? "raw" : "preview"));
  };
  const toggleSelectedSystemPrompt = () => {
    setShowSelectedSystemPrompt((current) => !current);
  };
  const togglePromptGroup = (category: string) => {
    setOpenPromptGroups((current) => ({
      ...current,
      [category]: !current[category]
    }));
  };
  const applySystemPrompt = (option: LlmTestSystemPromptOption) => {
    setSelectedSystemPromptId(option.id);
    setShowSelectedSystemPrompt(option.id !== "none");

    if (option.id !== "none") {
      setOpenPromptGroups((current) => ({
        ...current,
        [option.category]: true
      }));
    }
  };
  const stopStreaming = () => {
    activeStreamRunIdRef.current = 0;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
    setStreamPhase("idle");
  };
  const handleMessageListScroll = () => {
    const scrollNode = messageScrollRef.current;

    if (!scrollNode) {
      return;
    }

    const distanceFromBottom =
      scrollNode.scrollHeight - scrollNode.scrollTop - scrollNode.clientHeight;

    if (autoScrollRef.current) {
      autoScrollRef.current = distanceFromBottom <= 96;
      return;
    }

    if (distanceFromBottom <= 12) {
      autoScrollRef.current = true;
    }
  };
  const navigateInputHistory = (direction: "up" | "down") => {
    if (userInputHistory.length === 0) {
      return false;
    }

    if (direction === "up") {
      if (historyIndexRef.current === null) {
        historyDraftRef.current = input;
        historyIndexRef.current = userInputHistory.length - 1;
      } else {
        historyIndexRef.current = Math.max(0, historyIndexRef.current - 1);
      }

      setInput(userInputHistory[historyIndexRef.current] ?? "");
      return true;
    }

    if (historyIndexRef.current === null) {
      return false;
    }

    if (historyIndexRef.current >= userInputHistory.length - 1) {
      historyIndexRef.current = null;
      setInput(historyDraftRef.current);
      return true;
    }

    historyIndexRef.current += 1;
    setInput(userInputHistory[historyIndexRef.current] ?? "");
    return true;
  };
  const handleInputChange = (value: string) => {
    if (historyIndexRef.current === null) {
      historyDraftRef.current = value;
    }

    setInput(value);
  };
  const send = () => {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0 || isStreaming) {
      return;
    }

    const userMessage: LlmTestChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: trimmedInput,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    const promptEstimate = estimatePromptTokens(conversationHistory, trimmedInput);

    setMessages((current) => [...current, userMessage]);
    setInput("");
    historyIndexRef.current = null;
    historyDraftRef.current = "";
    setIsStreaming(true);
    setStreamPhase("connecting");
    autoScrollRef.current = true;
    setUsage({
      promptTokens: promptEstimate,
      completionTokens: 0,
      totalTokens: promptEstimate,
      exact: false
    });

    void (async () => {
      const runId = Date.now();
      activeStreamRunIdRef.current = runId;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const assistantMessageId = createMessageId("assistant");
      const parser = createThinkParser();
      let receivedVisibleDelta = false;
      let accumulatedVisibleContent = "";
      let accumulatedThinking = "";
      let visibleAnimation = Promise.resolve();
      const isActiveRun = () => activeStreamRunIdRef.current === runId;

      setMessages((current) => [
        ...current,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          rawContent: "",
          thinking: ""
        }
      ]);
      setOpenThinkingIds((current) => ({
        ...current,
        [assistantMessageId]: false
      }));

      try {
        const requestMessages = [
          ...(selectedSystemPrompt.id !== "none"
            ? [
                {
                  role: "system" as const,
                  content: selectedSystemPrompt.content
                }
              ]
            : []),
          ...conversationHistory,
          {
            role: "user" as const,
            content: trimmedInput
          }
        ];
        requestLogCountRef.current += 1;
        console.info("[llm-test] minimax.request", {
          callIndex: requestLogCountRef.current,
          model: runtime.model,
          systemPromptId: selectedSystemPrompt.id,
          systemPromptLabel: selectedSystemPrompt.label,
          messages: requestMessages
        });

        const response = await fetch("/api/llm-test/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          signal: abortController.signal,
          body: JSON.stringify({
            history: conversationHistory,
            systemPromptId: selectedSystemPrompt.id === "none" ? null : selectedSystemPrompt.id,
            userMessage: trimmedInput
          })
        });

        if (!response.body) {
          throw new Error("The stream did not return a readable body.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const updateEstimatedUsage = () => {
          const completionEstimate = estimateTokens(
            composeAssistantRawContent(accumulatedVisibleContent, accumulatedThinking)
          );
          setUsage((current) => ({
            promptTokens: current.exact ? current.promptTokens : promptEstimate,
            completionTokens: current.exact ? current.completionTokens : completionEstimate,
            totalTokens:
              current.exact ? current.totalTokens : promptEstimate + completionEstimate,
            exact: current.exact
          }));
        };

        const queueVisibleDelta = (delta: string) => {
          if (delta.length === 0 || !isActiveRun()) {
            return;
          }

          visibleAnimation = visibleAnimation.then(() =>
            appendAnimatedDelta({
              delta,
              field: "content",
              messageId: assistantMessageId,
              setMessages,
              shouldContinue: isActiveRun
            })
          );
        };

        const applyDelta = (rawDelta: string) => {
          if (!isActiveRun()) {
            return;
          }

          const { textDelta, thinkingDelta } = parser.push(rawDelta);

          if (thinkingDelta.length > 0) {
            setStreamPhase("thinking");
            accumulatedThinking += thinkingDelta;
            appendStreamDelta({
              delta: thinkingDelta,
              field: "thinking",
              messageId: assistantMessageId,
              setMessages
            });
          }

          if (textDelta.length > 0) {
            receivedVisibleDelta = true;
            setStreamPhase("answering");
            accumulatedVisibleContent += textDelta;
            queueVisibleDelta(textDelta);
          }

          updateEstimatedUsage();
        };

        const applyReasoning = (delta: string) => {
          if (delta.length === 0 || !isActiveRun()) {
            return;
          }

          setStreamPhase("thinking");
          accumulatedThinking += delta;
          appendStreamDelta({
            delta,
            field: "thinking",
            messageId: assistantMessageId,
            setMessages
          });
          updateEstimatedUsage();
        };

        const applyEvent = (event: LlmTestStreamEvent) => {
          if (!isActiveRun()) {
            return;
          }

          if (event.type === "reasoning") {
            applyReasoning(event.delta);
            return;
          }

          if (event.type === "delta") {
            applyDelta(event.delta);
            return;
          }

          if (event.type === "usage") {
            setUsage({
              promptTokens: event.usage.promptTokens,
              completionTokens: event.usage.completionTokens,
              totalTokens: event.usage.totalTokens,
              exact: true
            });
            console.info("[llm-test] usage", event.usage);
            return;
          }

          if (event.type === "done") {
            const { textDelta, thinkingDelta } = parser.flush();

            if (thinkingDelta.length > 0) {
              accumulatedThinking += thinkingDelta;
              appendStreamDelta({
                delta: thinkingDelta,
                field: "thinking",
                messageId: assistantMessageId,
                setMessages
              });
            }

            if (textDelta.length > 0) {
              receivedVisibleDelta = true;
              setStreamPhase("answering");
              accumulatedVisibleContent += textDelta;
              queueVisibleDelta(textDelta);
            }

            console.info("[llm-test] stream.done", {
              model: event.meta.model,
              runtimeMode: event.meta.runtimeMode,
              durationMs: event.meta.durationMs
            });

            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      meta: {
                        durationMs: event.meta.durationMs,
                        model: event.meta.model,
                        timestamp: event.meta.timestamp
                      }
                    }
                  : message
              )
            );
            return;
          }

          console.error("[llm-test] stream.error", {
            error: event.error,
            model: event.meta.model,
            runtimeMode: event.meta.runtimeMode
          });

          if (!receivedVisibleDelta && accumulatedThinking.length === 0) {
            setMessages((current) => [
              ...current.filter((message) => message.id !== assistantMessageId),
              {
                id: createMessageId("system"),
                role: "system",
                content: event.error
              }
            ]);
            return;
          }

          setMessages((current) => [
            ...current,
            {
              id: createMessageId("system"),
              role: "system",
              content: event.error
            }
          ]);
        };

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              const trailing = buffer.trim();
              if (trailing.length > 0) {
                applyEvent(JSON.parse(trailing) as LlmTestStreamEvent);
              }
              break;
            }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0) {
              continue;
            }

            applyEvent(JSON.parse(trimmedLine) as LlmTestStreamEvent);
          }
        }

        await visibleAnimation;
      } catch (streamError) {
        const aborted =
          (streamError instanceof DOMException && streamError.name === "AbortError") ||
          (streamError instanceof Error && streamError.name === "AbortError") ||
          !isActiveRun();

        if (aborted) {
          if (!receivedVisibleDelta && accumulatedThinking.length === 0) {
            setMessages((current) => current.filter((message) => message.id !== assistantMessageId));
          }
          return;
        }

        const message =
          streamError instanceof Error && streamError.message.trim().length > 0
            ? streamError.message
            : "Unknown streaming error.";

        console.error("[llm-test] stream.fatal", {
          error: message,
          model: runtime.model
        });
        setMessages((current) => [
          ...current.filter((message) => message.id !== assistantMessageId),
          {
            id: createMessageId("system"),
            role: "system",
            content: `Streaming failed: ${message}`
          }
        ]);
      } finally {
        if (activeStreamRunIdRef.current === runId) {
          activeStreamRunIdRef.current = 0;
        }
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
        setIsStreaming(false);
        setStreamPhase("idle");
      }
    })();
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const target = event.currentTarget;
      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;

      if (event.key === "ArrowUp" && selectionStart === 0 && selectionEnd === 0) {
        if (navigateInputHistory("up")) {
          event.preventDefault();
          return;
        }
      }

      if (
        event.key === "ArrowDown" &&
        selectionStart === target.value.length &&
        selectionEnd === target.value.length
      ) {
        if (navigateInputHistory("down")) {
          event.preventDefault();
          return;
        }
      }
    }

    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    send();
  };

  return (
    <div
      className={cn(
        "space-y-8",
        mobileEdgeToEdge
          ? "-mx-4 w-screen max-w-none px-0 md:mx-auto md:w-auto md:max-w-editorial md:px-8"
          : "mx-auto max-w-editorial px-4 md:px-8"
      )}
    >
      <div className={cn(
        exerciseMode ? "hidden md:flex flex-wrap gap-3" : "flex flex-wrap gap-3"
      )}>
        <Pill
          className="gap-2 px-5 py-2.5 text-[0.68rem]"
          size="md"
          tone={runtime.liveEnabled ? "soft" : "neutral"}
        >
          <AppIcon className="h-3.5 w-3.5" name="wave" />
          Runtime: {runtime.runtimeMode}
        </Pill>
        <Pill className="gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="notebook" />
          Logs: {runtime.debugLogsEnabled ? "on" : "off"}
        </Pill>
        <Pill className="gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="layers" />
          Thinking: {thinkingCount > 0 ? `${thinkingCount} ready` : isStreaming ? "live" : "idle"}
        </Pill>
        <Pill className="gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="book" />
          Render: {renderMode}
        </Pill>
        <Pill className="max-w-[320px] gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="settings" />
          <span className="truncate">
            System: {hasSelectedSystemPrompt ? selectedSystemPrompt.label : "none"}
          </span>
        </Pill>
        <Pill className="gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="chart" />
          Prompt: {formatUsage(usage.promptTokens, usage.exact)} tok
        </Pill>
        <Pill className="gap-2 px-5 py-2.5 text-[0.68rem]" size="md" tone="soft">
          <AppIcon className="h-3.5 w-3.5" name="sparkles" />
          Completion: {formatUsage(usage.completionTokens, usage.exact)} tok
        </Pill>
        <Pill
          className="gap-2 px-5 py-2.5 text-[0.68rem]"
          size="md"
          tone={usage.exact ? "primary" : "soft"}
        >
          <AppIcon className="h-3.5 w-3.5" name="target" />
          Total: {formatUsage(usage.totalTokens, usage.exact)} tok
        </Pill>
      </div>

      <section className={cn(
        "grid items-start gap-6",
        lockSystemPrompt ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(300px,0.74fr)_minmax(0,1.26fr)]"
      )}>
        {!lockSystemPrompt ? (
        <Card className="space-y-6 self-start xl:sticky xl:top-8" tone="glass">
          <div className="space-y-3">
            <p className="editorial-kicker">System Prompt</p>
          </div>

          <div className="rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-soft ghost-outline">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="editorial-kicker">Selected Prompt</p>
                <p className="mt-2 text-lg font-extrabold tracking-[-0.03em] text-on-surface">
                  {selectedSystemPrompt.label}
                </p>
              </div>
              {hasSelectedSystemPrompt ? (
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  onClick={toggleSelectedSystemPrompt}
                  type="button"
                >
                  <AppIcon className="h-3.5 w-3.5" name="book" />
                  {showSelectedSystemPrompt ? "Hide prompt" : "Read prompt"}
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              {selectedSystemPrompt.purpose}
            </p>
            <p className="mt-3 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/75">
              {hasSelectedSystemPrompt ? "Applies on your next send" : "No system prompt will be sent"}
            </p>
            {selectedSystemPrompt.promptPath ? (
              <div className="mt-3 rounded-full bg-surface-container-low px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">
                {selectedSystemPrompt.promptPath}
              </div>
            ) : null}
            {hasSelectedSystemPrompt && showSelectedSystemPrompt ? (
              <div className="mt-4 max-h-[280px] overflow-y-auto rounded-[1.2rem] bg-surface-container-low px-4 py-3 ghost-outline soft-scrollbar">
                {renderMode === "preview" ? (
                  <MarkdownPreview content={selectedSystemPrompt.content} />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-on-surface">
                    {selectedSystemPrompt.content}
                  </pre>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="editorial-kicker">Prompt Catalog</p>
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/75">
                {systemPromptOptions.length} options
              </p>
            </div>

            <button
              className={cn(
                "w-full rounded-[1.3rem] px-4 py-4 text-left transition-colors shadow-soft",
                !hasSelectedSystemPrompt
                  ? "bg-surface-container-lowest text-on-surface ghost-outline"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              )}
              onClick={() => applySystemPrompt(systemPromptOptions[0])}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold tracking-[-0.02em]">No system prompt</p>
                  <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                    Send the conversation as-is without an extra instruction layer.
                  </p>
                </div>
                {!hasSelectedSystemPrompt ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-primary">
                    Applied
                  </span>
                ) : null}
              </div>
            </button>

            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1 soft-scrollbar">
              {promptGroups.map((group) => (
                <div
                  className="rounded-[1.35rem] bg-surface-container-lowest p-3 shadow-soft ghost-outline"
                  key={group.category}
                >
                  <button
                    className="flex w-full items-center justify-between gap-3 rounded-[1.05rem] px-2 py-2 text-left transition-colors hover:bg-surface-container-low"
                    onClick={() => togglePromptGroup(group.category)}
                    type="button"
                  >
                    <div>
                      <p className="editorial-kicker">{group.category}</p>
                      <p className="mt-1 text-sm font-semibold text-on-surface">
                        {group.options.length} prompts
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-container-low px-3 py-1.5 text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">
                      {openPromptGroups[group.category] ? "Hide" : "Open"}
                    </span>
                  </button>

                  {openPromptGroups[group.category] ? (
                    <div className="mt-3 space-y-2">
                      {group.options.map((option) => {
                        const selected = selectedSystemPrompt.id === option.id;

                        return (
                          <button
                            className={cn(
                              "w-full rounded-[1.15rem] px-4 py-4 text-left transition-colors",
                              selected
                                ? "bg-primary/8 text-on-surface ghost-outline"
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                            )}
                            key={option.id}
                            onClick={() => applySystemPrompt(option)}
                            type="button"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-extrabold tracking-[-0.02em] text-on-surface">
                                  {option.label}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                                  {option.purpose}
                                </p>
                              </div>
                              {selected ? (
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-primary">
                                  Applied
                                </span>
                              ) : null}
                            </div>
                            {option.promptPath ? (
                              <p className="mt-3 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-on-surface-variant/70">
                                {option.promptPath}
                              </p>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Card>
        ) : null}

        <Card
          className={cn(
            "relative flex flex-col overflow-hidden xl:sticky xl:top-8 xl:h-[calc(100dvh-8rem)]",
            exerciseMode ? "min-h-[calc(100dvh-7rem)] md:min-h-[720px]" : "min-h-[720px]"
          )}
          padding={exerciseMode ? "none" : "default"}
          tone="default"
        >
          <div className={cn(
            "flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-5",
            exerciseMode && "px-[5px] pt-[5px]"
          )}>
            <div>
              <p className="editorial-kicker">{conversationSubtitle}</p>
              <p className="mt-2 text-lg font-extrabold tracking-[-0.03em] text-on-surface">
                {conversationTitle}
              </p>
            </div>
            <button
              className={cn(
                exerciseMode
                  ? "hidden md:inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3.5 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  : "inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3.5 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant transition-colors hover:bg-surface-container-high"
              )}
              onClick={toggleRenderMode}
              type="button"
            >
              <AppIcon className="h-3.5 w-3.5" name={renderMode === "preview" ? "pencil" : "book"} />
              {renderMode === "preview" ? "Show Raw" : "Show Preview"}
            </button>
          </div>

          <div
            className={cn(
              "hidden-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto",
              exerciseMode ? "pt-4 pb-2" : "py-6"
            )}
            onScroll={handleMessageListScroll}
            ref={messageScrollRef}
          >
            {messages.map((message) => {
              const hasThinking = Boolean(message.thinking && message.thinking.trim().length > 0);
              const hasVisibleContent = message.content.trim().length > 0;
              const showThinkingLoader =
                message.role === "assistant" && isStreaming && !hasThinking && !hasVisibleContent;

              return (
                <div
                  className={cn(
                    "space-y-1.5",
                    message.role === "user" && "flex flex-col items-end",
                    message.role === "assistant" && "flex flex-col items-start"
                  )}
                  key={message.id}
                >
                  {showThinkingLoader ? (
                    <div className={cn("px-1 pb-1", exerciseMode ? "max-w-[96%]" : "max-w-[82%]")}>
                      <ThinkingDots />
                    </div>
                  ) : null}

                  {message.role === "assistant" && hasThinking ? (
                    <div className={cn("px-1 pb-1", exerciseMode ? "max-w-[96%]" : "max-w-[82%]")}>
                      <button
                        aria-expanded={Boolean(openThinkingIds[message.id])}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] transition-colors duration-150",
                          openThinkingIds[message.id]
                            ? "bg-surface-container-low text-on-surface"
                            : "text-on-surface-variant/78 hover:bg-surface-container-low hover:text-on-surface"
                        )}
                        onClick={() => toggleThinking(message.id)}
                        type="button"
                      >
                        {openThinkingIds[message.id] ? "Hide thinking" : "Thinking"}
                      </button>

                      {openThinkingIds[message.id] ? (
                        <div className="mt-2 border-l border-outline-variant/24 pl-4 text-[0.86rem] leading-6 text-on-surface-variant/76">
                          {renderMode === "preview" ? (
                            <MarkdownPreview
                              className="text-on-surface-variant/78 [&_strong]:text-on-surface-variant/90"
                              content={message.thinking ?? ""}
                            />
                          ) : (
                            <p className="whitespace-pre-wrap">{message.thinking}</p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {message.role !== "assistant" || hasVisibleContent ? (
                        <div className={cn(
                          "rounded-[1.05rem] shadow-soft",
                          exerciseMode ? "max-w-[96%] px-2.5 py-2" : "max-w-[80%] px-3 py-2",
                          message.role === "assistant" &&
                            "bg-surface-container-lowest text-on-surface ghost-outline",
                          message.role === "user" && "bg-cta-gradient text-on-primary shadow-lift",
                          message.role === "system" &&
                            (exerciseMode
                              ? "max-w-[98%] bg-surface-container-low text-on-surface-variant ghost-outline"
                              : "max-w-[92%] bg-surface-container-low text-on-surface-variant ghost-outline")
                        )}
>
                      {renderMode === "preview" && message.role !== "user" ? (
                        <MarkdownPreview content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "border-t border-outline-variant/20 bg-surface-container-lowest/95 backdrop-blur-sm",
              exerciseMode ? "px-[5px] pb-0 pt-2" : "px-1 pb-1 pt-5"
            )}
          >
            <div
              className={cn(
                "bg-surface-container shadow-soft ghost-outline",
                    exerciseMode ? "relative rounded-[1.45rem] px-[5px] py-2" : "rounded-[1.7rem] px-3.5 py-2.5"
)}
            >
              <textarea
                className={cn(
                  "stealth-scrollbar w-full resize-none bg-transparent text-[0.98rem] text-on-surface placeholder:text-on-surface-variant/55 focus:outline-none",
                  exerciseMode
                    ? "max-h-[220px] min-h-[1lh] py-0 leading-6 pr-12"
                    : "max-h-[220px] min-h-[28px] py-0 leading-7"
                )}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder={composerPlaceholder}
                ref={textareaRef}
                rows={1}
                value={input}
              />

              {exerciseMode ? (
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-end pb-2">
                  <div className="pointer-events-auto flex items-center justify-end">
                    {isStreaming ? (
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface shadow-soft transition-all duration-200 hover:bg-surface-container-highest active:scale-[0.98]"
                        onClick={stopStreaming}
                        type="button"
                      >
                        <AppIcon className="h-3.5 w-3.5" name="stop" />
                      </button>
                    ) : (
                      <button
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                          canSend
                            ? "bg-cta-gradient text-on-primary shadow-lift hover:brightness-[1.04] active:scale-[0.98]"
                            : "bg-surface-container-high text-on-surface-variant/55"
                        )}
                        disabled={!canSend}
                        onClick={send}
                        type="button"
                      >
                        <AppIcon className="h-4 w-4" name="arrow-up" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-1.5 flex items-end justify-between gap-4">
                  <div className="min-h-[1.1rem] text-[0.74rem] font-medium text-on-surface-variant/72">
                    {composerStatus ? <span>{composerStatus}</span> : null}
                  </div>

                  <div className="flex items-center justify-end">
                    {isStreaming ? (
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface shadow-soft transition-all duration-200 hover:bg-surface-container-highest active:scale-[0.98]"
                        onClick={stopStreaming}
                        type="button"
                      >
                        <AppIcon className="h-3.5 w-3.5" name="stop" />
                      </button>
                    ) : (
                      <button
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                          canSend
                            ? "bg-cta-gradient text-on-primary shadow-lift hover:brightness-[1.04] active:scale-[0.98]"
                            : "bg-surface-container-high text-on-surface-variant/55"
                        )}
                        disabled={!canSend}
                        onClick={send}
                        type="button"
                      >
                        <AppIcon className="h-4 w-4" name="arrow-up" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
