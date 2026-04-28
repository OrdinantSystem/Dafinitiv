# Contributor Route Map

This document maps every important route in the app to the files that power it.

Use this when you need to answer:

- which file owns a page
- where a route gets its data
- whether a route is server-rendered, client-heavy, or streamed
- which routes are tied to the shared workspace system

---

## Route Design Pattern

Most routes follow the same pattern:

```text
App Router page in app/
  -> asks lib/server/page-data.ts for a view model
  -> passes that view model into a screen component in components/
```

That pattern keeps pages thin and moves most shaping logic out of the route file.

The two biggest exceptions are:

1. the shared workspace interaction path in `app/workspace/actions.ts`
2. the streaming chat API route in `app/api/llm-test/stream/route.ts`

---

## Shared Shell

### `app/layout.tsx`

Global layout entry point.

Responsibilities:
- loads global styles
- wraps the app shell
- ensures the sidebar/top-bar/mobile framing is available across routes

Related component files:
- `components/shell/app-shell.tsx`
- `components/shell/sidebar-nav.tsx`
- `components/shell/top-bar.tsx`
- `components/shell/mobile-menu.tsx`
- `components/shell/mobile-nav.tsx`

---

## Main Product Routes

### `/` -> `app/page.tsx`

Screen:
- `components/dashboard/dashboard-overview.tsx`

Data source:
- `getDashboardViewModel()` in `lib/server/page-data.ts`

Purpose:
- dashboard home
- current section trends
- weak-skill overview
- study plan links
- recent activity

---

### `/lesen` -> `app/lesen/page.tsx`
### `/hoeren` -> `app/hoeren/page.tsx`
### `/schreiben` -> `app/schreiben/page.tsx`
### `/sprechen` -> `app/sprechen/page.tsx`

Screen:
- `components/sections/section-hub.tsx`

Data source:
- `getSectionHubViewModel()` in `lib/server/page-data.ts`

Purpose:
- section overview
- official task listings
- adaptive recommendations
- launch points into the shared workspace

Special note:
- `Hören` and `Sprechen` currently expose text-first framing rather than full audio-native production pipelines.

---

### `/grammar-library` -> `app/grammar-library/page.tsx`

Screen:
- `components/grammar/grammar-library-screen.tsx`

Data source:
- `getGrammarLibraryViewModel()` in `lib/server/page-data.ts`

Purpose:
- grammar remediation library
- prioritized recommendations
- grouped lesson cards
- links into grammar workspaces

---

### `/mistake-notebook` -> `app/mistake-notebook/page.tsx`

Screen:
- `components/notebook/mistake-notebook-screen.tsx`

Data source:
- `getMistakeNotebookViewModel()` in `lib/server/page-data.ts`

Purpose:
- recurring-error review surface
- mistake cards
- links into mistake workspaces or follow-up practice

---

### `/mock-test` -> `app/mock-test/page.tsx`

Screen:
- `components/mock/mock-test-setup.tsx`

Data source:
- `getMockSetupViewModel()` in `lib/server/page-data.ts`

Purpose:
- mock-exam entry surface
- section selection and overview
- launch point into stricter exam-style practice

---

### `/mock-test/results/[sessionId]` -> `app/mock-test/results/[sessionId]/page.tsx`

Screen:
- `components/mock/mock-results-screen.tsx`

Data source:
- `getMockResultsViewModel()` in `lib/server/page-data.ts`

Purpose:
- post-mock summary
- section breakdowns
- follow-up recommendations

---

## Shared Workspace Routes

### `/workspace/[variant]/[slug]` -> `app/workspace/[variant]/[slug]/page.tsx`

Screen:
- `components/workspace/workspace-screen.tsx`
- interactive client logic in `components/workspace/workspace-client.tsx`

Data source:
- `getWorkspaceViewModel()` in `lib/server/page-data.ts`

Server action path:
- `app/workspace/actions.ts`

Supported variants:
- `exercise`
- `grammar`
- `mistake`
- `mock`

Purpose:
- the main working surface for generated exercises, grammar transfer, mistake review, and mock-specific interaction chrome

This is the most important route family in the app.

