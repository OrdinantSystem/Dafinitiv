# Adaptive learning loop next slice

## Purpose

This slice turns one evaluated attempt into a visible learning loop:

```text
attempt
  -> evaluation evidence
  -> skill graph update
  -> mistake notebook entry
  -> grammar or exam remediation choice
  -> one next practice recommendation
```

The current code already has the pieces: `EvaluationReport`, `EvidenceRecord`, `SkillNode`, `StudyPlanItem`, `skill-profiler`, `grammar-trainer`, and `study-planner`. The missing product slice is the handoff between them. After the learner submits work, the app should say what changed, what mistake pattern was captured, and why the next activity is either grammar remediation, mistake review, or another TestDaF-format task.

## Current state used for this plan

- `src/domain/types.ts` already models attempts, evaluation reports, evidence records, skill graph nodes, skill deltas, learner state, coaching feedback, and study-plan items.
- `src/domain/skills.ts` extracts criterion-level evidence and applies it to the skill graph, but the returned deltas are not exposed in `LearnerState` or the workspace response.
- `src/agents/skill-profiler.ts` recomputes the learner state after evaluation, but discards the explanatory deltas from `applyEvidenceToSkillGraph`.
- `src/agents/grammar-trainer.ts` chooses grammar remediation from weak grammar skills only.
- `src/agents/study-planner.ts` returns generic weak-skill study items; it does not yet know whether the newest evidence calls for mistake review, grammar repair, or exam-format practice.
- `lib/mock-data/demo.ts` seeds recent reports and notebook entries, proving the demo loop can stay intact without a database.
- `lib/mappers/mistake-notebook-to-view-model.ts` renders notebook entries as a correction and transfer workflow, not as official exam scoring.

## Product rule

Keep three learning modes separate:

| Mode | When it should trigger | What it should show | What it should not claim |
| --- | --- | --- | --- |
| TestDaF-format practice | The weakest signal is task, section, source mediation, argumentation, reading, listening, writing, or speaking performance | A next official task type, timing reminder, and task-specific rubric focus | Official score prediction |
| Grammar remediation | The weakest signal is a grammar skill that blocks production or comprehension | A short explanation, focused drill, correction, and transfer prompt | A full TestDaF section result |
| Mistake notebook review | The same recurring error or correction pattern appears again | A saved pattern with example, correction, linked skill, and transfer task | A new official attempt unless the learner chooses one |

## Proposed domain additions

Add small types rather than a broad persistence layer in this slice.

```ts
export type LearningLoopRoute = "exam_practice" | "grammar_remediation" | "mistake_review";

export interface MistakePatternCandidate {
  id: string;
  title: string;
  category: "grammar" | "task" | "discourse" | "lexicon" | "strategy";
  observedProblem: string;
  suggestedCorrection: string;
  explanation: string;
  linkedSkill: SkillTag;
  sourceAttemptId: string;
  evidenceCount: number;
}

export interface LearningLoopRecommendation {
  route: LearningLoopRoute;
  headline: string;
  reason: string;
  focusSkills: SkillTag[];
  exerciseIds: ExerciseId[];
  promptIds: string[];
  mistakePatternIds: string[];
  recommendedMode: SessionMode;
}

export interface LearningLoopResult {
  learnerState: LearnerState;
  skillDeltas: SkillDelta[];
  mistakeCandidates: MistakePatternCandidate[];
  recommendation: LearningLoopRecommendation;
}
```

Why this shape:

- `skillDeltas` make adaptation explainable without changing the underlying graph math.
- `MistakePatternCandidate` can be rendered from demo memory now and persisted later.
- `LearningLoopRecommendation` is the single decision object the UI needs after feedback.
- The route enum forces the product to choose between exam practice, grammar remediation, and mistake review instead of blending them.

## Routing logic for the first implementation

Use deterministic logic first. Keep model calls out of the router until there is persistent evidence and enough tests.

1. Build the evaluated learner state with `applyEvidenceToSkillGraph` and keep the `SkillDelta[]`.
2. Collect candidate mistake patterns from:
   - `report.recurringErrors`
   - lowest `CriterionScore` entries
   - linked `skillTags`
   - any known notebook entry with the same linked skill, once persistence exists
3. Pick the recommendation route:
   - `mistake_review` if a recurring error maps to a skill that already has notebook history, or if the same low skill receives repeated evidence in the current recent evaluation window.
   - `grammar_remediation` if the strongest negative delta is in the grammar category and the attempted task was productive or integrated.
   - `exam_practice` otherwise, using the weakest task/section skill and the nearest TestDaF exercise IDs from `getExerciseSpec` metadata.
4. Use `recommendedMode: "guided"` for remediation and next practice. Keep `mock` mode only for explicit mock sessions.
5. Surface estimated TDN only as a tendency from the evaluated report, not as a promise that the learner will receive that official result.

