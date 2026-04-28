# Documentation Index

This folder explains how the current DaF Focus / definitive app works, how its components fit together, and how contributors should change it safely.

If you are new to the repository, read these documents in order:

## Start Here

1. [Getting Started](./getting-started.md)
2. [Codebase Tour](./codebase-tour.md)
3. [Architecture](./architecture.md)
4. [Contributor Route Map](./contributor-route-map.md)
5. [Component Groups](./component-groups.md)
6. [Server Data Flow](./server-data-flow.md)
7. [Modification Hotspots](./modification-hotspots.md)
8. [Verification Workflow](./verification-workflow.md)

## Core Product Docs

9. [Testing](./testing.md)
10. [Domain Model](./domain-model.md)
11. [Agents](./agents.md)
12. [Prompt System](./prompts.md)
13. [Workflows](./workflows.md)
14. [Providers](./providers.md)
15. [AI System Design](./ai-system-design.md)
16. [TestDaF Digital Research](./testdaf-digital-research.md)

## Historical / Design Context

17. [Stitch UI Prompting](./stitch-ui-prompting.md)
18. [Stitch View Prompts](./stitch-view-prompts.md)
19. [Website Agent Handoff](./website-agent-handoff.md)
20. [Tabla Maestra Grammar](./tabla-maestra-grammar.md)
21. [Grammar Sections](./grammar-sections.md)

## What These Docs Cover

Together these docs explain:

- how to run the Next.js app locally
- how the route tree is organized
- how screen components are grouped and where new UI should live
- how page data moves through the web layer and core service
- which files are the most important integration seams
- how to test, verify, and smoke-check changes before handing work to another agent or contributor
- how exercises, evaluations, prompts, and skill updates are modeled
- how provider routing works in fallback and live MiniMax mode

## Quick Summary

DaF Focus has two connected halves:

- a web app in `app/`, `components/`, and `lib/`
- a structured AI core in `src/` and `prompts/`

Most routes are thin server pages. They call `lib/server/page-data.ts`, which uses the cached application service from `lib/server/app-service.ts`, which then calls the core service in `src/api/actions.ts`.

The largest product surface is the shared workspace route:

- `app/workspace/[variant]/[slug]/page.tsx`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `app/workspace/actions.ts`

The project also includes a second interactive system for live chat-based trainers:

- `app/llm-test/page.tsx`
- `app/chat-exercises/page.tsx`
- `app/chat-exercises/[slug]/page.tsx`
- `app/api/llm-test/stream/route.ts`

## Where To Look For What

If you want to run the project:

- read [Getting Started](./getting-started.md)
- then check [`README.md`](../README.md)

If you want to understand the route tree and page ownership:

- read [Contributor Route Map](./contributor-route-map.md)
- inspect [`app/`](../app)

If you want to understand component ownership:

- read [Component Groups](./component-groups.md)
- inspect [`components/`](../components)

If you want to understand runtime behavior and data movement:

- read [Server Data Flow](./server-data-flow.md)
- inspect [`lib/server/`](../lib/server)
- inspect [`src/api/actions.ts`](../src/api/actions.ts)

If you want to understand where changes can break the app:

- read [Modification Hotspots](./modification-hotspots.md)

If you want to understand how to validate changes:

- read [Verification Workflow](./verification-workflow.md)
- then read [Testing](./testing.md)

If you want to understand the core product logic:

- read [Architecture](./architecture.md)
- inspect [`src/agents/`](../src/agents)
- inspect [`src/domain/`](../src/domain)
- inspect [`prompts/`](../prompts)

If you want the original product rationale used to build the website:

- read [Website Agent Handoff](./website-agent-handoff.md)
- treat it as historical context, not as the current status report
