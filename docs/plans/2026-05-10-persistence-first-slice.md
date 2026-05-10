# Persistence First Slice Implementation Roadmap

> **For the Implementation Engineer:** implement this as a persistence seam first, not as a broad database rewrite. Keep the current demo fallback path working without auth, API keys, or a database.

**Goal:** Persist the first learner evidence loop: learner profile -> attempt -> evaluation -> evidence records -> skill snapshot -> mistake patterns.

**Architecture:** Add a small repository port at the application-service boundary, then provide a server-only demo/local adapter. The core domain stays provider-agnostic, UI components continue to consume view models, and `lib/mock-data/demo.ts` remains the fallback data source when persistence is disabled or unavailable.

**Tech stack for the first slice:** TypeScript, existing Next.js server actions, existing domain types, `fs/promises` for an opt-in local JSON adapter if needed. Do not add Drizzle/Postgres in this first card unless a human explicitly approves auth, retention, and deployment storage decisions.

---

## Source files read

- `README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/codebase-tour.md`
- `docs/server-data-flow.md`
- `docs/domain-model.md`
- `docs/workflows.md`
- `docs/agents.md`
- `docs/getting-started.md`
- `docs/testing.md`
- `docs/providers.md`
- `docs/testdaf-digital-research.md`
- `docs/tabla-maestra-grammar.md`
- `docs/grammar-sections.md`
- `docs/adaptive-learning-loop-next-slice.md`
- `docs/grammar-remediation-slices.md`
- `docs/practice-ux-guided-tutor-plan.md`
- `docs/testdaf-fidelity-v1-review.md`
- `docs/minimax-m27-provider-prompt-audit.md`
- `src/domain/types.ts`
- `src/domain/evaluation.ts`
- `src/domain/skills.ts`
- `src/domain/testdaf.ts`
- `src/api/actions.ts`
- `src/agents/exercise-evaluator.ts`
- `src/agents/skill-profiler.ts`
- `src/agents/study-planner.ts`
- `src/agents/grammar-trainer.ts`
- `lib/server/app-service.ts`
- `lib/server/page-data.ts`
- `lib/server/env.ts`
- `lib/server/provider-router.ts`
- `lib/server/openai-compatible-provider.ts`
- `app/workspace/actions.ts`
- `lib/mock-data/demo.ts`
- `lib/workspace-context.ts`
- `lib/mappers/types.ts`
- `lib/mappers/dashboard-to-view-model.ts`
- `lib/mappers/mistake-notebook-to-view-model.ts`
- `lib/mappers/mock-results-to-view-model.ts`
- `tests/env.test.ts`
- `tests/provider-router.test.ts`
- `tests/mappers.test.ts`
- `tests/workspace-view-model.test.ts`
- `package.json`

## Current behavior

- The app has no database, auth, persistent learner sessions, or storage-backed mock results.
- `lib/mock-data/demo.ts` seeds demo evaluations, notebook entries, activity, and a derived learner skill graph.
- `lib/server/page-data.ts` builds every page from the demo learner id in `APP_DEMO_USER_ID` and from in-memory/core service calls.
- `app/workspace/actions.ts` creates an `AttemptArtifact` on submit, evaluates it, builds feedback, and returns a UI result. The attempt, evaluation, and skill changes are not saved.
- Mock submissions intentionally return deferred feedback and do not yet accumulate a section/full-mock result.
- Grammar and mistake workspaces use reflection mode; they do not behave like official TestDaF evaluation flows.
- Provider routing already preserves fallback behavior: live MiniMax-M2.7 is optional, and invalid/missing provider output returns structured fallback data.

## Proposed change

Implement the first persistence slice as a server-only repository seam with a safe default:

```text
workspace submit
  -> evaluate attempt through live MiniMax-M2.7 or fallback
  -> build feedback
  -> record learning event through repository port
  -> derive learner state and mistake notebook from saved evidence when enabled
  -> fall back to current demo data when disabled or on save/load failure
```

This is deliberately smaller than “add full accounts and production DB.” It gives future auth/Postgres work a clean interface without forcing UI components, mappers, agents, or provider code to know about storage.

## Learning rationale

Persistence should store evidence, not just answers. The value for the learner is that each evaluated attempt can update:

- the skill graph (`SkillNode` and `SkillDelta` evidence);
- the recent evaluation list;
- the mistake notebook;
- the next practice recommendation.

The persistence layer should therefore preserve the same learning loop defined in `docs/adaptive-learning-loop-next-slice.md`: attempt -> evaluation evidence -> skill graph update -> mistake candidate -> next recommendation.

## TestDaF and grammar impact

