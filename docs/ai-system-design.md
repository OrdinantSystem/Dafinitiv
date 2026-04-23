# AI System Design

This is the more technical architecture note for DaF Focus.

If you want a softer introduction, read these first:

- [Getting Started](./getting-started.md)
- [Codebase Tour](./codebase-tour.md)
- [Architecture](./architecture.md)

## Current Product Shape

The repository now contains both:

- a real web app built with Next.js
- a structured AI core that powers generation, evaluation, feedback, planning, and grammar support

The product still intentionally avoids some infrastructure in v1:

- no database
- no auth
- no analytics pipeline
- no background jobs
- no real speech stack yet

That means the project is beyond scaffold stage, but still early enough to keep the architecture simple and explicit.

## Design Goal

The goal is to support a learner flow where the user can:

- open a section hub
- start a specific TestDaF-style exercise
- submit an answer in a shared workspace
- receive structured feedback or deferred mock results
- review weak skills, grammar priorities, and recurring mistakes

To support that reliably, the AI layer needs to behave like product infrastructure, not like a vague chat assistant.

## Main Design Decisions

### 1. TypeScript across the stack

The app is TypeScript-first from route to provider.

Why:

- shared types reduce drift between UI and core logic
- the product is heavily JSON- and schema-oriented
- Next.js and the backend core can evolve together without translation layers

Python can still be added later for audio and heavier processing, but it is not required to ship the current web product.

### 2. Provider-agnostic AI core

The domain and agent layers should not care which vendor serves the model.

That is why the core keeps the provider abstraction in `src/providers/`, while the web runtime adapter lives in `lib/server/`.

This split lets the app:

- run locally without secrets
- switch to MiniMax-compatible live mode with env config
- degrade safely when provider output is missing or malformed

### 3. Agent functions over autonomous swarms

The system treats agents as focused functions with clear jobs.

Examples:

- generate one exercise
- evaluate one attempt
- build one feedback payload
- plan one mock run
- select one grammar focus

This is easier to debug, test, and productize than a single all-purpose tutor agent.

### 4. Structured outputs first

The UI should receive typed objects, not paragraphs it must interpret.

That is why the system centers on objects such as:

- `ExerciseInstance`
- `EvaluationReport`
- `StudyPlanItem`
- `LearnerState`

The web app then maps those into dedicated screen view models in `lib/mappers/`.

### 5. Learner memory as explicit data

The app does not rely on a long chat transcript as the learner model.

Instead, it uses:

- a skill graph
- structured evaluation evidence
- study-plan generation over tracked weaknesses

This makes adaptation explainable and creates a natural path toward persistence later.

### 6. Graceful degradation by design

The project assumes that real LLM access will sometimes be missing during development.

So the system is built to keep working when:

- API keys are absent
- live mode is intentionally disabled
- structured model output fails to parse

That decision dramatically improves local development and protects the UI from provider volatility.

## Core Components

### Web layer

`app/` and `components/` define the actual user experience.

Key traits:

- server-first routes
- shared dashboard shell
- one workspace pattern for multiple learning modes
- client interactivity only where needed

### Web integration layer

`lib/server/` translates the web app into the core service.

Key responsibilities:

- parse env
- choose provider runtime mode
- create the application service
- prepare route data

### View-model layer

`lib/mappers/` keeps UI contracts stable and screen-specific.

This is important because the dashboard, section hubs, grammar library, notebook, and workspace all need different shapes even when they draw from overlapping domain objects.

### Core service layer

`src/api/actions.ts` exposes the operations the app relies on:

- session creation
- exercise generation
- attempt evaluation
- feedback generation
- study planning
- grammar focus generation
- mock planning

### Domain and prompt layers

`src/domain/` and `prompts/` define:

- what the product knows
- what the AI should do
- how the exam is represented
- how remediation differs from official task simulation

## Main Runtime Flow

```text
page request
  -> page-data function
  -> app service
  -> provider router
  -> core action
  -> agent call
  -> structured domain result
  -> view-model mapper
  -> rendered UI
```

For submission:

```text
workspace client
  -> server action
  -> evaluateAttempt
  -> buildFeedback
  -> submission result
  -> client feedback panel
```

## Product Modes

### Guided practice

Used for:

- immediate feedback
- adaptive training
- fast iteration on weak skills

### Mock practice

Used for:

- stricter sequencing
- delayed feedback
- exam-like pacing

### Grammar and notebook support

These flows share the workspace chrome but use different prompts, helper copy, and post-submit behavior.

## Why `Hoeren` and `Sprechen` Are Text-First Right Now

The product surface already includes those sections because they matter to the learning model and navigation.

But v1 intentionally stops short of:

- recording audio
- storing media
- transcribing speech
- playing listening assets

Instead, those sections are implemented in a way that preserves the product structure and lets the UI explain the limitation honestly.

## What The Next Infrastructure Layer Would Add

The current architecture leaves clear seams for:

- persistence of learners, sessions, attempts, and evaluations
- auth and multi-user data ownership
- audio and speech services
- observability and analytics
- richer background processing
- end-to-end testing and monitoring

The key design goal is to add those capabilities without rewriting the domain model or collapsing the provider boundary.
