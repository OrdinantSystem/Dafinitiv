# Website Agent Handoff

This document is the original handoff that was used to build the first web app for DaF Focus.

The web app now exists in the repository, so treat this file as historical context and product rationale, not as the current implementation status report.

## Current Status

The implementation described in this handoff now lives across:

- `app/` for routes and layouts
- `components/` for the UI
- `lib/server/` for env handling, provider wiring, and page data
- `lib/mappers/` for screen-specific view models

The most useful current entry points are:

- [`app/page.tsx`](../app/page.tsx)
- [`lib/server/page-data.ts`](../lib/server/page-data.ts)
- [`app/workspace/actions.ts`](../app/workspace/actions.ts)
- [`src/api/actions.ts`](../src/api/actions.ts)

## How To Use This File Now

Use the rest of this document for:

- product intent
- route planning rationale
- visual and IA context from the initial build brief

Do not use the rest of this file as a source of truth for what already exists in the repo today.

## Original Mission

Build the first real web application for DaF Focus on top of the existing TypeScript scaffold.

The app should:

- use the current domain model, prompt catalog, and application service as its backend brain
- translate the HTML design files in `design/` into reusable Next.js UI
- prioritize the actual product screens over a marketing site
- keep the AI logic structured and server-side
- be ready for guided practice first, with a path to mock exam mode

## What Already Existed

This repository already includes the backend-oriented foundation of the product:

- the TestDaF domain model in [`src/domain/types.ts`](../src/domain/types.ts)
- the official digital TestDaF exercise catalog in [`src/domain/testdaf.ts`](../src/domain/testdaf.ts)
- the learner skill graph logic in [`src/domain/skills.ts`](../src/domain/skills.ts)
- the prompt pack catalog in [`src/prompts/catalog.ts`](../src/prompts/catalog.ts)
- focused AI function modules in [`src/agents/`](../src/agents)
- an app-facing service layer in [`src/api/actions.ts`](../src/api/actions.ts)

This means the web agent should not invent a new core architecture from scratch.

## Original Gaps At Handoff Time

The repository does not yet have:

- a Next.js application
- a real database
- auth
- persistent sessions
- upload pipelines
- audio capture and playback infrastructure
- real production provider wiring

So the first website version should focus on:

- a strong app shell
- real product pages
- typed integration seams
- mock data where necessary
- progressive integration with the existing AI service layer

## Recommended Stack

This is the recommended stack for the website build.

### Core app stack

- `Next.js` with App Router
- `React` with Server Components by default
- `TypeScript` across the full stack

Why:

- the repo is already TypeScript-first
- the docs already assume a future Next.js app
- App Router is a good fit for server actions, route handlers, and mixed server/client rendering

### Styling and UI

- `Tailwind CSS`
- `app/globals.css` for tokens, typography, and high-level theme rules
- optional `shadcn/ui` or `Radix UI` primitives only where they genuinely help

Why:

- Stitch exports and HTML designs are easier to translate into Tailwind than into a heavy custom CSS architecture
- Tailwind keeps implementation fast while still allowing a custom visual language
- the project should avoid looking like a generic component-library dashboard, so primitives should be used sparingly

### Validation and contracts

- `zod` for runtime validation at the edges

Why:

- the product relies on structured AI outputs
- the future UI should trust validated objects, not raw AI text

### Data and persistence

- `PostgreSQL` for production
- `Drizzle ORM` for the relational layer
- optional SQLite for local prototyping if needed

Why:

- the product has clear relational entities such as users, sessions, attempts, evaluations, skill nodes, and study plan recommendations
- Drizzle fits well with a TypeScript-first codebase and shared types

### State strategy

- server components by default
- local client state for rich interactive screens such as the practice workspace
- avoid adding a global client state library unless it becomes clearly necessary

Why:

- most product data is page-shaped and server-friendly
- only a few views truly need live client interaction: timers, drafting, chat timeline, audio controls, optimistic submission states