## Concrete implementation plan

### Step 1: Preserve skill deltas

Modify `src/agents/skill-profiler.ts` so it returns both updated learner state and deltas through a new function, while keeping the existing `updateLearnerStateFromEvaluation` API for current callers.

Acceptance criteria:

- Existing callers still compile.
- New tests can assert which skill changed and why.
- Demo fallback behavior is unchanged.

### Step 2: Add the learning-loop domain module

Create `src/domain/learning-loop.ts` with:

- the four types above;
- `buildMistakePatternCandidates(report, deltas)`;
- `chooseLearningLoopRecommendation(input)`;
- small helpers for category routing and safe fallback copy.

Acceptance criteria:

- Pure functions only.
- No provider calls.
- No secret/env access.
- Unit tests cover grammar, mistake, and exam-practice branches.

### Step 3: Add an agent wrapper

Create `src/agents/learning-loop-router.ts` that takes `LearnerState` plus `EvaluationReport` and returns `LearningLoopResult`.

Acceptance criteria:

- The agent delegates math to `src/domain/skills.ts` and routing to `src/domain/learning-loop.ts`.
- It does not generate exercises, write persistence, or call MiniMax.
- It keeps grammar remediation separate from exam-format practice.

### Step 4: Expose the loop from the application service

Add `buildLearningLoopAfterEvaluation(learnerState, report)` to `src/api/actions.ts`.

Acceptance criteria:

- Existing `evaluateAttempt`, `buildFeedback`, `recomputeSkills`, `generateStudyPlan`, and `buildGrammarTrainingBrief` remain available.
- The new API returns the recommendation object without changing current workspace submit behavior.
- This keeps the first implementation safe for a follow-up UI card.

### Step 5: Demo data bridge

Extend `lib/mock-data/demo.ts` with one demo `LearningLoopResult` built from the existing demo reports and notebook entries.

Acceptance criteria:

- The dashboard, grammar library, notebook, and mock results can keep using current demo data.
- The next UI card has realistic data without requiring auth or a database.
- Provider trace remains `MiniMax-M2.7` where demo reports name a model.

### Step 6: Tests

Add focused tests:

- `tests/learning-loop.test.ts`
  - grammar delta routes to `grammar_remediation`;
  - repeated recurring error routes to `mistake_review`;
  - task/source-mediation weakness routes to `exam_practice`;
  - estimated TDN text is not represented as official prediction copy.
- Existing verification:
  - `npm run typecheck`
  - `npm run test`

## UI handoff for the next card

The post-submit workspace result should eventually show a compact "What changed / What next" panel:

```text
What changed
- Source mediation stayed at 2/5, confidence rose from 0.39 to 0.52.
- A recurring pattern was captured: Quellen verdichten.

Next best step
- Mistake review: rewrite one sentence from the source summary, then transfer it into a new Schreiben 2 mini-task.
```

Display rules:

- Show at most two deltas.
- Prefer plain learner language over raw skill ids.
- Link grammar remediation to `/workspace/grammar/...`.
- Link notebook review to `/workspace/mistake/...`.
- Link exam practice to `/workspace/exercise/...`.
- In `mock` workspace variant, keep feedback deferred; do not show this panel inline.

## Persistence roadmap

Do not build the database in this slice, but keep the model ready for it.

Later tables/collections:

- `attempts`: submitted artifacts, session id, exercise id, timestamps.
- `evaluations`: structured report, provider trace, confidence, estimated TDN tendency.
- `evidence_records`: one row per criterion/skill observation.
- `skill_snapshots`: current level, confidence, decay, evidence count.
- `mistake_patterns`: normalized recurring errors with linked skill and examples.
- `recommendations`: chosen route, rationale, accepted/dismissed status.

Retention/privacy note: productive writing and speech transcripts can contain personal data. Persist only what is needed for learning feedback, and add deletion/export paths before a real-user launch.

## MiniMax/provider impact

This slice should not change provider routing. It consumes `EvaluationReport` after either live MiniMax-M2.7 or fallback evaluation has produced structured output.

If a later card asks MiniMax to classify mistake patterns, keep it behind the existing provider abstraction and preserve fallback behavior. Do not rename or revert the live model target from `MiniMax-M2.7`.

## Verification checklist for implementation card

- `npm run typecheck`
- `npm run test`
- Manual demo smoke check:
  - `/workspace/exercise/02-text-und-grafik-zusammenfassen`
  - `/grammar-library`
  - `/mistake-notebook`
  - `/mock-test` to confirm mock mode still defers feedback

## Out of scope

- Auth and real learner accounts.
- Database schema migration.
- Official TestDaF score prediction.
- Real audio scoring for Hoeren/Sprechen.
- Replacing the current MiniMax provider layer.
