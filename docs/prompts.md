# Prompt System

This document explains how prompts are organized in the project.

## Where Prompt Text Lives

The actual prompt files live in [`prompts/`](../prompts).

The TypeScript metadata for those prompts lives in [`src/prompts/catalog.ts`](../src/prompts/catalog.ts).

## Why The Prompt System Is Split

The project separates prompt content into three families:

### 1. Shared Blocks

Folder:

- [`prompts/shared/`](../prompts/shared)

These are reusable rules that many prompt packs depend on.

Examples:

- tutor style
- evaluator behavior
- JSON output policy
- originality guardrails

### 2. TestDaF Task Packs

Folder:

- [`prompts/testdaf/`](../prompts/testdaf)

These are prompt packs tied to the official structure of the digital TestDaF.

There is one pack per official task type.

This is important because “Schreiben” is not one thing, and “Sprechen” is not one thing. Each Aufgabe has its own structure and communicative goal.

### 3. Training Prompts

Folder:

- [`prompts/training/`](../prompts/training)

These prompts are for skill building outside strict exam format.

Examples:

- grammar remediation
- grammar micro-cycle
- skill remediation
- transfer and reflection

## Prompt Metadata In Code

The file [`src/prompts/catalog.ts`](../src/prompts/catalog.ts) gives the application a typed way to talk about prompts.

It exports:

- `SHARED_PROMPT_BLOCKS`
- `TESTDAF_PROMPT_PACKS`
- `TRAINING_PROMPT_PACKS`
- `PROMPT_PACKS`
- `getPromptPack`

This means the app does not need to guess which prompt exists. It can look it up safely.

## What A Prompt Pack Should Do

A prompt pack in this project should make these things clear:

- what the prompt is for
- what kind of input it expects
- what kind of output it should return
- how to behave in generation mode
- how to behave in evaluation mode
- how to behave in feedback mode
- what skills it should affect
- how to avoid copying official content

## Design Principles

### Prompts should be composable

Instead of repeating the same guidance in 23 files, shared rules are moved into reusable prompt blocks.

### Prompts should be structured

The future UI should depend on structured outputs, not on parsing paragraphs of prose.

### Prompts should be faithful but original

The system should imitate the public task structure, not reproduce official materials.

## Good Future Improvements

Useful next steps for the prompt layer would be:

- define explicit JSON schemas per output type
- add prompt linting or validation
- add prompt snapshots in tests
- add versioning for prompt packs
- add calibration notes per provider