## Architectural Rule To Preserve

Do not collapse the current architecture into a frontend-only app.

Protect these boundaries:

- `src/domain/` remains the business model
- `prompts/` remains the prompt library
- `src/agents/` remains focused AI behavior modules
- `src/providers/` remains provider-specific integration
- `src/api/actions.ts` remains the main app-facing service boundary

The UI should call into this system, not replace it.

## How To Use The `design/` Folder

The `design/` folder is expected to contain HTML design files exported from Stitch or another design workflow.

Treat those files as:

- the visual source of truth
- a layout and component reference
- a design-token extraction source

Do not treat them as:

- final production pages to copy blindly
- a substitute for reusable React components
- permission to hard-code everything screen by screen

The correct workflow is:

1. read all HTML files in `design/`
2. identify shared visual patterns
3. extract tokens such as colors, spacing, border radius, typography scale, panel styles, and layout rhythms
4. build reusable components that match those patterns
5. recreate each screen in Next.js using the shared components

When translating the design files:

- keep the visual direction faithful
- improve semantics and accessibility where needed
- keep the resulting code implementation-friendly
- prefer reusable patterns over one-off HTML dumps

## Recommended App Structure

The website can live directly in this repository.

Recommended structure:

```text
.
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── onboarding/
│   ├── sections/
│   │   ├── lesen/
│   │   ├── hoeren/
│   │   ├── schreiben/
│   │   └── sprechen/
│   ├── practice/
│   │   └── [exerciseId]/
│   ├── mock/
│   │   ├── setup/
│   │   └── [sessionId]/
│   ├── feedback/
│   │   └── [attemptId]/
│   ├── progress/
│   ├── study-plan/
│   ├── history/
│   ├── mistakes/
│   └── settings/
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── sections/
│   ├── practice/
│   ├── feedback/
│   ├── progress/
│   ├── study-plan/
│   ├── history/
│   ├── mistakes/
│   └── ui/
├── lib/
│   ├── server/
│   ├── mappers/
│   ├── mock-data/
│   └── validations/
├── design/
├── docs/
├── prompts/
├── src/
└── tests/
```

This lets the current `src/` remain the product core while the new web app sits beside it.

## Recommended Route Map

These are the important app routes to build.

### Core routes

- `/` dashboard
- `/onboarding`
- `/sections/lesen`
- `/sections/hoeren`
- `/sections/schreiben`
- `/sections/sprechen`
- `/practice/[exerciseId]`
- `/feedback/[attemptId]`
- `/progress`
- `/study-plan`

### Mock routes

- `/mock/setup`
- `/mock/[sessionId]`
- `/mock/results/[sessionId]`

### Secondary routes

- `/history`
- `/mistakes`
- `/settings`

## Screen Priority

Implement the screens in this order unless the `design/` folder strongly suggests another dependency order:

1. shared app shell and navigation
2. dashboard
3. the four section pages
4. practice workspace
5. detailed feedback page
6. progress page
7. study plan page
8. mock setup
9. mock results
10. onboarding
11. session history
12. mistake notebook
13. settings

## Most Important Product Screen

The most important screen in the app is the practice workspace.

This screen is not a normal chatbot.

It should combine:

- a structured exercise panel
- source materials
- response controls
- a chat-style timeline for instructions and feedback
- a clean post-submit analysis state

For the first version, the practice workspace can be text-first while still leaving placeholders for future audio and speaking features.

## Mapping The Existing Backend To The UI

The current backend scaffold already tells the agent what data each screen should use.

### Dashboard

Use:

- `LearnerState`
- section progress derived from the skill graph
- recent evaluations
- study plan recommendations

Relevant code:

- [`src/domain/types.ts`](../src/domain/types.ts)
- [`src/domain/skills.ts`](../src/domain/skills.ts)
- [`src/api/actions.ts`](../src/api/actions.ts)

### Section pages

Use:

