# Documentation Index

This folder explains the current DaF Focus web app and the AI core behind it.

If you are new to the repository, read these documents in order:

1. [Getting Started](./getting-started.md)
2. [Codebase Tour](./codebase-tour.md)
3. [Architecture](./architecture.md)
4. [Testing](./testing.md)
5. [Domain Model](./domain-model.md)
6. [Agents](./agents.md)
7. [Prompt System](./prompts.md)
8. [Workflows](./workflows.md)
9. [Providers](./providers.md)
10. [AI System Design](./ai-system-design.md)
11. [TestDaF Digital Research](./testdaf-digital-research.md)
12. [Stitch UI Prompting](./stitch-ui-prompting.md)
13. [Stitch View Prompts](./stitch-view-prompts.md)
14. [Website Agent Handoff](./website-agent-handoff.md)

## What These Docs Cover

Together these docs explain:

- how to run the Next.js app locally
- how the web layer talks to the core service
- how exercises, evaluations, prompts, and skill updates are modeled
- how provider routing works in fallback and live MiniMax mode
- where to extend the app safely without collapsing architectural boundaries

## Quick Summary

DaF Focus is a TestDaF learning product with two connected halves:

- a real web app in `app/`, `components/`, and `lib/`
- a structured AI core in `src/` and `prompts/`

The home page is the dashboard. Section pages, Grammar Library, Mistake Notebook, and Mock Test all route into a shared workspace pattern that uses the same underlying application service.

## Where To Look For What

If you want to run the project:

- read [Getting Started](./getting-started.md)
- then check [`README.md`](../README.md)

If you want to understand the web layer:

- read [Codebase Tour](./codebase-tour.md)
- inspect [`app/`](../app)
- inspect [`components/`](../components)
- inspect [`lib/server/page-data.ts`](../lib/server/page-data.ts)

If you want to understand the core product logic:

- read [Architecture](./architecture.md)
- inspect [`src/api/actions.ts`](../src/api/actions.ts)
- inspect [`src/agents/`](../src/agents)
- inspect [`src/domain/`](../src/domain)

If you want to understand the prompt system:

- read [Prompt System](./prompts.md)
- inspect [`prompts/`](../prompts)

If you want to understand provider integration:

- read [Providers](./providers.md)
- inspect [`src/providers/`](../src/providers)
- inspect [`lib/server/openai-compatible-provider.ts`](../lib/server/openai-compatible-provider.ts)

If you want the original product rationale used to build the website:

- read [Website Agent Handoff](./website-agent-handoff.md)
- treat it as historical context, not as the current status report
