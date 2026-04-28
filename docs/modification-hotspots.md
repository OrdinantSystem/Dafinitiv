# Modification Hotspots

This document lists the files that are most likely to create regressions when changed.

Use it before editing the project in parallel with other agents or contributors.

A hotspot is a file that:
- connects multiple subsystems
- defines a shared contract
- shapes behavior used by many screens
- can silently break routing, generation, evaluation, or navigation

---

## How To Use This Document

For each hotspot below, you will see:
- why it matters
- what kind of changes belong there
- what usually breaks when it changes
- which neighboring files to inspect at the same time

---

## 1. `lib/server/page-data.ts`

### Why it matters
This is the main route-data orchestrator for the web app.

It decides:
- what a route should render
- which service operation to call
- how adaptive exercise resolution works
- how workspace variants are assembled
- what runtime/debug metadata is surfaced to the UI

### Typical changes
- new route data source
- new workspace variant behavior
- adaptive exercise targeting changes
- page-level view-model assembly changes

### What can break
- wrong page state on multiple routes
- broken workspace launch behavior
- mismatched variant/slug resolution
- debug/runtime info drifting from actual backend behavior

### Inspect together with
- `lib/server/app-service.ts`
- `lib/mappers/*.ts`
- `app/workspace/[variant]/[slug]/page.tsx`
- `lib/workspace-context.ts`

---

## 2. `app/workspace/actions.ts`

### Why it matters
This file is the backend interaction seam for structured workspaces.

It handles:
- ready-state generation
- submission processing
- deferred mock behavior
- reflection-only grammar/notebook behavior
- evaluation result shaping

### Typical changes
- submission rules
- new response kinds
- mock-mode behavior
- grammar or notebook post-submit logic

### What can break
- submissions silently returning the wrong mode
- evaluation not running when expected
- grammar/mistake flows becoming inconsistent with the UI
- generated results mismatching what `workspace-client.tsx` expects

### Inspect together with
- `components/workspace/workspace-client.tsx`
- `lib/mappers/workspace-to-view-model.ts`
- `src/api/actions.ts`
- `src/agents/exercise-evaluator.ts`
- `src/agents/feedback-coach.ts`

---

## 3. `lib/mappers/workspace-to-view-model.ts`

### Why it matters
This file defines the UI contract for the most important product surface: the shared workspace.

It translates generated exercises and variant context into:
- task title
- materials
- form field definitions
- timing labels
- helper text
- launch context and breadcrumb behavior
- result-state display expectations

### Typical changes
- changing workspace screen copy
- adding a new field type
- changing how variants differ visually or behaviorally
- adjusting task materials or metadata shown to learners

### What can break
- workspace client rendering errors
- missing fields for specific task types
- incorrect labels or launch links
- inconsistent variant behavior across routes

### Inspect together with
- `lib/mappers/types.ts`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `lib/server/page-data.ts`

---

## 4. `src/domain/testdaf.ts`

### Why it matters
This file is the central exercise catalog.

It defines:
- exercise IDs
- section assignment
- task order
- slugs
- timing
- response kind
- skill tags
- prompt path
- support level

### Typical changes
- adding or changing an official task spec
- modifying slugs or labels
- adjusting timing or metadata
- altering skill tags or support-level annotations

### What can break
- route slug mismatches
- prompt lookup failures
- mapper assumptions breaking
- wrong section/task listings
- test failures in architecture metadata checks

### Inspect together with
- `src/domain/exercise-ids.ts`
- `src/domain/types.ts`
- `src/prompts/catalog.ts`
- `tests/architecture.test.cjs`
- section-hub and workspace mapper files

---

## 5. `lib/workspace-context.ts`

### Why it matters
This file is small but important. It controls how other pages deep-link into the shared workspace.

It carries routing context like:
- source page
- section
- focus skill
- agent role
- exercise hint

### Typical changes
- adding a new query parameter
- changing launch semantics from dashboard or section hubs
- updating how context is preserved through navigation

### What can break
- broken deep links into workspace pages
- wrong adaptive exercise selection
- lost focus-skill context
- incorrect return breadcrumbs

### Inspect together with
- `lib/server/page-data.ts`
- `lib/mappers/workspace-to-view-model.ts`
- dashboard and section-hub link builders

---

## 6. `components/shell/sidebar-nav.tsx`, `components/shell/top-bar.tsx`, `components/shell/mobile-menu.tsx`

### Why they matter
These files own app discoverability.

They define:
- what routes are globally visible
- desktop/mobile nav parity
- shell-level labels and order

### Typical changes
- adding a new route to navigation
- renaming a nav item
- changing shell layout or current-route highlighting

### What can break
- routes exist but are undiscoverable
- mobile and desktop nav become inconsistent
- tests that protect shell behavior fail

### Inspect together with
- `components/shell/app-shell.tsx`
- route pages in `app/`
- `tests/mobile-shell.test.cjs`
- `tests/mobile-menu-behavior.test.cjs`

---

## 7. `app/api/llm-test/stream/route.ts`

