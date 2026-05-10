# MiniMax-M2.7 Provider and Prompt Audit

## Scope

This audit covers the current live-provider path for DaF Focus and the prompt contracts that make MiniMax-backed tutor behavior useful, structured, and safe.

Primary goal: keep the live path aligned with `MiniMax-M2.7`, while preserving demo fallback behavior for local development and provider failures.

## Files reviewed

- `README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/providers.md`
- `docs/prompts.md`
- `lib/server/env.ts`
- `lib/server/provider-router.ts`
- `lib/server/openai-compatible-provider.ts`
- `src/providers/types.ts`
- `src/providers/minimax.ts`
- `src/agents/exercise-generator.ts`
- `src/agents/exercise-evaluator.ts`
- `src/agents/feedback-coach.ts`
- `src/agents/grammar-trainer.ts`
- `prompts/shared/json-policy.md`
- `prompts/shared/tutor-core.md`
- `prompts/shared/originality-guardrails.md`
- `prompts/training/grammar/grammar-remediation.md`
- `tests/env.test.ts`
- `tests/provider-router.test.ts`

Secret-bearing files were not opened or copied. Search results showed local `.env` contains provider configuration, but this audit intentionally avoids reading credential values.

## Current state

### Provider direction is correct

The web runtime defaults already point to MiniMax-M2.7:

- `lib/server/env.ts` defaults `OPENAI_MODEL` to `MiniMax-M2.7`.
- `README.md` and `.env.example` document `MiniMax-M2.7` as the model target.
- `tests/env.test.ts` and `tests/provider-router.test.ts` lock the default/live configuration to `MiniMax-M2.7`.
- `lib/server/provider-router.ts` creates the live provider only when live mode is enabled and the required env values are present.

No reviewed source or documentation path should be changed back to MiniMax-M2.5.

### Fallback behavior is intentionally preserved

The app remains usable without live provider access:

- `APP_ENABLE_REAL_LLM=false` keeps the app in demo fallback mode.
- missing API keys keep the app in fallback mode.
- invalid JSON in `lib/server/openai-compatible-provider.ts` returns the request fallback.
- provider exceptions return the request fallback.
- agent-level fallback structures exist for exercise generation and evaluation.

This is the right behavior for demos, local development, and resilience during provider instability.

### Prompt structure exists, but live-provider instructions are still thin

The prompt library has the right building blocks:

- JSON-only policy
- TestDaF tutor tone
- originality guardrails
- separate exam-format and training/remediation prompt families

However, the live `StructuredGenerationRequest` currently passes short references such as “Use prompt pack ... and shared blocks ...” rather than the full prompt-pack text. That means MiniMax-M2.7 may not actually receive the detailed Markdown instructions unless a later loader is added.

## Learning and TestDaF assumptions

- Generated TestDaF practice should be structurally faithful, not official or copied.
- Exam-format practice and grammar remediation are separate learning modes:
  - exam tasks should preserve section/task constraints and deferred feedback where relevant;
  - grammar remediation should focus on targeted explanation, drill, correction, and transfer.
- TDN labels in the current system should be treated as approximate tutoring signals, not official TestDaF score predictions.
- Text-first Hoeren/Sprechen remains acceptable for v1 as long as the app signals acoustic/oral limitations honestly.

## Findings

### 1. MiniMax-M2.7 lock is present but not centralized enough

**Evidence**

- Model defaults are repeated in env, docs, examples, and tests.
- Tests check the M2.7 default.

**Risk**

A future edit could update docs or env defaults inconsistently.

**Recommendation**

Add a small provider constants module in a future implementation card, for example:

- `lib/server/provider-defaults.ts`
- exported `DEFAULT_MINIMAX_BASE_URL`
- exported `DEFAULT_MINIMAX_MODEL = "MiniMax-M2.7"`

Then use those constants in env parsing and tests. Docs can still show literal examples, but source defaults should not be duplicated.

### 2. JSON fallback handling is safe, but schema validation is missing

**Evidence**

- `response_format: { type: "json_object" }` requests JSON.
- `JSON.parse(rawText)` catches invalid JSON and falls back.
- `jsonSchemaName` exists on the request type but is not used to validate parsed content.

**Risk**

MiniMax can return syntactically valid JSON with missing fields or wrong shapes. That would bypass parse fallback and may leak malformed content into UI/domain logic.

**Recommendation**

Introduce schema-level validation at provider or agent boundary:

1. Map `jsonSchemaName` to a Zod schema.
2. Parse JSON.
3. Validate the parsed object.
4. If validation fails, return fallback with `usedFallback: true` and a non-secret `errorMessage` such as `Provider JSON failed schema validation.`

### 3. Prompt references are not enough for live model quality

**Evidence**

