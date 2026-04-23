# Providers

This document explains how model providers are represented in the project.

The provider system has two parts:

- core provider abstractions in [`src/providers/`](../src/providers)
- web-runtime wiring in [`lib/server/`](../lib/server)

## Why A Provider Layer Exists

The product should not be tightly coupled to one model vendor.

Without a provider boundary, the rest of the code would become mixed with:

- vendor-specific SDK calls
- vendor-specific request shapes
- vendor-specific response parsing
- fragile env handling

That would make the app harder to test and much harder to switch later.

## Core Provider Files

- [`src/providers/types.ts`](../src/providers/types.ts)
- [`src/providers/json-http.ts`](../src/providers/json-http.ts)
- [`src/providers/minimax.ts`](../src/providers/minimax.ts)
- [`src/providers/provider-router.ts`](../src/providers/provider-router.ts)

## Web Runtime Provider Files

- [`lib/server/env.ts`](../lib/server/env.ts)
- [`lib/server/provider-router.ts`](../lib/server/provider-router.ts)
- [`lib/server/openai-compatible-provider.ts`](../lib/server/openai-compatible-provider.ts)

## Core Interfaces

### `StructuredGenerationRequest<T>`

This describes a request for structured model output.

Important fields:

- operation name
- system prompt
- user prompt
- schema name
- metadata
- fallback value

The `fallback` field is especially important because the app uses it to stay functional in demo mode and during parse failures.

### `ProviderResult<T>`

This represents what comes back from a provider.

It includes:

- provider id
- model name
- parsed content
- optional raw text

### `ProviderAdapter`

This is the main abstraction.

Any provider adapter must implement:

- metadata about the provider
- a `generateStructured` method

## How The Current Web App Chooses A Provider

The web runtime does not use the core `src/providers/minimax.ts` adapter directly.

Instead it:

1. reads env via `lib/server/env.ts`
2. decides whether live mode is enabled
3. creates either:
   - a local fallback adapter, or
   - an OpenAI-compatible adapter backed by the official `openai` SDK
4. passes that adapter into `createApplicationService(...)`

This gives the UI a simple switch:

- demo fallback mode by default
- live MiniMax mode when env is ready

## Fallback Behavior

Fallback behavior is intentional, not an error path of last resort.

The app should still be usable when:

- API keys are missing
- live mode is disabled
- the provider throws
- the provider returns invalid JSON

That is why:

- `lib/server/provider-router.ts` can install a local fallback adapter
- `lib/server/openai-compatible-provider.ts` returns fallback content on errors
- the generator and evaluator also keep local heuristic fallbacks

## Why The Current Adapter Uses The OpenAI SDK

The current live path is optimized for compatibility with MiniMax's OpenAI-style API.

That gives the project:

- a familiar SDK
- straightforward request formatting
- a configurable `baseURL`
- an easier path to other compatible endpoints later

## Production Hardening Still To Add

Before a production rollout, this layer would likely need:

- retries
- timeout strategy
- rate-limit handling
- structured observability
- better error classes
- secret management beyond local env files

## Rule Of Thumb

If a change is specific to one model vendor, it belongs in `src/providers/` or `lib/server/openai-compatible-provider.ts`.

If a change affects product behavior regardless of provider, it probably belongs in the application service, agents, or mapper layers.
