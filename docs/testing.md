# Testing

This document explains the current test and verification setup.

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

## Current Test Files

- [`tests/architecture.test.cjs`](../tests/architecture.test.cjs)
- [`tests/env.test.ts`](../tests/env.test.ts)
- [`tests/provider-router.test.ts`](../tests/provider-router.test.ts)
- [`tests/mappers.test.ts`](../tests/mappers.test.ts)
- [`tests/workspace-view-model.test.ts`](../tests/workspace-view-model.test.ts)

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

## What Is Verified Outside The Test Runner

The web layer is also worth validating with:

- `npm run build:web` to catch route and build regressions
- a quick manual pass through the main routes in `npm run dev`

Recommended manual smoke checklist:

- the shared shell renders on all main pages
- dashboard links reach the expected routes
- every hub page links into the workspace
- `Hoeren` and `Sprechen` clearly show their text-first status
- the app still loads with no API key in demo mode

## What Is Not Covered Yet

The current suite does not yet cover:

- database behavior
- authentication
- real network calls to MiniMax
- streaming responses
- end-to-end browser automation
- real audio capture or transcription

That is expected for the current stage of the project.

## Testing Philosophy

The project relies on structured contracts, so the most important tests are the ones that protect:

- metadata integrity
- provider and env behavior
- stable application service seams
- domain-to-view-model translation

As persistence and richer runtime features arrive, the next testing layer should be integration and end-to-end coverage.