- Store `estimatedTdn` only as an estimated training tendency. Do not introduce fields named `officialScore`, `predictedScore`, or `tdnAchieved`.
- Keep TestDaF-format practice attempts separate from grammar remediation and mistake repair records.
- Mock mode may save pending attempts, but must keep feedback deferred until a later mock-results slice implements aggregate review.
- Hoeren and Sprechen responses are still text-first in v1; treat transcripts as sensitive learner text if persisted.
- Grammar remediation records should link to grammar slice/skill ids and transfer prompts, not claim to be official exam attempts.

## MiniMax/provider impact

No provider changes are required.

Persistence consumes `EvaluationReport` after `evaluateAttempt` returns, whether the report came from live MiniMax-M2.7 or local fallback. Store only safe provider metadata already present in `providerTrace`:

- `mode`
- `providerId`
- `model`

Do **not** store API keys, raw env values, provider request bodies, raw provider text, or debug logs in the persistence records.

## First-slice data contract

Create a small persistence contract rather than importing database code throughout the app.

Recommended new file:

- `src/api/learning-repository.ts`

Suggested types:

```ts
export interface LearnerProfileRecord {
  userId: string;
  preferredMode: SessionMode;
  targetSections?: SectionId[];
  createdAt: string;
  updatedAt: string;
}

export interface PersistedAttemptRecord {
  attempt: AttemptArtifact;
  sessionId?: string;
  variant: "exercise" | "grammar" | "mistake" | "mock";
  postSubmitMode: "immediate_feedback" | "deferred" | "reflection";
  responseKind: ResponseKind | "reflection";
  createdAt: string;
}

export interface PersistedEvaluationRecord {
  attemptId: string;
  report: EvaluationReport;
  createdAt: string;
}

export interface PersistedEvidenceRecord extends EvidenceRecord {
  attemptId: string;
  evaluationId: string;
}

export interface PersistedSkillSnapshot {
  userId: string;
  skillGraph: SkillNode[];
  updatedAt: string;
}

export interface PersistedMistakePattern {
  id: string;
  userId: string;
  title: string;
  category: "grammar" | "task" | "discourse" | "lexicon" | "strategy";
  observedProblem: string;
  suggestedCorrection: string;
  explanation: string;
  linkedSkill: SkillTag;
  sourceAttemptIds: string[];
  evidenceCount: number;
  status: "open" | "improving" | "resolved";
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface LearningRepository {
  getOrCreateLearner(userId: string): Promise<LearnerProfileRecord>;
  loadLearnerState(userId: string): Promise<LearnerState | null>;
  listRecentEvaluations(userId: string, limit: number): Promise<EvaluationReport[]>;
  listMistakePatterns(userId: string): Promise<PersistedMistakePattern[]>;
  recordEvaluatedAttempt(input: {
    attempt: AttemptArtifact;
    evaluation: EvaluationReport;
    learnerStateBefore: LearnerState;
    variant: PersistedAttemptRecord["variant"];
    postSubmitMode: PersistedAttemptRecord["postSubmitMode"];
    responseKind: PersistedAttemptRecord["responseKind"];
  }): Promise<{
    learnerState: LearnerState;
    evidence: PersistedEvidenceRecord[];
    mistakePatterns: PersistedMistakePattern[];
  }>;
  recordPendingAttempt(input: {
    attempt: AttemptArtifact;
    variant: "mock";
    postSubmitMode: "deferred";
    responseKind: ResponseKind;
  }): Promise<void>;
  recordReflection(input: {
    userId: string;
    source: "grammar" | "mistake";
    slug: string;
    text: string;
    linkedSkill?: string;
    createdAt: string;
  }): Promise<void>;
}
```

Keep this contract small. A later database adapter can implement the same interface with Drizzle/Postgres after auth and retention rules are approved.

## Storage adapters

### Adapter 1: disabled/demo adapter

Files:

- create `lib/server/learning-repository.ts`
- optionally create `lib/server/learning-repository-demo.ts`

Behavior:

- Default mode.
- `loadLearnerState()` returns `null` so existing demo builders remain the source of truth.
- `recordEvaluatedAttempt()`, `recordPendingAttempt()`, and `recordReflection()` are no-ops or return derived in-memory results without persisting.
- This preserves current behavior on public preview and local fallback mode.

### Adapter 2: opt-in local JSON adapter

Files:

- create `lib/server/learning-repository-local-json.ts`
- store records under a non-public data directory such as `.dafinitiv-data/learning-records.json`

Environment shape:

```text
APP_PERSISTENCE_MODE=demo | local_json
APP_LOCAL_PERSISTENCE_DIR=.dafinitiv-data
APP_STORE_RAW_ATTEMPTS=false
```

Rules:

- Default must be `demo`.
- The adapter must be server-only and never imported by client components.
- If `APP_STORE_RAW_ATTEMPTS=false`, store response lengths, selected options, field keys, and mistake summaries, but omit raw productive text/transcripts.
- If local JSON load/save fails, log safe metadata only and fall back to demo behavior.
- Do not enable `local_json` on a public unauthenticated preview without explicit human approval.

