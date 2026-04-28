# Component Groups

This document explains how UI responsibilities are split across `components/`.

Use it when you need to decide:

- where a new component should live
- whether a file should be a UI primitive, shell component, or screen component
- which components are safe to edit in isolation
- which components are tightly coupled to route view models

---

## Design Rule

The component tree is intentionally split into three levels:

1. **shell components** for global framing and navigation
2. **UI primitives** for low-level reusable building blocks
3. **feature/screen components** for route-facing product surfaces

That separation keeps the app easier to evolve and reduces copy-paste styling logic.

---

## `components/shell/`

These files own the global frame of the application.

Primary files:
- `components/shell/app-shell.tsx`
- `components/shell/sidebar-nav.tsx`
- `components/shell/top-bar.tsx`
- `components/shell/mobile-menu.tsx`
- `components/shell/mobile-nav.tsx`
- `components/shell/brand-lockup.tsx`

### Responsibilities
- page-level chrome
- global navigation
- current-route visibility
- desktop/mobile shell differences
- top-level branding and runtime display

### When to edit shell files
Edit these when you need to:
- add or remove a navigation item
- change global layout behavior
- change sidebar or top-bar labels
- alter mobile navigation treatment
- expose a new route globally

### When **not** to edit shell files
Do **not** put screen-specific business logic here.

Bad example:
- fetching dashboard-specific data inside `sidebar-nav.tsx`

Good example:
- keeping the shell focused on route framing and navigation display only

---

## `components/ui/`

These are low-level building blocks.

Primary files:
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/pill.tsx`
- `components/ui/icon.tsx`
- `components/ui/progress-bar.tsx`
- `components/ui/metric-card.tsx`
- `components/ui/markdown-preview.tsx`

### Responsibilities
- visual primitives
- repeated styling patterns
- small display abstractions
- shared interaction affordances

### Rules for UI primitives
UI primitives should stay:
- reusable
- visually focused
- light on product-specific assumptions

They should **not** know about:
- TestDaF task rules
- view-model contracts for a specific screen
- provider/runtime decisions
- route params or workspace variants

### When to create a new UI primitive
Create one when:
- the same visual pattern appears in multiple screen components
- the abstraction still makes sense outside a single feature

Do **not** create a primitive just because a component is small.

---

## Feature / Screen Component Folders

These folders hold route-facing UI surfaces.

### `components/dashboard/`

Primary file:
- `components/dashboard/dashboard-overview.tsx`

Responsibilities:
- dashboard summary layout
- section cards
- weak-skill summary
- study plan presentation
- recent activity presentation

Depends on:
- dashboard view model from `lib/mappers/dashboard-to-view-model.ts`

Edit here when changing:
- homepage experience
- dashboard layout
- dashboard-specific text hierarchy

---

### `components/sections/`

Primary file:
- `components/sections/section-hub.tsx`

Responsibilities:
- section hub pages for Lesen/Hören/Schreiben/Sprechen
- focus cards
- task lists
- section-level metrics
- challenge call-to-action blocks

Depends on:
- section view model from `lib/mappers/section-to-view-model.ts`

Edit here when changing:
- section landing pages
- section-specific task presentation
- section-level route-to-workspace launch behavior

---

### `components/grammar/`

Primary file:
- `components/grammar/grammar-library-screen.tsx`

Responsibilities:
- grammar library layout
- featured recommendation cards
- curriculum groups
- filter display
- pulse/consistency summary

Depends on:
- grammar library view model from `lib/mappers/grammar-library-to-view-model.ts`

Edit here when changing:
- grammar library visuals
- grammar card grouping and emphasis
- grammar-library-specific presentation logic

---

### `components/notebook/`

Primary file:
- `components/notebook/mistake-notebook-screen.tsx`

Responsibilities:
- recurring-error display
- featured and supporting mistake cards
- correction framing
- roadmap CTA presentation

Depends on:
- notebook view model from `lib/mappers/mistake-notebook-to-view-model.ts`

Edit here when changing:
- mistake notebook page behavior
- correction card layout
- notebook-specific UI flows

---

### `components/mock/`

Primary files:
- `components/mock/mock-test-setup.tsx`
- `components/mock/mock-results-screen.tsx`

Responsibilities:
- mock test entry and framing
- mock results layout and summaries
- post-mock recommendations

Depends on:
- mock setup and results view models from `lib/server/page-data.ts` and mappers

Edit here when changing:
- mock setup cards
- results summaries
- post-mock UX

---

### `components/workspace/`

Primary files:
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`

