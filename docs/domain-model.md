# Domain Model

This document explains the most important types in the project.

The domain layer lives in [`src/domain/`](../src/domain).

## Why The Domain Layer Matters

This project is not just “some prompts and some API calls”.

It has a domain model because the app needs a stable internal language for:

- exercises
- attempts
- evaluations
- skills
- sessions
- study plans

If these concepts are vague, the whole product becomes hard to extend.

## Most Important Files

- [`src/domain/types.ts`](../src/domain/types.ts)
- [`src/domain/exercise-ids.ts`](../src/domain/exercise-ids.ts)
- [`src/domain/testdaf.ts`](../src/domain/testdaf.ts)
- [`src/domain/skill-taxonomy.ts`](../src/domain/skill-taxonomy.ts)
- [`src/domain/skills.ts`](../src/domain/skills.ts)
- [`src/domain/evaluation.ts`](../src/domain/evaluation.ts)

## Core Types

### `ExerciseSpec`

`ExerciseSpec` describes one official TestDaF task type.

It includes:

- id
- section
- order
- official label
- prompt path
- response kind
- input modality
- timing
- communicative goal
- rubric criteria
- related skill tags

This type is the backbone of the exercise catalog.

### `ExerciseInstance`

`ExerciseInstance` is a concrete practice item generated for a learner.

You can think of it like this:

- `ExerciseSpec` = the template
- `ExerciseInstance` = the actual generated exercise

An instance includes:

- title
- instructions
- materials
- questions
- answer constraints
- originality checklist

### `AttemptArtifact`

`AttemptArtifact` represents what the learner submitted.

Depending on the task, that can include:

- selected options
- free text
- field-based answers
- transcript
- metadata

### `EvaluationReport`

This is one of the most important objects in the system.

It contains:

- overall score
- estimated TDN tendency
- confidence
- criterion scores
- strengths
- weaknesses
- recurring errors
- next actions
- provider trace

This object is what connects AI evaluation with learner adaptation.

### `CriterionScore`

Each `EvaluationReport` contains multiple `CriterionScore` objects.

A criterion score answers:

- what criterion was judged?
- what score was given?
- what band from 1 to 5 does it imply?
- what rationale supports it?
- what skills does it relate to?

### `SkillNode`

`SkillNode` represents one tracked learner skill.

Important fields:

- `level`: current estimated level from 1 to 5
- `confidence`: how sure the system is
- `evidenceCount`: how much supporting evidence exists
- `decay`: how much this skill should come back into practice rotation

This helps the system make more intelligent recommendations than a simple checklist.

### `SkillDelta`

`SkillDelta` records a change in a skill after new evidence is applied.

This is useful because it makes the learner model more explainable.

### `StudyPlanItem`

This represents one recommendation in the learner’s next study plan.

It includes:

- a title
- the reason for the recommendation
- related exercise ids
- related prompt ids
- focus skills
- recommended mode

## Official Exercise Catalog

The file [`src/domain/testdaf.ts`](../src/domain/testdaf.ts) exports:

- `OFFICIAL_SOURCES`
- `TESTDAF_EXERCISES`
- `SECTION_DURATIONS`
- `getExerciseSpec`
- `getExercisesBySection`
- `getOfficialExerciseSequence`

This is the source of truth for the digital TestDaF structure inside the project.

## Skill Graph Logic

The file [`src/domain/skills.ts`](../src/domain/skills.ts) handles:

- default learner state
- evidence extraction from evaluation reports
- skill graph updates
- study plan generation
- section trend estimation

Important functions:

- `createDefaultSkillGraph`
- `extractEvidence`
- `applyEvidenceToSkillGraph`
- `buildLearnerState`
- `rankWeakSkills`
- `buildStudyPlanItems`

## Evaluation Helpers

The file [`src/domain/evaluation.ts`](../src/domain/evaluation.ts) contains small but important helpers:

- clamp score values
- convert score 0..1 into band 1..5
- estimate TDN tendency

These functions are not “smart AI logic”. They are stable utility logic that makes the outputs easier to interpret.

## Practical Advice

If you change domain types:

- check whether `agents/` still compiles
- check whether the prompt catalog still matches the data
- check whether tests still make sense

In this project, a small domain change can ripple across many layers, so this is one of the most important places to edit carefully.