## Concrete implementation plan

### Task 1: Add repository contract

**Objective:** Define the storage port without adding a database dependency.

**Files:**

- Create `src/api/learning-repository.ts`
- Modify `src/api/actions.ts`

**Steps:**

1. Add the `LearningRepository` contract and record types.
2. Add an optional second argument to `createApplicationService(providerRouter, repository?)`.
3. Keep the existing one-argument call path working.
4. Add service methods:
   - `loadLearnerState(userId)`
   - `recordEvaluatedAttempt(input)`
   - `recordPendingAttempt(input)`
   - `recordReflection(input)`
5. If no repository is provided, return `null`/no-op behavior.

**Acceptance criteria:**

- Current callers of `createApplicationService(providerRouter)` still compile.
- No UI, mapper, or provider file imports storage internals.
- No behavior changes when no repository is installed.

### Task 2: Implement demo/no-op repository

**Objective:** Preserve current demo fallback while giving the service a real repository object.

**Files:**

- Create `lib/server/learning-repository.ts`
- Modify `lib/server/app-service.ts`
- Modify `lib/server/env.ts`
- Add tests in `tests/env.test.ts` if env fields are added.

**Steps:**

1. Parse `APP_PERSISTENCE_MODE` with default `demo`.
2. Create `createLearningRepository(env)`.
3. Return a demo/no-op repository for `demo` mode.
4. Pass it into `createApplicationService(providerBundle.router, repository)`.

**Acceptance criteria:**

- Default env keeps persistence disabled.
- Provider runtime remains independent from persistence mode.
- `MiniMax-M2.7` defaults are unchanged.

### Task 3: Add opt-in local JSON adapter

**Objective:** Provide a real persistence implementation for local development and preview experiments.

**Files:**

- Create `lib/server/learning-repository-local-json.ts`
- Create `tests/learning-repository-local-json.test.ts`

**Steps:**

1. Use `fs/promises` and a write-through JSON file.
2. On first read, initialize empty arrays for learners, attempts, evaluations, evidence records, skill snapshots, mistake patterns, and reflections.
3. Use a simple write queue or per-process mutex to avoid overlapping writes.
4. Derive evidence with `extractEvidence(report)`.
5. Derive the next skill graph with existing `updateLearnerStateFromEvaluation()` or the richer learning-loop function once implemented.
6. Upsert mistake patterns from `report.recurringErrors` and low-scoring criteria.
7. Never store secrets or env values.

**Acceptance criteria:**

- Saving an evaluated attempt creates learner, attempt, evaluation, evidence, skill snapshot, and mistake pattern records.
- Loading learner state after save returns a graph reflecting the evaluation.
- The adapter tolerates a missing file.
- Wrong/corrupt JSON fails safely and does not break page rendering.

### Task 4: Wire evaluated exercise submissions

**Objective:** Persist the primary guided-practice path without changing learner-facing feedback.

**Files:**

- Modify `app/workspace/actions.ts`
- Possibly modify `lib/mappers/types.ts` only if a debug-only persistence status is exposed.

**Steps:**

1. Build the attempt exactly as today.
2. Evaluate through `service.evaluateAttempt()` exactly as today.
3. Build feedback exactly as today.
4. Call `service.recordEvaluatedAttempt()` after evaluation.
5. If persistence throws, catch it and return the normal feedback result.
6. Do not expose storage errors to learners unless there is a neutral debug-only flag.

**Acceptance criteria:**

- Exercise feedback remains available even if persistence is disabled or fails.
- No immediate feedback is added to mock mode.
- No provider behavior changes.

### Task 5: Wire deferred and reflection records without over-scoping

**Objective:** Save non-evaluated user work without pretending it is scored evidence.

**Files:**

- Modify `app/workspace/actions.ts`

**Steps:**

1. For `postSubmitMode === "deferred"`, save a pending mock attempt through `recordPendingAttempt()` and still return the current deferred response.
2. For `postSubmitMode === "reflection"`, save a reflection through `recordReflection()` and still return the current reflection response.
3. Do not create `EvaluationReport` records for reflection-only grammar or mistake work.

**Acceptance criteria:**

- Mock remains deferred.
- Grammar/mistake work remains repair/reflection, not official TestDaF scoring.
- Saved records are clearly typed as pending/reflection rather than evaluated attempts.

### Task 6: Load persisted learner state into page data

**Objective:** Let dashboard, grammar library, notebook, and mock results read stored evidence when enabled.

**Files:**

- Modify `lib/server/page-data.ts`
- Possibly add helpers in `lib/server/learner-state.ts`

**Steps:**

