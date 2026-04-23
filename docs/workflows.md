# Workflows

This document explains the main end-to-end flows in the current app.

## Why This Document Exists

It is possible to understand individual files and still feel unsure about how the product behaves from screen to service.

This document closes that gap.

## Workflow 1: Guided Practice

This is the standard adaptive practice flow.

### Step 1: Open a section or dashboard link

Typical UI entry points:

- `/`
- `/lesen`
- `/hoeren`
- `/schreiben`
- `/sprechen`

Route data is prepared in:

- [`lib/server/page-data.ts`](../lib/server/page-data.ts)

### Step 2: Load the workspace

The learner enters:

- `/workspace/exercise/[slug]`

The page:

- resolves the exercise from the domain catalog
- builds demo learner state
- asks the application service to generate one `ExerciseInstance`

### Step 3: Submit a response

The workspace client sends structured input to:

- [`app/workspace/actions.ts`](../app/workspace/actions.ts)

Depending on the task, the submission may contain:

- selected options
- free text
- field-based responses
- text standing in for speech or integrated answers

### Step 4: Evaluate the attempt

The server action calls:

- `evaluateAttempt`
- `buildFeedback`

The evaluator:

- builds a structured generation request
- asks the provider layer for JSON output
- falls back to local structured data if needed

### Step 5: Return UI-ready feedback

The client receives a structured submission result containing:

- headline
- summary
- strengths
- weaknesses
- next actions
- optional estimated TestDaF band

## Workflow 2: Mock Practice

This is the stricter exam-style flow.

### Step 1: Open the mock setup

Route:

- `/mock-test`

The page builds:

- runtime status
- demo learner state
- a mock exam plan from the application service

### Step 2: Enter the mock workspace

Route:

- `/workspace/mock/[slug]`

Current behavior:

- uses stricter chrome
- shows deferred-feedback expectations
- keeps the interaction aligned with exam pacing

### Step 3: Submit without immediate evaluation feedback

In mock mode, the workspace returns a deferred response state instead of inline correction.

This preserves the exam-like feel even before persistence is added.

### Step 4: Review results

Route:

- `/mock-test/results/[sessionId]`

The results screen currently combines:

- demo learner data
- mock plan structure
- roadmap items mapped from study-plan logic

## Workflow 3: Grammar Training

This flow turns weak skills into targeted drill work.

### Step 1: Open Grammar Library

Route:

- `/grammar-library`

The page:

- builds demo learner state
- asks the core service for a grammar training brief
- maps that brief into track cards and a priority recommendation

### Step 2: Enter grammar workspace

Route:

- `/workspace/grammar/[slug]`

The workspace variant changes:

- helper copy
- post-submit behavior
- timeline framing
- task structure

### Step 3: Capture reflection-style output

Grammar workspace submissions currently use reflection-style post-submit handling instead of full official-task evaluation.

That keeps the flow coherent while deeper training agents are still being expanded.

## Workflow 4: Mistake Notebook Review

This flow turns recurring mistakes into reusable learning prompts.

### Step 1: Open Mistake Notebook

Route:

- `/mistake-notebook`

The page uses demo notebook entries and maps them into:

- mistake cards
- corrections
- linked skills
- a roadmap CTA

### Step 2: Enter mistake workspace

Route:

- `/workspace/mistake/[slug]`

This variant keeps the learner in a correction and transfer workflow rather than an official scored task.

## Workflow 5: Dashboard Planning Loop

The dashboard is the home screen and the main planning surface.

It combines:

- learner skill signals
- study plan items
- recent activity
- links into section hubs and workspaces

This is what turns the AI core from isolated functions into a coherent learning product.

## Practical Reading Tip

If you want to follow the workflows in code, read:

1. [`app/page.tsx`](../app/page.tsx)
2. [`lib/server/page-data.ts`](../lib/server/page-data.ts)
3. [`app/workspace/actions.ts`](../app/workspace/actions.ts)
4. [`src/api/actions.ts`](../src/api/actions.ts)
5. [`src/agents/`](../src/agents)
