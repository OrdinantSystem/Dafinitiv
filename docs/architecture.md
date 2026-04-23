# Architecture

This document explains how the current DaF Focus app is put together.

## Main Architectural Choice

DaF Focus is a web app built on top of a structured AI core.

Two rules shape the architecture:

- the UI should consume stable view models, not raw domain internals
- AI modules should behave like focused functions, not autonomous chatbots

That combination keeps the product understandable and gives the web layer a reliable contract.

## High-Level Flow

```text
Browser
  -> Next.js route in app/
  -> route data assembly in lib/server/page-data.ts
  -> web application service in lib/server/app-service.ts
  -> core service in src/api/actions.ts
  -> agents + prompts + providers + domain
  -> view-model mappers in lib/mappers/
  -> React components
```

For workspace submissions there is one extra step:

```text
workspace client
  -> app/workspace/actions.ts
  -> evaluateAttempt / buildFeedback
  -> structured submission result
  -> UI feedback state
```

## System Layers

### Layer 1: App Router

`app/` contains the actual product routes:

- dashboard home
- section hubs
- Grammar Library
- Mistake Notebook
- Mock Test
- shared workspace routes

Pages are server-first and only use client components where interaction genuinely needs it.

### Layer 2: UI Components

`components/` contains:

- app shell components such as sidebar, top bar, and mobile nav
- reusable UI primitives
- screen-level components for dashboard, sections, grammar, notebook, mock, and workspace

### Layer 3: Web Integration Layer

`lib/server/` adapts the web app to the core service:

- `env.ts` parses env vars and exposes runtime status
- `provider-router.ts` decides between live and fallback provider mode
- `openai-compatible-provider.ts` uses the official OpenAI SDK with a configurable `baseURL`
- `app-service.ts` creates a cached application service
- `page-data.ts` prepares page-specific inputs and outputs

### Layer 4: View-Model Layer

`lib/mappers/` translates domain objects into UI-shaped data.

This layer matters because:

- the UI should not depend on domain internals
- each screen needs a specific shape, not the full backend object graph
- workspace variants need different chrome and interaction rules

### Layer 5: Application Service

[`src/api/actions.ts`](../src/api/actions.ts) is the main entry point into the core product behavior.

It exposes operations such as:

- `buildLearnerState`
- `createSession`
- `generateExercise`
- `evaluateAttempt`
- `buildFeedback`
- `generateStudyPlan`
- `buildGrammarTrainingBrief`
- `buildMockExamPlan`

### Layer 6: Core Product Logic

The product core lives in `src/` and `prompts/`:

- `src/domain/`: typed business language
- `src/agents/`: focused AI functions
- `src/providers/`: provider contracts and low-level adapters
- `prompts/`: prompt packs and shared prompt building blocks

## Runtime Modes

The app intentionally supports two provider modes.

### Demo Fallback Mode

Used when:

- `APP_ENABLE_REAL_LLM=false`
- API keys are missing
- provider output cannot be parsed cleanly

Behavior:

- the app still loads
- exercises and evaluation use structured fallback data
- this is the safest default for local development

### Live MiniMax Mode

Used when:

- `APP_ENABLE_REAL_LLM=true`
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` are present

Behavior:

- requests go through the OpenAI SDK
- `baseURL` points to a MiniMax-compatible endpoint
- structured responses are parsed as JSON and still fall back safely on error

## Product Modes

The current architecture supports four workspace variants and two session modes.

### Session Modes

- `guided`: direct feedback and adaptive support
- `mock`: stricter sequencing with delayed feedback

### Workspace Variants

- `exercise`: official task practice
- `grammar`: explanation plus drill
- `mistake`: review and correction flow
- `mock`: exam-style UI treatment

These variants share a single route pattern but map to different view-model decisions.

## Boundaries To Protect

If you change the codebase, try to preserve these rules:

- exam metadata belongs in `src/domain/`
- prompt text belongs in `prompts/`
- focused AI behavior belongs in `src/agents/`
- vendor-specific logic belongs in `src/providers/` or `lib/server/openai-compatible-provider.ts`
- route-specific shaping belongs in `lib/server/page-data.ts`
- UI contracts belong in `lib/mappers/`
- client components should not instantiate provider logic directly

Keeping these boundaries clean makes it much easier to add persistence, auth, audio, or richer agents later.