Responsibilities:
- shared workspace chrome
- ready-state handling
- generated material display
- form input handling
- submission UX
- post-submit feedback display

This folder is one of the most important UI seams in the repo.

### Division of labor inside workspace

#### `workspace-screen.tsx`
Server-fed presentation wrapper.

Responsibilities:
- page-level workspace layout
- summary cards
- debug display block
- embedding the client interaction surface

#### `workspace-client.tsx`
Client-side interaction engine.

Responsibilities:
- local form state
- ready-click generation flow
- submission flow
- result-state switching
- radio/text/essay/speech/reflection input handling

When changing workspace behavior, inspect together:
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `lib/mappers/workspace-to-view-model.ts`
- `app/workspace/actions.ts`

---

### `components/llm-test/`

Primary file:
- `components/llm-test/llm-test-chat.tsx`

Responsibilities:
- streaming live chat UI
- prompt selection/locking behavior
- runtime status display
- exercise-mode chat experience for `/chat-exercises/[slug]`

Depends on:
- stream API route `app/api/llm-test/stream/route.ts`
- LLM test type contracts in `lib/llm-test/types.ts`

Edit here when changing:
- chat-stream rendering
- exercise chat layout
- message state behavior
- prompt-lock UX

---

## Component Ownership Rules

### Rule 1: Keep pages thin
Most route files in `app/` should stay small.

Good pattern:
- route gets a view model
- route renders one main screen component

If a route file becomes heavy, move logic into:
- `lib/server/page-data.ts`
- `lib/mappers/`
- a screen component

### Rule 2: Keep product logic out of UI primitives
If a component needs to know about:
- TestDaF task metadata
- provider/runtime mode
- workspace variants
- prompt IDs

it probably does **not** belong in `components/ui/`.

### Rule 3: Keep route-specific layout in screen folders
If a component is only meaningful for one route family, keep it in that feature folder.

Examples:
- `dashboard-overview.tsx` belongs in `components/dashboard/`
- `workspace-client.tsx` belongs in `components/workspace/`
- `llm-test-chat.tsx` belongs in `components/llm-test/`

### Rule 4: Keep shell navigation centralized
Do not scatter navigation ownership across pages.

If the route should be globally discoverable, update:
- `components/shell/sidebar-nav.tsx`
- `components/shell/mobile-menu.tsx`
- possibly `components/shell/top-bar.tsx`

---

## Safe Editing Guide

### If you are changing only visuals
Start with:
- `components/ui/`
- then feature screen files if needed

### If you are changing page composition
Start with:
- the feature screen component
- then inspect the route page if layout ownership is unclear

### If you are changing interaction behavior
Start with:
- client component files like `workspace-client.tsx` or `llm-test-chat.tsx`
- then inspect server actions or API routes that feed them

### If you are changing data shown on a screen
Start with:
- the mapper in `lib/mappers/`
- then inspect `lib/server/page-data.ts`
- only then update the screen component if the UI contract changes

---

## Quick Folder Summary

| Folder | Owns | Avoid putting here |
| --- | --- | --- |
| `components/shell/` | global app frame and nav | feature-specific business logic |
| `components/ui/` | low-level reusable primitives | route or domain logic |
| `components/dashboard/` | homepage screen | global shell behavior |
| `components/sections/` | section hub screens | provider logic |
| `components/grammar/` | grammar library screen | generic primitives |
| `components/notebook/` | mistake notebook screen | unrelated route logic |
| `components/mock/` | mock setup/results screens | general workspace behavior |
| `components/workspace/` | shared workspace UX | domain catalog definitions |
| `components/llm-test/` | live chat trainer UI | server-side provider selection |

---

## Related Files Outside `components/`

When component work starts touching behavior, also inspect:
- `lib/mappers/types.ts`
- `lib/mappers/*.ts`
- `lib/server/page-data.ts`
- `app/workspace/actions.ts`
- `app/api/llm-test/stream/route.ts`

Those files define the data and interaction contracts that the components consume.
