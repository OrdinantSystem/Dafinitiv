# Codebase Tour

This document walks through the repository folder by folder.

## Root Files

### `package.json`

Defines the main scripts:

- `dev`
- `build:web`
- `build:core`
- `build`
- `typecheck`
- `test`
- `verify`

### `tsconfig.base.json`

Shared TypeScript defaults used by the app and the core library build.

### `tsconfig.json`

TypeScript config for the Next.js app.

### `tsconfig.lib.json`

TypeScript config for compiling `src/` into `dist/`.

### `next.config.js`, `postcss.config.js`, `tailwind.config.js`

The web app framework and styling configuration.

### `.env.example`

Template for local configuration, including MiniMax-compatible provider settings.

### `README.md`

The main project entry point for developers.

## `app/`

This is the actual Next.js application.

Important routes:

- `app/page.tsx`: dashboard home
- `app/lesen/page.tsx`
- `app/hoeren/page.tsx`
- `app/schreiben/page.tsx`
- `app/sprechen/page.tsx`
- `app/grammar-library/page.tsx`
- `app/mistake-notebook/page.tsx`
- `app/mock-test/page.tsx`
- `app/mock-test/results/[sessionId]/page.tsx`
- `app/workspace/[variant]/[slug]/page.tsx`

Important support files:

- `app/layout.tsx`: global shell entry point
- `app/globals.css`: theme tokens and global styles
- `app/workspace/actions.ts`: workspace submission server action

## `components/`

Reusable React components grouped by responsibility.

### `components/shell/`

Shared navigation and framing:

- sidebar
- top bar
- mobile navigation
- app shell wrapper

### `components/ui/`

Low-level building blocks such as buttons, cards, pills, metric cards, and progress bars.

### Feature folders

Screen-level components for:

- dashboard
- sections
- grammar
- notebook
- mock
- workspace

This separation keeps routes thin and makes screen logic easier to test and evolve.

## `lib/`

This folder contains app-specific support code that sits between the UI and the core service.

### `lib/server/`

The server integration layer for the web app.

Key files:

- `env.ts`: reads and validates env vars
- `provider-router.ts`: chooses live or fallback provider mode
- `openai-compatible-provider.ts`: OpenAI SDK adapter with custom `baseURL`
- `app-service.ts`: creates the cached application service instance
- `page-data.ts`: gathers and shapes data for server routes

### `lib/mappers/`

Transforms domain objects into screen-specific view models:

- dashboard
- section hubs
- workspace
- grammar library
- mistake notebook
- mock results

### `lib/mock-data/`

Demo learner state, activity, and notebook entries used when no persistence layer exists yet.

### `lib/utils.ts`

Shared small helpers used by the web app.

## `src/`

This is the core product logic.

### `src/domain/`

The typed business model of the application.

Important files:

- `types.ts`
- `exercise-ids.ts`
- `testdaf.ts`
- `skills.ts`
- `skill-taxonomy.ts`
- `evaluation.ts`

If you want to understand what the product knows, start here.

### `src/prompts/`

TypeScript metadata about prompt packs.

Main file:

- `catalog.ts`

### `src/agents/`

Focused AI functions such as:

- session orchestration
- exercise generation
- exercise evaluation
- feedback coaching
- skill profiling
- grammar training
- study planning
- mock exam planning

### `src/providers/`

Core provider abstractions and low-level adapters.

This layer defines provider contracts independently from the web app.

### `src/api/`

Application service entry point.

Main file:

- `actions.ts`

This is the cleanest place to look if you want to understand what operations the web layer can call.

### `src/index.ts`

Re-exports the public surface of the core library build.

## `prompts/`

The prompt text library used by the AI core.

### `prompts/shared/`

Reusable rules and policies:

- tutor voice
- evaluator instructions
- JSON output rules
- feedback style
- originality guardrails

### `prompts/testdaf/`

Official-task prompt packs grouped by section:

- `lesen/`
- `hoeren/`
- `schreiben/`
- `sprechen/`

### `prompts/training/`

Prompt packs for remediation and transfer work.

## `design/`

Design references and exported HTML files that informed the current UI implementation.

## `tests/`

Automated tests for:

- architecture and metadata integrity
- env parsing
- provider selection
- view-model mapping
- workspace variant behavior

## `docs/`

Human-facing documentation for the product and codebase.

## `dist/`

Compiled JavaScript output for the core library build.

Edit `src/`, not `dist/`.