- `src/agents/exercise-generator.ts` builds a system prompt that names the prompt pack path and shared blocks.
- `src/agents/exercise-evaluator.ts` similarly names prompt/shared blocks.
- The actual Markdown prompt text lives in `prompts/`.

**Risk**

MiniMax-M2.7 receives metadata-like instructions instead of the detailed rules needed for originality, JSON shape, exam fidelity, and tutor tone.

**Recommendation**

Add a prompt resolver step before live provider calls:

- load prompt pack content and shared block content at build/runtime through a safe catalog;
- compose these into `systemPrompt`;
- keep `userPrompt` focused on learner/task-specific inputs;
- test with a snapshot-like assertion that JSON policy and originality guardrails are included in generation/evaluation requests.

### 4. Tutor tone and score wording need tighter guardrails

**Evidence**

- `prompts/shared/tutor-core.md` asks for practical, motivating German tutor behavior.
- `src/agents/feedback-coach.ts` uses `estimatedTdn` in the headline and user-facing feedback.
- `src/agents/exercise-evaluator.ts` labels fallback output as local fallback, but the learner-facing copy can still sound score-like.

**Risk**

Learners may overread an estimated TDN as an official TestDaF prediction.

**Recommendation**

Future copy/prompt update:

- use “TDN-Tendenz” or “ungefähre TDN-Tendenz” in learner-facing strings;
- add “keine offizielle TestDaF-Bewertung” language to evaluator/feedback prompts;
- keep official exam fidelity separate from training/remediation explanations.

### 5. Demo fallback should remain the default development mode

**Evidence**

- README and env tests confirm fallback default.
- `createFallbackProviderAdapter()` returns structured fallback content.

**Risk**

A future live-provider hardening change could accidentally require an API key to use the app.

**Recommendation**

Keep the existing fallback tests and add one regression test for invalid JSON fallback at the OpenAI-compatible adapter boundary using a mocked client or test seam.

## Proposed implementation sequence

### Card A: Centralize MiniMax-M2.7 defaults

Owner: Implementation Engineer

Deliverables:

- source-level constants for MiniMax base URL/model;
- env parsing updated to use constants;
- tests updated to assert `MiniMax-M2.7` through the constant-backed path;
- no changes to demo fallback behavior.

Acceptance criteria:

- `npm run test` passes;
- no `MiniMax-M2.5` references appear in source/docs unless explicitly historical;
- live mode still requires `APP_ENABLE_REAL_LLM=true` and an API key.

### Card B: Add schema validation for provider JSON

Owner: Implementation Engineer, reviewed by QA & Safety Reviewer

Deliverables:

- schema map for `ExerciseInstance` and `EvaluationReport` at minimum;
- validation failure returns fallback with `usedFallback: true`;
- tests for invalid JSON and valid-but-wrong-shape JSON;
- no raw provider output or secrets in debug logs.

Acceptance criteria:

- invalid JSON and wrong-shape JSON both fall back safely;
- valid structured output still passes through;
- debug output remains non-secret.

### Card C: Resolve full prompt text into MiniMax requests

Owner: MiniMax Tutor Prompt Engineer + Implementation Engineer

Deliverables:

- prompt resolver that composes shared blocks and prompt pack Markdown;
- generation/evaluation requests include JSON policy, originality guardrails, and task-specific prompt text;
- tests/snapshots proving prompt composition for one exercise and one evaluation path.

Acceptance criteria:

- MiniMax receives actual guardrail text, not only file/path names;
- exam task prompts remain separate from grammar remediation prompts;
- fallback output remains unchanged when live mode is disabled.

### Card D: Tighten learner-facing TDN copy

Owner: MiniMax Tutor Prompt Engineer, reviewed by TestDaF Exam Architect

Deliverables:

- feedback copy uses approximate/non-official score wording;
- evaluator prompt asks for evidence-based formative feedback, not official score claims;
- German learner-facing tone remains concise and actionable.

Acceptance criteria:

- user-facing copy avoids “official prediction” implication;
- TestDaF task structure remains distinct from grammar remediation;
- productive feedback still tells the learner what to do next.

## Verification checklist for future live-provider work

- `npm run test`
- `npm run typecheck`
- fallback mode smoke test with `APP_ENABLE_REAL_LLM=false`
- live mode smoke test with MiniMax-M2.7 configured, without logging secrets
- invalid JSON / wrong schema fallback test
- prompt composition assertion for JSON policy + originality guardrails
- manual check that learner-facing score language is non-official

## MiniMax/provider impact

No live provider code was changed in this audit. The current path is compatible with MiniMax-M2.7 and protected by fallback behavior, but it should be hardened before relying on live outputs for learner-facing generation/evaluation.

Highest-impact next improvement: schema validation after `JSON.parse`, because it prevents valid-but-malformed provider JSON from entering the product.
