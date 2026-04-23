# Agents

This document explains the agent layer.

The agent files live in [`src/agents/`](../src/agents).

## What “Agent” Means In This Project

Here, an agent is not an autonomous assistant that makes broad decisions.

Instead, an agent is a focused module with a narrow responsibility.

That is why this architecture is easier to maintain than a system built around one giant prompt.

## Agent Overview

### `session-orchestrator.ts`

Responsibilities:

- create a session
- decide the queue of exercises
- activate a session
- advance through the queue

Why it matters:

- it defines the learning flow
- it keeps guided mode and mock mode explicit

### `exercise-generator.ts`

Responsibilities:

- build the request used to generate an exercise
- provide a fallback offline exercise structure
- call the provider to generate a structured `ExerciseInstance`

Why it matters:

- it connects `ExerciseSpec` to real generated content
- it is the bridge between the domain and the LLM generation step

### `exercise-evaluator.ts`

Responsibilities:

- build the evaluation request
- run structured evaluation through a provider
- provide a local fallback heuristic when needed

Why it matters:

- evaluation is central to the learner experience
- the fallback behavior keeps the architecture resilient even before full production integration

### `feedback-coach.ts`

Responsibilities:

- turn an `EvaluationReport` into a learner-facing coaching response

Why it matters:

- raw evaluation data is useful for the system
- coaching feedback is useful for the human learner

### `skill-profiler.ts`

Responsibilities:

- convert evaluation evidence into learner state updates

Why it matters:

- this is the module that makes the app adaptive

### `grammar-trainer.ts`

Responsibilities:

- choose the most suitable grammar remediation prompt based on weak grammar skills

Why it matters:

- grammar practice is not always the same as exam-format practice

### `study-planner.ts`

Responsibilities:

- generate a small study plan from the learner state

Why it matters:

- it connects diagnosis to action

### `mock-exam-runner.ts`

Responsibilities:

- build the high-level mock exam plan

Why it matters:

- it preserves section order and total structure for a stricter exam mode

## How The Agents Work Together

A common flow looks like this:

1. The session orchestrator creates a session.
2. The exercise generator creates a task instance.
3. The learner submits an attempt.
4. The evaluator produces an evaluation report.
5. The skill profiler updates the learner state.
6. The feedback coach summarizes the result.
7. The study planner recommends next work.

## Why This Split Is Good

This split gives three important benefits:

- you can understand each module in isolation
- you can test pieces separately
- you can replace or improve one piece without redesigning everything

## A Good Rule When Editing Agents

Try to keep each agent focused.

Bad direction:

- one file starts doing generation, evaluation, feedback, persistence, and routing all together

Good direction:

- one file has one clear job
- shared logic goes into the domain layer or a shared helper

