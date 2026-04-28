# Verification Workflow

This document explains how contributors should verify changes before handing work to another person or agent.

Use this as the operational checklist for:
- feature edits
- route changes
- prompt or provider changes
- UI work
- workspace behavior changes
- live chat changes

---

## Core Commands

Run these from the project root:

```bash
npm run typecheck
npm run test
npm run verify
npm run build:web
```

### What each command means

#### `npm run typecheck`
Checks TypeScript correctness for both:
- the core library build (`src/`)
- the Next.js app (`app/`, `components/`, `lib/`)

#### `npm run test`
Runs the automated test suite.

#### `npm run verify`
Runs the normal contributor baseline:
- type-check
- then tests

This is the minimum command to run before claiming a change is safe.

#### `npm run build:web`
Runs the Next.js production build.

Use this as a smoke test for:
- route validity
- static generation problems
- import regressions
- app-router build issues

---

## Current Test Files

### TypeScript-based tests
- `tests/env.test.ts`
- `tests/provider-router.test.ts`
- `tests/mappers.test.ts`
- `tests/workspace-view-model.test.ts`
- `tests/llm-test-prompts.test.ts`

### CommonJS tests
- `tests/architecture.test.cjs`
- `tests/chat-exercises.test.cjs`
- `tests/mobile-shell.test.cjs`
- `tests/mobile-menu-behavior.test.cjs`
- `tests/trial-page.test.cjs`

---

## What The Test Suite Covers

### `tests/architecture.test.cjs`
Protects:
- exercise catalog coverage
- prompt-library integrity
- mock-exam planning shape
- skill-profiler behavior

Run this mentally whenever you change:
- `src/domain/testdaf.ts`
- `src/prompts/catalog.ts`
- `src/agents/mock-exam-runner.ts`
- `src/agents/skill-profiler.ts`

### `tests/env.test.ts`
Protects:
- env parsing
- runtime labels
- live vs fallback mode detection

Run this mentally whenever you change:
- `lib/server/env.ts`

### `tests/provider-router.test.ts`
Protects:
- provider selection
- fallback behavior
- live activation conditions

Run this mentally whenever you change:
- `lib/server/provider-router.ts`
- provider wiring in `lib/server/openai-compatible-provider.ts`

### `tests/mappers.test.ts`
Protects:
- dashboard shaping
- grammar/notebook shaping
- section and mock-result shaping

Run this mentally whenever you change:
- `lib/mappers/*.ts`
- `lib/mock-data/demo.ts`

### `tests/workspace-view-model.test.ts`
Protects:
- workspace variant resolution
- field mapping for selection tasks
- manual-ready behavior
- grammar/mistake reflection-mode behavior

