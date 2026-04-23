# Chat Exercise Views Implementation Plan

> **For Hermes:** extend the existing `LlmTestChat` + prompt catalog stack rather than building a second chat system.

**Goal:** Add five dedicated chat-backed training exercise views, each with its own fixed system prompt, route, and learner-facing framing.

**Architecture:** Reuse `LlmTestChat` as the shared runtime/UI, add a `chat-exercises` catalog for route metadata, add five prompt files under `prompts/training/chat/`, and expose a landing page plus dynamic detail routes. Keep the prompts fixed per exercise by adding default/lock behavior to the chat component.

**Routes planned:**
- `/chat-exercises`
- `/chat-exercises/grammar-repair-studio`
- `/chat-exercises/argument-builder`
- `/chat-exercises/source-synthesis-coach`
- `/chat-exercises/speaking-outline-coach`
- `/chat-exercises/register-rewrite-lab`

**Prompt focus:**
1. Grammar repair studio
2. Argument builder
3. Source synthesis coach
4. Speaking outline coach
5. Register rewrite lab

**Files to add/modify:**
- Add `lib/chat-exercises/catalog.ts`
- Add `app/chat-exercises/page.tsx`
- Add `app/chat-exercises/[slug]/page.tsx`
- Add five prompt files under `prompts/training/chat/`
- Modify `components/llm-test/llm-test-chat.tsx`
- Modify `lib/server/llm-test-prompts.ts` category labels/order
- Update prompt architecture tests
- Add chat exercise route/catalog test coverage

**Verification:**
- `npm run verify`
- confirm routes exist in code
- confirm prompt count and catalog tests pass
