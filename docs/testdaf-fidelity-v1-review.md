# TestDaF Fidelity v1 Review

## Scope

This review checks the current v1 surfaces that matter for digital TestDaF honesty:

- 23-task catalog coverage
- section hub framing
- mock-practice sequence and timing boundaries
- TDN / score-estimate wording
- separation between exam-format practice and remediation

It is a product fidelity artifact, not an official TestDaF validation.

## Evidence checked

Automated catalog check on `src/domain/testdaf.ts`:

| Area | Result |
| --- | ---: |
| Lesen task specs | 7 |
| Hören task specs | 7 |
| Schreiben task specs | 2 |
| Sprechen task specs | 7 |
| Total task specs | 23 |
| Prompt paths declared | 23 |
| Missing prompt files | 0 |
| Section duration total | 190 minutes |

The section duration model is internally consistent: 55 + 40 + 60 + 35 = 190 minutes.

## Fidelity findings

### 1. Task taxonomy coverage is strong

`src/domain/testdaf.ts` models the expected 7/7/2/7 distribution and keeps each task tied to:

- an official-style label;
- fixed section order;
- timing metadata;
- response kind;
- modality expectations;
- support level;
- rubric criteria;
- skill tags;
- source notes.

This is the right backbone for a digital TestDaF trainer. The prompt library also has one prompt file per declared task path, so the catalog is not just theoretical.

### 2. Hören and Sprechen are honest enough, but the wording should stay explicit

The app correctly marks most Hören and Sprechen tasks as `strategy_first`, while Lesen and Schreiben are largely `fully_supported`. The section hub copy also says Hören/Sprechen are text-first in v1.

Keep this boundary visible wherever learners enter these modes:

> v1 simulates task structure, sequence, strategy, and written/transcript-based responses. It does not yet reproduce the full audio/video recording conditions of the official digital TestDaF.

This protects the product from overclaiming while still giving useful practice.

### 3. Mock flow preserves the macro order and deferred feedback principle

`src/agents/mock-exam-runner.ts` builds the mock order as:

1. Lesen
2. Hören
3. Schreiben
4. Sprechen

It also includes rules for no backtracking, delayed feedback, and original material only. That matches the product boundary in `docs/testdaf-digital-research.md`.

One limitation: the current mock plan is a high-level plan, not a fully enforced proctoring/timer engine. It should be described as a simulation shell / mock-practice mode until the UI enforces section-level locking, timers, media playback, recording, and end-to-end persistence.

### 4. TDN language needs tightening before learner-facing claims expand

The underlying type is named `estimatedTdn`, and `prompts/shared/evaluator-core.md` says not to claim official certification or official scoring authority. Good.

Risky learner-facing spots:

- `src/agents/feedback-coach.ts` uses `headline: spec.officialLabel + ": " + report.estimatedTdn.toUpperCase()`. This can read like a result label rather than a training estimate.
- `lib/mappers/mock-results-to-view-model.ts` hard-codes `headline: "TDN 4 erreicht."`, `Global Rank: Top 8%`, and a gap-to-TDN-5 bridge. This overstates certainty for v1, especially with demo/fallback data and text-first Hören/Sprechen.

Recommended wording standard:

- Use **"TDN-Tendenz"**, **"geschätzte TDN-Spanne"**, or **"Trainingsindiz"**.
- Avoid **"TDN erreicht"**, **"official score"**, **"prediction"**, global rank, or exact threshold claims.
- Add confidence labels when provider mode is fallback or when audio/video is simulated text-first.

Safer examples:

- `Geschätzte TDN-Tendenz: TDN 4`
- `Trainingsprofil deutet aktuell auf TDN-4-Nähe hin.`
- `Kein offizielles Testergebnis; nur eine pädagogische Einschätzung aus dieser Übung.`

### 5. Exam practice vs remediation is mostly separated

The architecture separates workspace variants:

- `exercise` for official-style TestDaF practice;
- `mock` for stricter exam chrome and delayed feedback;
- `grammar` for targeted remediation;
- `mistake` for recurring-error review.

This is the right separation. The main guardrail is copy discipline: grammar remediation should be framed as transfer support, not as official task practice.

## Acceptance criteria for a follow-up implementation card

A good next implementation card should be small and verifiable:

1. Replace hard-coded mock-result overclaims with estimate language.
2. Replace feedback headline `TDN_4` style labels with learner-friendly `Geschätzte TDN-Tendenz: TDN 4` wording.
3. Add a short disclaimer near mock results: no official TestDaF score prediction, especially in fallback/text-first mode.
4. Keep MiniMax-M2.7 provider defaults unchanged.
5. Preserve demo fallback behavior and existing mock navigation.
6. Run `npm run verify` after the copy/code changes.

## Recommended next Multica card

**Title:** Tighten TDN estimate and mock-results wording

**Owner:** Implementation Engineer, with QA & Safety Reviewer review

**Deliverable:** Update `src/agents/feedback-coach.ts`, `lib/mappers/mock-results-to-view-model.ts`, and the mock results UI copy if needed so all TDN language is explicitly pedagogical/estimated and no global-rank or official-threshold claims remain.

**Review focus:** Ensure the UI still motivates learners without implying official TestDaF score prediction.