### Why it matters
This is the streamed chat backend for `/llm-test` and `/chat-exercises/[slug]`.

It handles:
- request parsing
- prompt resolution
- OpenAI SDK setup
- MiniMax retry logic
- NDJSON event streaming
- error normalization

### Typical changes
- stream event shape updates
- retry logic updates
- prompt resolution changes
- runtime validation changes

### What can break
- live chat completely stopping
- broken streamed output parsing in the client
- prompt mismatch in chat trainers
- degraded error visibility

### Inspect together with
- `components/llm-test/llm-test-chat.tsx`
- `lib/server/llm-test-prompts.ts`
- `lib/llm-test/types.ts`
- `lib/server/env.ts`

---

## 8. `components/llm-test/llm-test-chat.tsx`

### Why it matters
This is the main client interaction surface for streamed LLM chat.

It is shared by:
- `/llm-test`
- `/chat-exercises/[slug]`

### Typical changes
- stream rendering
- message-state handling
- exercise-mode UX changes
- prompt selector behavior
- mobile edge-to-edge treatment

### What can break
- chat sessions failing to render incrementally
- locked system prompt behavior regressing
- runtime status presentation drifting from backend state
- exercise chat and free chat diverging incorrectly

### Inspect together with
- `app/api/llm-test/stream/route.ts`
- `lib/llm-test/types.ts`
- `app/chat-exercises/[slug]/page.tsx`
- `app/llm-test/page.tsx`

---

## 9. `lib/server/env.ts` and `lib/server/provider-router.ts`

### Why they matter
These files decide whether the app is running in fallback or live provider mode.

### Typical changes
- env variable parsing
- runtime labels
- provider activation conditions
- live/fallback status reporting

### What can break
- app claims to be live when it is not
- provider activation failing silently
- chat/workspace runtime labels becoming misleading
- tests around provider mode failing

### Inspect together with
- `lib/server/openai-compatible-provider.ts`
- `src/providers/provider-router.ts`
- `tests/env.test.ts`
- `tests/provider-router.test.ts`

---

## 10. `lib/server/llm-test-prompts.ts`

### Why it matters
This file is the prompt discovery seam for llm-test and chat-exercise routes.

### Typical changes
- adding new prompt options
- changing prompt discovery rules
- prompt-path resolution changes

### What can break
- chat exercise detail pages returning `notFound()`
- missing prompt options in llm-test
- tests around prompt discovery failing

### Inspect together with
- `app/chat-exercises/[slug]/page.tsx`
- `app/api/llm-test/stream/route.ts`
- `tests/llm-test-prompts.test.ts`

---

## 11. `components/workspace/workspace-client.tsx`

### Why it matters
This file is the workspace interaction engine on the client side.

It manages:
- ready-state transitions
- local form state
- radio/text/essay/reflection input handling
- submission dispatch
- result-state rendering

### Typical changes
- input UX changes
- field-state handling
- post-submit UI updates
- generation button flow

### What can break
- no input fields shown for some task types
- ready-state never advancing
- submission payload mismatch
- result cards showing wrong mode or wrong labels

### Inspect together with
- `app/workspace/actions.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `components/workspace/workspace-screen.tsx`

---

## 12. `src/api/actions.ts`

### Why it matters
This file is the stable web-facing application service contract.

### Typical changes
- adding a new operation
- changing how web layer calls into agents
- adjusting the service boundary

### What can break
- multiple routes at once
- page-data assembly failing
- workspace or mock paths losing access to shared behaviors

### Inspect together with
- `lib/server/app-service.ts`
- `src/agents/*.ts`
- `lib/server/page-data.ts`

---

## Safe Change Checklist

Before editing a hotspot, ask:

1. Is this file a shared contract for more than one route?
2. Which tests cover it today?
3. Which adjacent files shape its input and output?
4. Does the change require a mapper update, not only a UI update?
5. Do I need to smoke-check both fallback mode and live mode behavior?

If the answer to any of those is yes, do not edit the file in isolation.

---

## Hotspots by Change Type

| If you are changing... | Start here | Then inspect |
| --- | --- | --- |
| route data | `lib/server/page-data.ts` | mappers + route page |
| workspace submission | `app/workspace/actions.ts` | workspace client + evaluator |
| workspace labels/fields | `lib/mappers/workspace-to-view-model.ts` | workspace screen/client |
| official task metadata | `src/domain/testdaf.ts` | tests + prompt catalog |
| nav items | shell nav files | route pages + mobile tests |
| live chat stream | `app/api/llm-test/stream/route.ts` | llm-test chat + prompt loader |
| env/runtime mode | `lib/server/env.ts` | provider router + tests |
| chat prompt options | `lib/server/llm-test-prompts.ts` | chat routes + tests |

---

## Final Rule

If a file sits between two layers, treat it as a hotspot.

In this project, the most important seams are:
- route <-> page-data
- page-data <-> service
- service <-> agents/domain/providers
- domain <-> mappers
- workspace/chat backend <-> client interaction components

Those seams deserve slower edits, stronger verification, and explicit documentation updates when they change.
