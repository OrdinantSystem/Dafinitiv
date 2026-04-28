# Server Data Flow

This document explains how data moves through the app at runtime.

Use it when you need to understand:
- where page data comes from
- how the web app talks to the core product logic
- how workspace actions differ from streaming chat
- where fallback mode and live MiniMax mode are decided

---

## High-Level Runtime Model

The app has two main execution paths:

1. **structured page + workspace flow** for dashboard, hubs, grammar, notebook, mock, and shared workspaces
2. **streaming chat flow** for `/llm-test` and `/chat-exercises/[slug]`

Those two paths share environment/runtime configuration, but they do not use the same request pattern.

---

## Path 1: Structured Page Flow

### Summary

```text
Route in app/
  -> lib/server/page-data.ts
  -> lib/server/app-service.ts
  -> src/api/actions.ts
  -> src/agents + src/domain + src/providers
  -> lib/mappers/*.ts
  -> screen component in components/
```

### Step 1: Route entry
Most route files are thin.

Examples:
- `app/page.tsx`
- `app/lesen/page.tsx`
- `app/grammar-library/page.tsx`
- `app/mistake-notebook/page.tsx`
- `app/mock-test/page.tsx`
- `app/workspace/[variant]/[slug]/page.tsx`

These files usually do one thing:
- call a helper in `lib/server/page-data.ts`
- render a screen component with the resulting view model

### Step 2: Page data assembly
`lib/server/page-data.ts` is the main route-data seam.

Responsibilities:
- choose the correct view-model builder
- construct demo learner state where needed
- resolve workspace launch context
- generate adaptive exercise targets
- build debug/runtime metadata for the UI

This file is one of the most important integration points in the repository.

### Step 3: Cached application service
`lib/server/app-service.ts` creates the web-facing application service.

Responsibilities:
- read server env
- compute runtime status
- build and cache the core service instance
- expose `service`, `env`, and `runtime` together

This is the bridge between Next.js pages and the AI/core product layer.

### Step 4: Core application service
`src/api/actions.ts` defines the stable application-service operations.

Main operations include:
- `createSession`
- `buildLearnerState`
- `generateExercise`
- `evaluateAttempt`
- `recomputeSkills`
- `generateStudyPlan`
- `buildFeedback`
- `buildGrammarTrainingBrief`
- `buildMockExamPlan`

This layer should stay stable and boring. It is the clean contract the web layer depends on.

### Step 5: Agents, domain, and providers
The core service delegates into:

#### `src/domain/`
Defines:
- exercise IDs
- TestDaF catalog metadata
- skill taxonomy
- evaluation helpers
- shared product types

#### `src/agents/`
Implements focused behaviors:
- session planning
- exercise generation
- evaluation
- feedback coaching
- skill updates
- grammar brief generation
- study planning
- mock planning

#### `src/providers/`
Defines low-level provider contracts and adapters used by the core service.

### Step 6: View-model shaping
`lib/mappers/` translates internal domain objects into UI-facing contracts.

Important mapper files:
- `dashboard-to-view-model.ts`
- `section-to-view-model.ts`
- `grammar-library-to-view-model.ts`
- `mistake-notebook-to-view-model.ts`
- `mock-results-to-view-model.ts`
- `workspace-to-view-model.ts`
- `types.ts`

This layer keeps raw domain objects out of screen components.

### Step 7: Screen render
The route passes the final view model into a screen component such as:
- `components/dashboard/dashboard-overview.tsx`
- `components/sections/section-hub.tsx`
- `components/grammar/grammar-library-screen.tsx`
- `components/notebook/mistake-notebook-screen.tsx`
- `components/mock/mock-test-setup.tsx`
- `components/mock/mock-results-screen.tsx`
- `components/workspace/workspace-screen.tsx`

---

## Path 2: Workspace Interaction Flow

The workspace route has an extra interaction layer after the first render.

### Summary

```text
/workspace/[variant]/[slug]
  -> page-data builds initial workspace view model
  -> WorkspaceScreen renders shell
  -> WorkspaceClient manages ready-state and local input state
  -> app/workspace/actions.ts handles generation/submission
  -> service.evaluateAttempt / service.buildFeedback
  -> submission result returns to client UI
```

