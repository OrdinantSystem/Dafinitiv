# Getting Started

This document is the fastest way to get productive in the repository.

## What Exists Today

The project already includes:

- a real `Next.js` web app
- a typed TestDaF domain model
- a prompt library for official and remediation tasks
- focused AI modules for generation, evaluation, feedback, grammar, study planning, and mock planning
- a provider abstraction plus a web runtime adapter for MiniMax through the OpenAI SDK
- demo data and structured fallbacks so the app works without API keys

The project does not yet include:

- a database
- authentication
- persistent learner history
- real audio capture, playback, or transcription pipelines

That means this is a working v1 web app with intentionally lightweight infrastructure.

## First Local Run

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

By default the app uses demo mode:

- `APP_ENABLE_REAL_LLM=false`
- no API key required
- exercise generation and evaluation degrade to structured local fallbacks

## Enabling The Live LLM

To switch from demo mode to MiniMax:

```env
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://api.minimax.io/v1
OPENAI_MODEL=MiniMax-M2.5
APP_ENABLE_REAL_LLM=true
APP_DEMO_USER_ID=demo-lerner
```

Important behavior:

- if live mode is disabled, the app stays usable
- if live mode is enabled but the provider fails, the adapter still returns structured fallback data
- the current workspace is request/response only; there is no streaming yet

## Commands You Will Actually Use

- `npm run dev`: local development server
- `npm run typecheck`: type-check app and core
- `npm run test`: compile the core and run tests
- `npm run verify`: type-check plus tests
- `npm run build:web`: Next.js production build smoke test
- `npm run build:core`: compile `src/` into `dist/`
- `npm run build`: build core and web together

## Suggested Reading Path

If you want to understand the app from the top down, use this order:

1. [`app/page.tsx`](../app/page.tsx)
2. [`lib/server/page-data.ts`](../lib/server/page-data.ts)
3. [`components/dashboard/dashboard-overview.tsx`](../components/dashboard/dashboard-overview.tsx)
4. [`app/workspace/actions.ts`](../app/workspace/actions.ts)
5. [`lib/server/app-service.ts`](../lib/server/app-service.ts)
6. [`src/api/actions.ts`](../src/api/actions.ts)
7. [`src/domain/types.ts`](../src/domain/types.ts)
8. [`src/domain/testdaf.ts`](../src/domain/testdaf.ts)
9. [`src/agents/`](../src/agents)
10. [`prompts/`](../prompts)

That path shows you:

- where pages enter the system
- how data is prepared for the UI
- where workspace submissions go
- how the core service generates and evaluates content

## A Good Mental Model

Think of the project in six layers:

1. `app/`: routes and server actions
2. `components/`: UI and feature screens
3. `lib/server/`: env parsing, provider selection, route data assembly
4. `lib/mappers/`: domain-to-view-model transformation
5. `src/api/actions.ts`: application service
6. `src/domain/`, `src/agents/`, `src/providers/`, and `prompts/`: the AI product core

If you keep those layers in mind, the codebase is much easier to navigate.

## Good First Tasks

Strong first contributions:

- improve or extend the view-model layer
- add tests around provider fallbacks or route data shaping
- refine section screens and workspace interactions
- add new prompt packs or improve prompt metadata
- prepare persistence seams without changing core domain contracts

Less ideal first contributions:

- mixing provider-specific logic into UI components
- bypassing `lib/mappers/` and pushing raw domain objects into the client
- merging focused AI responsibilities into one giant prompt
- introducing global client state before a real need appears
