# DaF Focus

DaF Focus is the first working web version of an AI-first trainer for the digital TestDaF exam.

The repository now includes:

- a `Next.js` app with `App Router`, `TypeScript`, and `Tailwind CSS`
- a typed TestDaF domain model
- a prompt library for official task types and remediation
- focused AI services for generation, evaluation, feedback, planning, and grammar support
- a provider layer that can run in demo fallback mode or against MiniMax-M2.5 through the OpenAI SDK

The current product is built for guided practice first, with shared infrastructure for grammar drills, mistake review, and mock exams.

## What Ships Today

- `/` dashboard home with section progress, weak skills, study plan, and recent activity
- `/lesen`, `/hoeren`, `/schreiben`, `/sprechen` section hubs
- `/grammar-library` for targeted grammar practice
- `/mistake-notebook` for recurring-error review
- `/mock-test` and `/mock-test/results/[sessionId]`
- `/workspace/[variant]/[slug]` as the shared LLM workspace

Workspace variants:

- `exercise`: official TestDaF-style practice with inline feedback
- `grammar`: short explanation, drill, correction, and transfer
- `mistake`: reflection and correction based on notebook entries
- `mock`: stricter exam chrome with deferred feedback

Current product limits in v1:

- no database or auth
- no persistent user sessions
- no real audio pipeline yet
- `Hoeren` and `Sprechen` are intentionally text-first for now

## Stack

- `Next.js` 15
- `React` 19
- `TypeScript`
- `Tailwind CSS`
- `zod`
- official `openai` Node SDK with configurable `baseURL`

## Quick Start

Node `20+` is recommended.

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

By default the app runs in demo mode and stays fully usable without API keys.

## Environment Variables

Copy [`.env.example`](./.env.example) to `.env.local`.

- `OPENAI_API_KEY`: API key for a compatible endpoint such as MiniMax
- `OPENAI_BASE_URL`: defaults to `https://api.minimax.io/v1`
- `OPENAI_MODEL`: defaults to `MiniMax-M2.5`
- `APP_ENABLE_REAL_LLM`: set to `true` to enable the live provider
- `APP_ENABLE_DEBUG_LOGS`: set to `true` to print provider/workspace traces and show a debug card in workspace pages
- `APP_DEMO_USER_ID`: demo learner id used for local data seeding

Example live setup:

```env
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://api.minimax.io/v1
OPENAI_MODEL=MiniMax-M2.5
APP_ENABLE_REAL_LLM=true
APP_ENABLE_DEBUG_LOGS=true
APP_DEMO_USER_ID=demo-lerner
```

If `APP_ENABLE_REAL_LLM` is `false`, or the key is missing, the app falls back to structured local defaults. That lets the UI, view models, and workflows keep working while provider wiring is incomplete.

## Scripts

- `npm run dev`: start the Next.js dev server
- `npm run build:web`: build the web app
- `npm run build:core`: compile the TypeScript core from `src/` into `dist/`
- `npm run build`: build core and web
- `npm run typecheck`: type-check both the library and the Next app
- `npm run test`: build the core and run the automated tests
- `npm run verify`: run type-checking and tests

Recommended local verification:

```bash
npm run verify
npm run build:web
```

## How It Works

The app is split into clear layers:

1. `app/` defines the routes and server actions.
2. `components/` renders the shared shell and the screen-level UI.
3. `lib/server/page-data.ts` prepares route-specific data for pages.
4. `lib/server/app-service.ts` creates the web-facing application service.
5. `src/api/actions.ts` exposes the core product operations.
6. `src/agents/`, `src/domain/`, `src/providers/`, and `prompts/` do the heavy AI and product logic.

Typical guided-practice flow:

1. A route loads data through `lib/server/page-data.ts`.
2. `getWebApplicationService()` creates a cached service from `src/api/actions.ts`.
3. `lib/server/provider-router.ts` decides between live MiniMax and fallback mode.
4. The core service generates an exercise, evaluates an attempt, or builds a study plan.
5. `lib/mappers/` turns domain objects into view models tailored for the UI.
6. `app/workspace/actions.ts` handles workspace submission and returns a structured result for the client.

The important design choice is that AI modules act like focused functions, not free-form bots. That keeps outputs structured and makes the product easier to test and evolve.

## Repository Structure

```text
.
├── app/                # Next.js routes, layouts, and server actions
├── components/         # UI components grouped by shell and feature
├── design/             # Design references and exported HTML screens
├── docs/               # Project documentation
├── lib/
│   ├── mappers/        # Domain -> view-model adapters
│   ├── mock-data/      # Demo learner data for local mode
│   └── server/         # Env, provider wiring, app service, page data
├── prompts/            # Prompt packs used by the AI core
├── src/
│   ├── agents/         # Focused AI functions
│   ├── api/            # Application service entry point
│   ├── domain/         # Typed TestDaF and learner model
│   ├── prompts/        # Prompt metadata catalog
│   └── providers/      # Provider abstractions and adapters
├── tests/              # Automated tests
└── dist/               # Built JS for the core library
```

## How To Read The Codebase

If you want the shortest route to understanding:

1. [`app/page.tsx`](./app/page.tsx)
2. [`lib/server/page-data.ts`](./lib/server/page-data.ts)
3. [`app/workspace/actions.ts`](./app/workspace/actions.ts)
4. [`src/api/actions.ts`](./src/api/actions.ts)
5. [`src/domain/types.ts`](./src/domain/types.ts)
6. [`src/domain/testdaf.ts`](./src/domain/testdaf.ts)
7. [`src/agents/`](./src/agents)
8. [`lib/mappers/`](./lib/mappers)

That order shows the product from screen entry points down to the AI core.

## Key Directories

### `app/`

The real web app lives here. Every product page is implemented as an App Router route, and the workspace submission path is handled by [`app/workspace/actions.ts`](./app/workspace/actions.ts).

### `components/`

Reusable UI building blocks, app shell, and feature screens. The shared navigation lives under `components/shell/`.

### `lib/server/`

The web-facing integration layer:

- [`lib/server/env.ts`](./lib/server/env.ts): env parsing and runtime mode detection
- [`lib/server/provider-router.ts`](./lib/server/provider-router.ts): live vs fallback provider selection
- [`lib/server/openai-compatible-provider.ts`](./lib/server/openai-compatible-provider.ts): OpenAI SDK adapter for MiniMax-compatible endpoints
- [`lib/server/app-service.ts`](./lib/server/app-service.ts): cached application service
- [`lib/server/page-data.ts`](./lib/server/page-data.ts): route-level data assembly

### `lib/mappers/`

View-model mappers that keep UI contracts separate from the domain layer.

### `src/`

The core product logic:

- `domain/` defines exercises, attempts, evaluations, skills, and study plans
- `agents/` implements generation, evaluation, feedback, grammar training, mock planning, and study planning
- `providers/` defines provider contracts and low-level adapters
- `api/actions.ts` exposes the application service used by the web layer

## Testing

The project has both core structural tests and new web-oriented support tests.

Current coverage includes:

- exercise catalog and architecture integrity
- env parsing and runtime mode selection
- provider router live/fallback behavior
- view-model mapping
- workspace variant resolution

Run:

```bash
npm run test
npm run build:web
```

## Documentation

Start with:

- [`docs/getting-started.md`](./docs/getting-started.md)
- [`docs/codebase-tour.md`](./docs/codebase-tour.md)
- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/testing.md`](./docs/testing.md)

The original website build brief is still kept in [`docs/website-agent-handoff.md`](./docs/website-agent-handoff.md) as historical context.