Run this mentally whenever you change:
- `lib/server/page-data.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `app/workspace/actions.ts`

### `tests/llm-test-prompts.test.ts`
Protects:
- prompt discovery
- prompt file scan behavior

Run this mentally whenever you change:
- `lib/server/llm-test-prompts.ts`
- prompt files used by llm-test or chat exercises

### `tests/chat-exercises.test.cjs`
Protects:
- chat-exercises route inventory and page presence

Run this mentally whenever you change:
- `app/chat-exercises/page.tsx`
- `app/chat-exercises/[slug]/page.tsx`
- `lib/chat-exercises/catalog.ts`

### `tests/mobile-shell.test.cjs`
Protects:
- mobile shell structure
- expected shell decisions across routes

### `tests/mobile-menu-behavior.test.cjs`
Protects:
- mobile navigation behavior
- menu-level interaction expectations

Run these mentally whenever you change:
- `components/shell/mobile-menu.tsx`
- `components/shell/mobile-nav.tsx`
- `components/shell/app-shell.tsx`

### `tests/trial-page.test.cjs`
Protects:
- trial route presence and expected UI shape

Run this mentally whenever you change:
- `app/trial/page.tsx`

---

## Recommended Verification by Change Type

### 1. UI-only styling or layout changes
Run:
```bash
npm run typecheck
npm run test
npm run build:web
```

Manual smoke check:
- open the changed route in `npm run dev`
- confirm shell still renders
- confirm desktop/mobile nav did not regress

### 2. Route or view-model changes
Run:
```bash
npm run verify
npm run build:web
```

Manual smoke check:
- open the affected route
- confirm links resolve correctly
- confirm expected cards, labels, and CTA targets render

### 3. Workspace behavior changes
Run:
```bash
npm run verify
npm run build:web
```

Manual smoke check:
- open at least one `exercise` workspace
- open one `grammar` or `mistake` workspace
- confirm ready-state or reflection-state behavior still works
- submit a minimal response if submission behavior changed

Key routes to inspect:
- `/workspace/exercise/adaptive`
- a section-specific workspace deep link
- `/workspace/grammar/grammar-focus`

### 4. Provider or runtime changes
Run:
```bash
npm run verify
npm run build:web
```

Manual smoke check:
- confirm fallback mode still loads with missing/disabled live config
- confirm runtime labels still make sense
- if live mode changed, confirm llm-test or chat-exercises can still start correctly

### 5. Chat / streaming changes
Run:
```bash
npm run verify
npm run build:web
```

Manual smoke check:
- open `/llm-test`
- open `/chat-exercises`
- open at least one `/chat-exercises/[slug]`
- confirm streamed messages appear and prompt selection/locking still behaves correctly

---

## Manual Smoke Checklist

After automated checks, do a quick pass in dev mode.

Start the app:

```bash
npm run dev
```

Then check:

### Global shell
- sidebar renders
- top bar renders
- mobile menu still opens if shell behavior changed
- current route highlighting still makes sense

### Main pages
- `/`
- `/lesen`
- `/hoeren`
- `/schreiben`
- `/sprechen`
- `/grammar-library`
- `/mistake-notebook`
- `/mock-test`

### Workspace
- a workspace route loads without crashing
- ready-state still appears when expected
- generated materials or reflection fields still match the task type
- post-submit result cards render without layout regressions

### Chat routes
- `/llm-test` loads
- `/chat-exercises` loads
- `/chat-exercises/[slug]` loads for at least one known slug
- stream API does not return immediate error for a valid request

### Fallback behavior
- app still loads in fallback mode
- fallback labels remain honest
- text-first messaging for Hören/Sprechen remains visible where intended

---

## What Is Not Covered Yet

Even after `verify` and `build:web`, the project still does **not** have complete automated coverage for:
- database behavior
- auth
- real MiniMax network correctness under all live conditions
- full browser end-to-end tests
- real audio capture/transcription
- long-running streamed chat resilience under all providers

That means manual route checks still matter.

---

## Verification Baseline for Pull Requests or Handoffs

Before handing a change to another contributor or agent, include:

### Minimum evidence
- `npm run verify` result
- `npm run build:web` result
- brief note on which routes were manually opened

### Good evidence
- exact routes checked
- whether fallback/live mode was involved
- whether workspace submission or chat streaming was exercised

Example handoff note:

```text
Verified with:
- npm run verify ✅
- npm run build:web ✅

Manual checks:
- /grammar-library
- /workspace/grammar/grammar-focus
- /hoeren
- /chat-exercises/sample-slug

Observed mode:
- fallback/live (state which one)
```

---

## Fast Decision Table

| Change type | Minimum commands | Manual route checks |
| --- | --- | --- |
| copy/layout only | `typecheck`, `test`, `build:web` | affected route |
| route/view-model | `verify`, `build:web` | affected route + linked route |
| workspace behavior | `verify`, `build:web` | at least one workspace flow |
| provider/env | `verify`, `build:web` | fallback/live status route |
| chat streaming | `verify`, `build:web` | `/llm-test` + one chat exercise |
| nav changes | `verify`, `build:web` | desktop + mobile shell |

---

## Final Rule

If a change touches a hotspot file, do not rely only on static reasoning.

Run the commands. Open the route. Confirm the behavior.
