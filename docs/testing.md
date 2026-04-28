# Testing

This document explains the current automated test coverage.

If you want the contributor-facing operational checklist, read [Verification Workflow](./verification-workflow.md) too.

---

## Commands

Run the core automated suite:

```bash
npm run test
```

Run type-checking plus tests:

```bash
npm run verify
```

Run the Next.js production build as a web smoke test:

```bash
npm run build:web
```

Run type-checking only:

```bash
npm run typecheck
```

---

## Current Test Files

### TypeScript tests
- [`tests/env.test.ts`](../tests/env.test.ts)
- [`tests/provider-router.test.ts`](../tests/provider-router.test.ts)
- [`tests/mappers.test.ts`](../tests/mappers.test.ts)
- [`tests/workspace-view-model.test.ts`](../tests/workspace-view-model.test.ts)
- [`tests/llm-test-prompts.test.ts`](../tests/llm-test-prompts.test.ts)

### CommonJS tests
- [`tests/architecture.test.cjs`](../tests/architecture.test.cjs)
- [`tests/chat-exercises.test.cjs`](../tests/chat-exercises.test.cjs)
- [`tests/mobile-shell.test.cjs`](../tests/mobile-shell.test.cjs)
- [`tests/mobile-menu-behavior.test.cjs`](../tests/mobile-menu-behavior.test.cjs)
- [`tests/trial-page.test.cjs`](../tests/trial-page.test.cjs)

---

## What The Tests Cover

### Architecture and metadata integrity

`architecture.test.cjs` checks the core product shape:

- the digital TestDaF catalog contains the expected tasks
- prompt packs are discoverable and counted correctly
- mock exam planning preserves order and counts
- learner skill updates behave as expected

### Environment parsing

`env.test.ts` checks:

- default env values
- boolean parsing for `APP_ENABLE_REAL_LLM`
- runtime status labels and modes

### Provider selection

`provider-router.test.ts` checks:

- fallback mode when live config is absent
- live provider activation when valid env is present

### View-model mapping

`mappers.test.ts` checks:

- dashboard shaping
- section hub shaping
- grammar and notebook mapping
- mock result shaping

### Workspace behavior

`workspace-view-model.test.ts` checks:

- workspace variant resolution
- workspace mapping decisions that drive UI behavior
- selection task field mapping
- manual-ready behavior
- grammar and mistake reflection behavior

### Prompt discovery

`llm-test-prompts.test.ts` checks:

- prompt-folder scanning
- prompt discovery updates after file changes
- llm-test prompt option resolution

### Chat exercise routes

`chat-exercises.test.cjs` checks:

- chat-exercise route presence
- trainer inventory assumptions

### Mobile shell behavior

`mobile-shell.test.cjs` and `mobile-menu-behavior.test.cjs` check:

- shell structure on smaller layouts
- burger menu behavior
- mobile navigation expectations

### Trial route

`trial-page.test.cjs` checks:

- trial page presence and expected route behavior

---

## What Is Verified Outside The Test Runner

The web layer is still worth validating with:

- `npm run build:web` to catch route and build regressions
- a quick manual pass through the main routes in `npm run dev`

Recommended manual smoke checklist:

- the shared shell renders on all main pages
- dashboard links reach the expected routes
- every hub page links into the workspace
- grammar, notebook, and mock pages load correctly
- `Hoeren` and `Sprechen` clearly show their text-first status when intended
- `/llm-test` and `/chat-exercises` still load if chat behavior changed
- the app still loads with no API key in demo mode

For the full contributor checklist, see [Verification Workflow](./verification-workflow.md).

---

## What Is Not Covered Yet

The current suite does not yet cover:

- database behavior
- authentication
- real network calls to MiniMax under all live conditions
- full browser end-to-end automation
- real audio capture or transcription
- persistent storage flows
- long-running stream resilience under every runtime condition

That is expected for the current stage of the project.

---

## Testing Philosophy

The project relies on structured contracts, so the most important tests are the ones that protect:

- metadata integrity
- provider and env behavior
- stable application-service seams
- domain-to-view-model translation
- workspace interaction shaping
- route/shell presence for important surfaces

As persistence and richer runtime features arrive, the next testing layer should be:

1. broader integration coverage
2. browser-driven end-to-end coverage
3. live-provider validation paths
4. audio and speaking-specific verification