- `ExerciseSpec[]` filtered by section

Relevant code:

- [`src/domain/testdaf.ts`](../src/domain/testdaf.ts)

### Practice workspace

Use:

- `createSession`
- `generateExercise`
- `submitAttempt`
- `evaluateAttempt`
- `buildFeedback`

Relevant code:

- [`src/api/actions.ts`](../src/api/actions.ts)
- [`src/domain/types.ts`](../src/domain/types.ts)

### Feedback page

Use:

- `EvaluationReport`
- `CoachingFeedback`

Relevant code:

- [`src/domain/types.ts`](../src/domain/types.ts)
- [`src/agents/feedback-coach.ts`](../src/agents/feedback-coach.ts)

### Progress page

Use:

- `SkillNode[]`
- recent evaluation history

Relevant code:

- [`src/domain/skills.ts`](../src/domain/skills.ts)

### Study plan page

Use:

- `generateStudyPlan`
- `StudyPlanItem[]`

Relevant code:

- [`src/agents/study-planner.ts`](../src/agents/study-planner.ts)
- [`src/domain/types.ts`](../src/domain/types.ts)

### Mock mode

Use:

- `buildMockExamPlan`
- strict session rules

Relevant code:

- [`src/agents/mock-exam-runner.ts`](../src/agents/mock-exam-runner.ts)
- [`src/agents/session-orchestrator.ts`](../src/agents/session-orchestrator.ts)

## Recommended Server Integration Pattern

For the first implementation, create a thin web-server layer that wraps the existing application service.

Recommended pattern:

- create a server-only module that instantiates `createApplicationService(...)`
- use mock provider wiring or a safe fallback while the real provider is still being integrated
- expose the service to the app through server actions or route handlers
- keep prompt file reading and provider calls on the server only

Do not import prompt text or provider code into client components.

## Suggested First Internal Adapters

The first website version will probably need a few glue layers.

Recommended additions:

- `lib/server/app-service.ts`
- `lib/server/provider-router.ts`
- `lib/mappers/exercise-to-view-model.ts`
- `lib/mappers/evaluation-to-feedback-view.ts`
- `lib/mock-data/`
- `lib/validations/`

These should help the UI consume clean data without leaking low-level details everywhere.

## Implementation Principles

The next agent should follow these rules:

### 1. Build the real app shell first

Do not start with isolated one-off pages.

Start with:

- root layout
- navigation
- shared spacing system
- shared panel and card styles
- typography scale

### 2. Use the HTML designs as reference, not as the final architecture

If the `design/` folder contains repeated patterns, turn them into components.

### 3. Use mock data where the backend is not ready

Do not block the whole UI waiting for persistence or auth.

The first useful milestone is a convincing product UI with typed mocked data and clear integration seams.

### 4. Keep client-side complexity limited

Only mark components with `"use client"` when they truly need it.

Likely client components:

- practice editor and composer
- timers
- interactive tabs or filters
- audio controls later

### 5. Keep the product serious and non-generic

This app should feel like a premium academic training tool, not a generic AI dashboard and not a playful language app.

## What The Next Agent Should Deliver

The next agent should aim to deliver:

- a functioning Next.js app in this repository
- a shared layout and navigation system
- the main product screens based on the design files
- mock or initial server integration using the existing application service
- clean reusable components
- a documented route structure
- a clear separation between UI code and the existing domain/agent/provider layers

## What The Next Agent Should Avoid

- rewriting the domain model without a strong reason
- merging all agent behaviors into frontend components
- hard-coding provider-specific logic into page files
- shipping the design HTML as raw unstructured pages
- overusing client state or adding heavy state libraries too early
- bundling prompt files into the browser

## Definition Of Done For The First Website Milestone

The first milestone should be considered successful if:

- the app has a coherent visual system derived from `design/`
- the dashboard, section pages, and practice workspace are implemented
- the feedback, progress, and study plan views exist and feel connected
- the route structure matches the product architecture
- the app uses the existing TypeScript core instead of duplicating it
- mocked or partial data integration is cleanly typed
- the code is easy to extend toward real persistence and provider calls