When editing workspace behavior, inspect these files together:
- `app/workspace/[variant]/[slug]/page.tsx`
- `app/workspace/actions.ts`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `lib/server/page-data.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `lib/workspace-context.ts`

---

## Chat and LLM Utility Routes

### `/llm-test` -> `app/llm-test/page.tsx`

Screen:
- `components/llm-test/llm-test-chat.tsx`

Purpose:
- free-form live chat against the configured LLM runtime
- prompt testing and model behavior inspection

Supporting files:
- `lib/server/llm-test-prompts.ts`
- `app/api/llm-test/stream/route.ts`

---

### `/chat-exercises` -> `app/chat-exercises/page.tsx`

Purpose:
- index page for focused live chat trainers
- each trainer locks the system prompt to a specific exercise mode

Data source:
- `lib/chat-exercises/catalog.ts`

Screen style:
- implemented directly in the page file with shared UI primitives

---

### `/chat-exercises/[slug]` -> `app/chat-exercises/[slug]/page.tsx`

Screen:
- `components/llm-test/llm-test-chat.tsx`

Supporting files:
- `lib/chat-exercises/catalog.ts`
- `lib/server/llm-test-prompts.ts`
- `lib/server/app-service.ts`

Purpose:
- focused chat trainer pages with a locked system prompt
- uses the same streaming backend as `/llm-test`

---

### `/api/llm-test/stream` -> `app/api/llm-test/stream/route.ts`

Type:
- API route, not a page

Purpose:
- NDJSON streaming endpoint for chat-based trainer responses
- runtime validation and error shaping
- MiniMax retry handling
- prompt resolution for llm-test and chat exercises

This is the main backend surface for streamed live chat behavior.

---

## Utility and Support Routes

### `/trial` -> `app/trial/page.tsx`

Purpose:
- lightweight trial/debug or validation surface

Why it matters:
- useful as a controlled route when adjusting shell behavior or smoke-testing new additions

---

### `not found` -> `app/not-found.tsx`

Purpose:
- shared 404 page
- used when invalid slugs or prompt references resolve to nothing

---

## Navigation Ownership

If a page should appear in navigation, update the shell components rather than only creating the route.

Primary files:
- `components/shell/sidebar-nav.tsx`
- `components/shell/mobile-menu.tsx`
- `components/shell/top-bar.tsx`

If you add a new route but forget these files, the route may exist without being discoverable.

---

## Editing Tips

### If you are adding a new page
Check, in order:
1. `app/.../page.tsx`
2. whether it needs a screen component under `components/`
3. whether it needs a view model from `lib/server/page-data.ts`
4. whether it needs navigation changes in the shell
5. whether tests or smoke checks should be updated

### If you are adding a new workspace behavior
Check, in order:
1. `lib/workspace-context.ts`
2. `lib/server/page-data.ts`
3. `lib/mappers/workspace-to-view-model.ts`
4. `components/workspace/workspace-client.tsx`
5. `app/workspace/actions.ts`

### If you are adding a new chat trainer
Check, in order:
1. `lib/chat-exercises/catalog.ts`
2. `lib/server/llm-test-prompts.ts`
3. `app/chat-exercises/page.tsx`
4. `app/chat-exercises/[slug]/page.tsx`
5. `app/api/llm-test/stream/route.ts`

---

## Quick Route Inventory

| Route | Main file | Main UI file | Data / behavior source |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | `components/dashboard/dashboard-overview.tsx` | `lib/server/page-data.ts` |
| `/lesen` | `app/lesen/page.tsx` | `components/sections/section-hub.tsx` | `lib/server/page-data.ts` |
| `/hoeren` | `app/hoeren/page.tsx` | `components/sections/section-hub.tsx` | `lib/server/page-data.ts` |
| `/schreiben` | `app/schreiben/page.tsx` | `components/sections/section-hub.tsx` | `lib/server/page-data.ts` |
| `/sprechen` | `app/sprechen/page.tsx` | `components/sections/section-hub.tsx` | `lib/server/page-data.ts` |
| `/grammar-library` | `app/grammar-library/page.tsx` | `components/grammar/grammar-library-screen.tsx` | `lib/server/page-data.ts` |
| `/mistake-notebook` | `app/mistake-notebook/page.tsx` | `components/notebook/mistake-notebook-screen.tsx` | `lib/server/page-data.ts` |
| `/mock-test` | `app/mock-test/page.tsx` | `components/mock/mock-test-setup.tsx` | `lib/server/page-data.ts` |
| `/mock-test/results/[sessionId]` | `app/mock-test/results/[sessionId]/page.tsx` | `components/mock/mock-results-screen.tsx` | `lib/server/page-data.ts` |
| `/workspace/[variant]/[slug]` | `app/workspace/[variant]/[slug]/page.tsx` | `components/workspace/*` | `lib/server/page-data.ts` + `app/workspace/actions.ts` |
| `/llm-test` | `app/llm-test/page.tsx` | `components/llm-test/llm-test-chat.tsx` | `app/api/llm-test/stream/route.ts` |
| `/chat-exercises` | `app/chat-exercises/page.tsx` | page-local layout + UI primitives | `lib/chat-exercises/catalog.ts` |
| `/chat-exercises/[slug]` | `app/chat-exercises/[slug]/page.tsx` | `components/llm-test/llm-test-chat.tsx` | prompt catalog + stream API |
| `/trial` | `app/trial/page.tsx` | page-local surface | route-local logic |
| `/api/llm-test/stream` | `app/api/llm-test/stream/route.ts` | n/a | stream backend |