1. Add a helper `getLearnerStateForRequest(env, service)`.
2. Try `service.loadLearnerState(env.APP_DEMO_USER_ID)`.
3. If it returns `null` or throws, fall back to `buildDemoLearnerState(env.APP_DEMO_USER_ID)`.
4. Use the helper in dashboard, section hubs, grammar library, mock setup/results, and workspace generation.
5. Add a similar helper for mistake notebook entries: persisted mistake patterns first, demo notebook entries second.

**Acceptance criteria:**

- Existing screens still render in demo mode.
- Persisted evaluations influence weak skills and study plan when local persistence is enabled.
- Mistake notebook can show persisted patterns without changing the mapper contract too broadly.

### Task 7: Tests

**Objective:** Protect the persistence seam and fallback behavior.

**Files:**

- Create `tests/learning-repository.test.ts` or `tests/learning-repository-local-json.test.ts`
- Update `tests/env.test.ts`
- Add one service-level test if the application service gains persistence methods.

**Test cases:**

- default env sets `APP_PERSISTENCE_MODE` to `demo`;
- no-op repository does not change existing service behavior;
- local JSON repository saves and reloads one evaluated attempt;
- persisted evidence updates the skill graph through existing domain logic;
- recurring errors create/upsert mistake patterns;
- corrupt/missing local JSON falls back safely;
- provider fallback still works independently of persistence mode.

## SQL-shaped future schema

If a later card moves to Postgres/Drizzle, use this shape behind the same repository port:

| Table | Purpose | Notes |
| --- | --- | --- |
| `learners` | one row per learner profile | no auth fields until auth card exists |
| `sessions` | guided/mock session shells | current code already has `Session` domain type |
| `attempts` | submitted artifacts and metadata | raw text retention must be explicit |
| `evaluations` | structured `EvaluationReport` summaries | store `estimated_tdn`, not official score |
| `evidence_records` | one row per skill/criterion observation | derived from `extractEvidence(report)` |
| `skill_snapshots` | current learner skill graph | current-state cache, rebuildable from evidence later |
| `mistake_patterns` | normalized recurring errors | link to source attempts and skill tags |
| `reflections` | grammar/mistake freeform learner notes | not evaluation evidence unless promoted later |

Do not expose this schema to React components. Components should keep using view models.

## Privacy and retention guardrails

- Productive writing, speech transcripts, and mistake examples can contain personal data.
- Do not store raw attempt text by default on a public unauthenticated preview.
- Never store API keys, `.env` values, provider request payloads, raw model output, or secret paths.
- Add deletion/export requirements before real-user launch.
- Add learner consent and account ownership before enabling production persistence.

## Acceptance criteria for the first implementation card

- A new repository port exists and is used only from the application-service/server boundary.
- Default app behavior remains demo fallback with no required database.
- With opt-in local persistence enabled, one evaluated exercise submission can be saved and reloaded into learner state.
- Mistake patterns can be listed from persisted evaluation evidence.
- Mock submissions remain deferred; grammar/mistake submissions remain reflection mode.
- `MiniMax-M2.7` remains the live model target.
- No secrets or env values are persisted or logged.
- Tests cover persistence enabled, persistence disabled, and persistence failure fallback.

## Verification plan

For the implementation card, run:

```bash
npm run typecheck
npm run test
npm run build:web
```

Manual smoke checks:

- `/` shows the existing demo dashboard when persistence is disabled.
- `/workspace/exercise/03-multiple-choice?from=dashboard` still evaluates and returns feedback.
- `/mistake-notebook` shows demo entries when no persisted patterns exist.
- `/workspace/mock/full?from=mock_setup` still returns deferred feedback.
- `/grammar-library` and `/workspace/grammar/grammar-focus` remain remediation/reflection flows.

Optional local persistence smoke:

1. Enable local persistence with non-secret env flags.
2. Submit one guided exercise.
3. Restart the app.
4. Confirm the dashboard/notebook can reflect the saved evidence.
5. Disable persistence and confirm the app returns to demo fallback.

## Open questions

- Which production store should be approved first: Postgres/Drizzle, hosted database, or a managed serverless store?
- Should raw learner writing/transcripts be stored at all before auth and consent exist?
- What deletion/export policy is needed before public learner accounts?
- Should mock mode persist each task immediately, or only commit a completed section/full mock?
- How should repeated grammar-slice evidence merge with mistake notebook patterns once `grammar-slices.ts` exists?

## Next recommended card

**Title:** Implement persistence seam with demo/no-op repository and opt-in local JSON adapter

**Owner:** Dafinitiv Implementation Engineer

**Deliverable:** Add `src/api/learning-repository.ts`, `lib/server/learning-repository*.ts`, env parsing for `APP_PERSISTENCE_MODE`, service persistence methods, and tests for disabled/enabled/failure paths. Wire only the evaluated workspace submission path first; leave production DB/auth for a later approved card.