## Copy/Paste Prompt For The Next Agent

Use the following prompt as the direct handoff to the website-building agent.

```text
You are continuing work on the DaF Focus repository.

Your mission is to build the first real web app for the project using the existing architecture, not to replace that architecture.

Context:
- This repository already contains the backend-oriented scaffold for an AI-first digital TestDaF trainer.
- The core business logic already exists in TypeScript under src/.
- The prompt packs already exist under prompts/.
- The application-facing service boundary already exists in src/api/actions.ts.
- There is no frontend yet.
- There will be HTML design files available in the design/ folder. Treat them as the visual source of truth and translate them into reusable Next.js UI.

Before making major changes, read these files in this order:
1. README.md
2. docs/getting-started.md
3. docs/codebase-tour.md
4. docs/architecture.md
5. docs/domain-model.md
6. docs/agents.md
7. docs/prompts.md
8. docs/workflows.md
9. docs/website-agent-handoff.md
10. src/domain/types.ts
11. src/domain/testdaf.ts
12. src/domain/skills.ts
13. src/prompts/catalog.ts
14. src/api/actions.ts

Build goals:
- create a Next.js App Router web app inside this repository
- keep TypeScript across the stack
- use Tailwind CSS for implementation speed and for translating the HTML design files
- keep server components as the default
- use client components only where interactivity requires them
- keep the existing src/ domain, agent, prompt, and provider layers intact
- build a serious, premium, academically credible product UI

Recommended stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- zod
- Drizzle ORM plus PostgreSQL later when persistence is added

Important product rule:
- this is not a generic SaaS dashboard
- this is not a playful language learning app
- this is not just a chatbot UI
- the core product is a serious TestDaF preparation workspace

Implementation priorities:
1. shared app shell, typography, spacing, and navigation
2. dashboard
3. section pages for Lesen, Hoeren, Schreiben, Sprechen
4. practice workspace at /practice/[exerciseId]
5. detailed feedback page
6. progress page
7. study plan page
8. mock setup and mock results
9. secondary pages such as history, mistakes, settings

Recommended route map:
- /
- /onboarding
- /sections/lesen
- /sections/hoeren
- /sections/schreiben
- /sections/sprechen
- /practice/[exerciseId]
- /feedback/[attemptId]
- /progress
- /study-plan
- /mock/setup
- /mock/[sessionId]
- /mock/results/[sessionId]
- /history
- /mistakes
- /settings

How to use the existing backend scaffold:
- use ExerciseSpec and the TestDaF catalog to drive section pages and exercise navigation
- use createApplicationService from src/api/actions.ts as the service boundary
- use LearnerState for dashboard, progress, and study plan views
- use EvaluationReport and CoachingFeedback for review and feedback pages
- keep prompt loading and provider usage on the server side only

How to use the design/ folder:
- read every HTML file in design/
- extract repeated visual patterns into reusable components
- derive design tokens and layout rules
- do not just paste raw HTML into isolated page files
- preserve the visual direction while improving semantics and accessibility

Implementation guidance:
- create the Next.js app directly in this repository
- keep src/ as the core product layer
- add app/, components/, and lib/ for the web app
- use mock data or adapter layers when the backend is not fully wired yet
- do not block UI progress on auth, persistence, or audio features

Important constraints:
- do not rewrite the core domain model unless clearly necessary
- do not move provider-specific logic into UI components
- do not bundle prompt files into the client
- do not introduce a heavy global state solution unless the app truly needs it

What a good first milestone looks like:
- a coherent, high-quality app shell
- core product pages implemented from the design files
- typed UI integration with the existing service layer or mock adapters
- clean reusable components
- a practice workspace that already reflects the intended product experience

Please inspect the repository first, then propose a short implementation plan, then start building.
```