### Files involved
- `app/workspace/[variant]/[slug]/page.tsx`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `app/workspace/actions.ts`
- `lib/server/page-data.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `lib/workspace-context.ts`

### Important behavior split

#### Initial render
- server-driven
- uses `getWorkspaceViewModel()` from `lib/server/page-data.ts`
- decides variant-specific chrome and available materials

#### Ready / generation step
For exercise and mock variants, generation is manual rather than immediate.

Handled by:
- `generateWorkspaceReadyState()` in `app/workspace/actions.ts`

#### Submission step
Handled by:
- `submitWorkspaceResponse()` in `app/workspace/actions.ts`

Possible post-submit modes:
- evaluated
- deferred
- reflection

That distinction is important because grammar and mistake workspaces do not currently behave like fully evaluated official exercise flows.

---

## Path 3: Streaming Chat Flow

The chat system uses a different backend model.

### Summary

```text
/llm-test or /chat-exercises/[slug]
  -> LlmTestChat client component
  -> POST /api/llm-test/stream
  -> runtime/env resolution
  -> prompt option lookup
  -> OpenAI SDK streaming request
  -> NDJSON events returned to client
```

### Main files
- `app/llm-test/page.tsx`
- `app/chat-exercises/[slug]/page.tsx`
- `components/llm-test/llm-test-chat.tsx`
- `app/api/llm-test/stream/route.ts`
- `lib/server/llm-test-prompts.ts`
- `lib/llm-test/types.ts`
- `lib/chat-exercises/catalog.ts`

### What makes this path different
- it is streaming, not request/response form submission
- it uses an API route instead of `app/workspace/actions.ts`
- it sends NDJSON event chunks back to the client
- it is designed for live prompt-driven conversations rather than structured exercise scoring only

### Route-specific behavior

#### `/llm-test`
- allows free prompt selection
- useful for direct LLM/runtime testing

#### `/chat-exercises/[slug]`
- locks the system prompt to a specific trainer mode
- uses starter prompts and exercise metadata from `lib/chat-exercises/catalog.ts`

---

## Runtime and Provider Mode Resolution

### Main files
- `lib/server/env.ts`
- `lib/server/provider-router.ts`
- `lib/server/openai-compatible-provider.ts`
- `src/providers/provider-router.ts`
- `src/providers/minimax.ts`
- `src/providers/json-http.ts`
- `src/providers/types.ts`

### Decision point
The web layer reads env and computes runtime status before building the service.

Key env values:
- `APP_ENABLE_REAL_LLM`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
- `APP_ENABLE_DEBUG_LOGS`
- `APP_DEMO_USER_ID`

### Runtime modes

#### Fallback mode
Used when live mode is disabled or incomplete.

Effects:
- pages still render
- demo learner state remains usable
- core generation/evaluation can use local fallback behavior
- safest default for local development

#### Live mode
Used when full provider config is present and enabled.

Effects:
- provider requests flow through the OpenAI SDK with a custom `baseURL`
- structured generation/evaluation can hit MiniMax-compatible endpoints
- streaming chat uses the live configured provider path

---

## Debug and Diagnostics Flow

Relevant files:
- `lib/server/debug-log.ts`
- `lib/server/page-data.ts`
- `app/workspace/actions.ts`
- `components/workspace/workspace-screen.tsx`
- `components/llm-test/llm-test-chat.tsx`

When debug logs are enabled:
- workspace actions emit server-side debug log events
- workspace screens can show runtime/debug state in the UI
- chat runtime metadata is surfaced in the client experience

This helps contributors verify whether the app is using live LLM mode or fallback mode.

---

## Contract Files To Protect

These files are the most important data-flow seams:

### `lib/server/page-data.ts`
Treat as the route data orchestrator.

### `lib/server/app-service.ts`
Treat as the web/core bridge.

### `src/api/actions.ts`
Treat as the stable application-service API.

### `app/workspace/actions.ts`
Treat as the structured workspace interaction backend.

### `app/api/llm-test/stream/route.ts`
Treat as the streaming chat backend.

### `lib/mappers/types.ts`
Treat as the UI contract layer for many screen components.

### `lib/workspace-context.ts`
Treat as the deep-link and workspace launch contract.

---

## Editing Guidance

### If a page shows the wrong data
Check, in order:
1. the route file in `app/`
2. `lib/server/page-data.ts`
3. the relevant mapper in `lib/mappers/`
4. the screen component in `components/`

### If a workspace interaction is wrong
Check, in order:
1. `components/workspace/workspace-client.tsx`
2. `app/workspace/actions.ts`
3. `lib/mappers/workspace-to-view-model.ts`
4. `lib/server/page-data.ts`

### If streamed chat is wrong
Check, in order:
1. `components/llm-test/llm-test-chat.tsx`
2. `app/api/llm-test/stream/route.ts`
3. `lib/server/llm-test-prompts.ts`
4. env/runtime configuration in `lib/server/env.ts`

---

## One-Sentence Mental Model

The app is a **server-first Next.js product that shapes route data through `lib/server/page-data.ts`, executes core product logic through `src/api/actions.ts`, and then branches into either structured workspace actions or streaming chat depending on the route.**
