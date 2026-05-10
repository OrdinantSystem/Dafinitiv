# Practice UX guided tutor plan

## Purpose

Make the dashboard, grammar library, mistake notebook, workspace, mock setup, and mock results feel like one guided DaF tutor instead of separate destinations.

This is a UX/spec artifact, not a provider or prompt change. It keeps MiniMax-M2.7 as the live-provider target and preserves demo fallback behavior.

## Current read of the product

DaF Focus already has the right structural spine:

1. dashboard recommends a next task from learner state;
2. section hubs expose official TestDaF-style practice;
3. grammar library opens targeted remediation;
4. mistake notebook opens pattern repair;
5. the shared workspace runs exercise, grammar, mistake, and mock variants;
6. mock mode uses stricter chrome and delayed feedback.

The weak point is not architecture. The weak point is learner perception. Several screens use different labels, CTA language, and mental models, so the learner may not feel that one tutor is guiding the loop.

## UX principle

Every practice route should answer the same four learner questions:

```text
Why this?  -> because your profile or last result shows a specific gap
What mode? -> exam practice, grammar remediation, mistake repair, or mock simulation
What do I do now? -> one clear action with timing and expected output
Where next? -> feedback, transfer, or mock follow-up
```

Use this as the cross-screen IA contract.

## Proposed tutor loop

```text
Dashboard / mock results
  -> chooses one priority
  -> opens the right workspace variant
  -> learner works
  -> feedback or deferred result
  -> routes to one of three next moves:
       1. grammar transfer
       2. mistake repair
       3. next official TestDaF-style task
```

### Keep these modes visually and verbally distinct

| Mode | Learner promise | Must not be confused with |
| --- | --- | --- |
| Official practice | "Train this TestDaF task type with feedback." | Grammar lesson |
| Grammar remediation | "Fix the language pattern behind weak answers." | Official exam task |
| Mistake repair | "Rewrite one repeated error and transfer it once." | Full grammar curriculum |
| Mock simulation | "Work under exam-like sequencing; feedback is delayed." | Guided coaching |

## Screen-level changes

### 1. Dashboard: make the next step feel prescribed, not browsed

Current evidence:

- `mapDashboardToViewModel` already maps study-plan items to exercise, grammar, or mistake workspace routes.
- `DashboardOverview` shows recommended loops, study plan, weak skills, and recent activity.

Problem:

The dashboard has a lot of useful information, but it does not quite say: "Here is why this is the next best tutor move."

Recommended UI changes:

- Rename "Recommended Next" to "Nächster Tutor-Schritt".
- Add a small reason strip above the first card:
  - source: weak skill / study plan / mock result / recent mistake;
  - mode: `TestDaF-Aufgabe`, `Grammatik-Transfer`, `Fehlermuster`, or `Mock`;
  - expected output: selection, short answer, essay, reflection.
- Make the first CTA deterministic: `Jetzt trainieren`, `Grammatik sichern`, `Fehler reparieren`, or `Mock starten`, based on the target route.
- Change weak-skill copy from abstract confidence language to action language:
  - current style: "Vertrauenswert 0.72..."
  - proposed: "3 Nachweise, noch instabil. Nächster Schritt: kurze Transferaufgabe."

Acceptance criteria:

- A learner can tell in 5 seconds why the first recommendation is shown.
- The first card names exactly one mode and one output type.
- No official-score prediction language appears on the dashboard.

### 2. Grammar library: separate curriculum browsing from remediation priority

Current evidence:

- `mapGrammarLibraryToViewModel` builds a featured recommendation from weak grammar skills.
- `GrammarLibraryScreen` mixes a featured recommendation, secondary cards, curriculum groups, filters, and a pulse card.

Problem:

The grammar library is both a curriculum map and a remediation launcher. That is good, but the current page treats both with similar visual weight.

Recommended UI changes:

- Split the page into two labeled regions:
  1. `Heute reparieren` for adaptive remediation;
  2. `Bibliothek durchsuchen` for curriculum exploration.
- In the featured recommendation, show a three-step micro-flow:
  `Erkennen -> Formen -> In TestDaF-Satz übertragen`.
- Change CTA from generic `Praxis starten` to `Remediation starten` or `Transferübung starten`.
- Add a small note: "Diese Übung ist kein TestDaF-Aufgabentyp. Sie bereitet den Transfer in eine Aufgabe vor."

Acceptance criteria:

- Grammar remediation is explicitly not presented as official exam-format practice.
- Every featured grammar card has a follow-up link back into an official practice workspace.
- Skill IDs can remain internal in data, but visible labels should stay learner-readable.

### 3. Mistake notebook: turn errors into a repair ritual

Current evidence:

- `mapMistakeNotebookToViewModel` opens entries through `buildMistakeWorkspaceHref`.
- `MistakeNotebookScreen` shows wrong form, corrected form, explanation, and practice CTAs.
- `mapMistakeWorkspaceToViewModel` asks the learner to produce a new correct example.

Problem:

The notebook already has strong material, but CTAs and labels feel like analytics/product language rather than a tutor-led correction loop.

Recommended UI changes:

- Use a consistent 4-step mistake card:
  1. `Fehler gesehen`
  2. `Korrektur verstanden`
  3. `Neue Version schreiben`
  4. `In Aufgabe übertragen`
- Replace English labels where they are learner-facing:
  - `Incorrect Form` -> `Fehler`
  - `Corrected Form` -> `Korrektur`
  - `Rule / Explanation` -> `Warum es falsch war`
  - `Start Practice` -> `Fehler reparieren`
  - `Recommended Practice` -> `In Aufgabe übertragen`
- Add a lightweight severity/frequency label only if it informs action, e.g. `6x diese Woche -> zuerst reparieren`.

Acceptance criteria:

- Every notebook entry has a visible repair action and a transfer action.
- Mistake repair remains short and specific, not a full grammar lesson.
- The screen avoids gamified claims like global rank or official readiness.

### 4. Shared workspace: expose the same tutor frame in every variant

Current evidence:

- `WorkspaceViewModel` already has `variant`, `mode`, `postSubmitMode`, `contextLabel`, `agentLabel`, `resolvedFrom`, `generation`, and `postSubmitOptions`.
- `WorkspaceScreen` shows framing pills and metadata.
- `WorkspaceClient` handles ready state, response fields, submitted preview, result panel, and sticky composer.
- Exercise and mock variants generate on Ready. Grammar and mistake variants are local/not-applicable generation.

Problem:

The shared route is the best place to make the product feel coherent, but the current UI duplicates context in many chips and does not foreground the mode contract.

Recommended UI changes:

- Add a compact `Tutor frame` component near the top of the workspace:
  - `Quelle`: Dashboard / Grammar Library / Mistake Notebook / Mock Results;
  - `Modus`: Exam practice / Grammar remediation / Mistake repair / Mock;
  - `Feedback`: Immediate / Reflection saved / Deferred until mock end;
  - `Next`: the primary follow-up route.
- Keep the existing debug card behind `APP_ENABLE_DEBUG_LOGS`; do not expose provider details by default.
- In the ready state, replace `Manual Start` with mode-specific copy:
  - exercise: `Aufgabe vorbereiten`
  - mock: `Mock-Sequenz starten`
  - grammar/mistake: no ready state unless future generation is added.
- In `ResultPanel`, replace the generic three columns with mode-specific headings:
  - exercise: `Schon gut`, `Noch wacklig`, `Nächster Trainingsschritt`;
  - grammar: `Muster erkannt`, `Noch prüfen`, `Transfer`;
  - mistake: `Korrigiert`, `Risiko`, `Neue Anwendung`;
  - mock: `Gespeichert`, `Keine Sofortauswertung`, `Nach dem Block`.

Acceptance criteria:

- The learner can distinguish immediate feedback from deferred mock feedback before submitting.
- Mock mode never shows coaching-style correction immediately after submit.
- The same context language follows the learner from source screen into workspace.

### 5. Mock setup and results: make mock a strict checkpoint, then a bridge

Current evidence:

- `MockTestSetup` supports full mock and single-section modes and shows rules/readiness.
- `mapMockResultsToViewModel` sends roadmap items to practice or grammar workspace routes.
- `mapExerciseWorkspaceToViewModel` marks mock as strict chrome and `postSubmitMode: deferred`.

Problem:

Mock setup says simulation, but mock results currently use some overconfident product language (`TDN 4 erreicht`, `Top 8%`, `Path to TDN 5`) that can read like official scoring.

Recommended UI changes:

- Replace official-sounding result headline with a safer training claim:
  - `Trainingsprofil: nahe TDN 4` or `Übungsprofil mit TDN-4-Nähe`.
- Replace `Global Rank` with `Übungsdurchlauf` or `Profilstand`.
- Replace `Book Coaching` with `Remediation öffnen`.
- Add a disclaimer near results: "Trainingsdiagnose, keine offizielle TestDaF-Bewertung."
- Make the first follow-up after results a bridge card:
  - one grammar remediation if the blocker is language control;
  - one official practice task if the blocker is task format;
  - one mistake repair if repeated evidence exists.

Acceptance criteria:

- Mock results do not overclaim official TestDaF prediction.
- Results route to remediation without blurring remediation and exam-format practice.
- The next action is smaller than another full mock unless the learner explicitly chooses it.

## View-model recommendations

These can be implemented without changing provider behavior.

### Add mode contract fields to `WorkspaceViewModel`

Proposed fields:

```ts
modeContract: {
  modeLabel: string;
  sourceLabel: string;
  feedbackPolicyLabel: string;
  nextStepLabel: string;
};
```

Derive them in `workspace-to-view-model.ts` from existing fields:

- `variant`
- `mode`
- `postSubmitMode`
- `context.sourcePage`
- `nextLink`
- `postSubmitOptions`

Why:

The screen currently has all the data, but it is scattered across pills, helper text, and debug/framing cards. A single mode contract makes the tutor logic legible.

### Add dashboard recommendation metadata

Proposed extension to study-plan card view model:

```ts
recommendationFrame: {
  whyLabel: string;
  modeLabel: string;
  outputLabel: string;
};
```

Why:

The dashboard should not only list tasks. It should explain the tutor's decision.

### Normalize visible CTA language

Recommended label map:

| Variant | Primary source-screen CTA | Workspace submit | Post-submit primary |
| --- | --- | --- | --- |
| exercise | `TestDaF-Aufgabe trainieren` | `Antwort auswerten` | `Grammatik-Transfer` or `Nächste Aufgabe` |
| grammar | `Remediation starten` | `Transfer speichern` | `Passende Aufgabe öffnen` |
| mistake | `Fehler reparieren` | `Neue Version speichern` | `In Aufgabe übertragen` |
| mock | `Mock starten` | `Antwort sichern` | `Nach Mock auswerten` |

## Empty, loading, and fallback states

The app already has demo fallback mode. The UX should make that feel intentional.

### Ready/loading

- Exercise/mock: show `Aufgabe wird vorbereitet` and what will be generated.
- Grammar/mistake: no spinner unless a future live generation path is added.
- If live MiniMax fails and fallback content is used, show a debug-only signal unless product copy needs a neutral learner-facing message.

### Empty states

- Empty study plan: `Noch keine Priorität. Starte mit einer Lesen-Aufgabe oder öffne die Grammatikbibliothek.`
- Empty grammar filters: `Keine Treffer. Filter zurücksetzen oder nach Kompetenzbereich starten.`
- Empty notebook: `Noch keine wiederkehrenden Muster. Nach deiner nächsten Auswertung füllen wir dieses Notizbuch.`
- Empty mock results: `Noch kein Mock-Durchlauf. Starte mit Single-Section, wenn du nur Taktung testen willst.`

### Fallback copy

Use neutral language:

- `Demo-Modus: strukturierte Beispielaufgabe geladen.`
- Avoid: `KI fehlgeschlagen`, `Provider error`, or anything that exposes internal provider behavior.

## Learning and TestDaF assumptions

- Digital TestDaF has four sections and 23 public task types; v1 should model task types without copying official sample content.
- Guided practice and grammar remediation are different learning modes.
- Mock mode should use stricter sequencing and delayed feedback.
- Hoeren and Sprechen can remain text-first in v1, but copy should be honest about audio/microphone readiness.
- TDN language should be framed as training guidance, not official scoring.

## MiniMax/provider impact

No provider changes are required for this UX slice.

Implementation should not change:

- `OPENAI_MODEL=MiniMax-M2.7` defaults;
- live-vs-fallback routing;
- Ready-click generation for exercise/mock;
- debug-only provider exposure.

## Suggested implementation slices

### Slice 1: copy and CTA normalization

Files likely touched:

- `components/dashboard/dashboard-overview.tsx`
- `components/grammar/grammar-library-screen.tsx`
- `components/notebook/mistake-notebook-screen.tsx`
- `components/mock/mock-test-setup.tsx`
- `lib/mappers/mock-results-to-view-model.ts`

Acceptance:

- learner-facing English analytics labels are replaced or reduced;
- mock results stop implying official scoring/ranking;
- CTA labels follow the table above.

### Slice 2: workspace tutor frame

Files likely touched:

- `lib/mappers/types.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`

Acceptance:

- every workspace shows source, mode, feedback policy, and next step in one place;
- immediate/deferred/reflection feedback is clear before submit;
- mock feedback remains deferred.

### Slice 3: empty and fallback-state pass

Files likely touched:

- `components/dashboard/dashboard-overview.tsx`
- `components/grammar/grammar-library-screen.tsx`
- `components/notebook/mistake-notebook-screen.tsx`
- `components/mock/mock-results-screen.tsx`
- `components/workspace/workspace-client.tsx`

Acceptance:

- empty data arrays render helpful states;
- fallback copy remains learner-safe and does not expose secrets or provider internals.

## Verification checklist for implementation

Run after code changes:

```bash
npm run verify
npm run build:web
```

Manual smoke routes:

- `/`
- `/grammar-library`
- `/mistake-notebook`
- `/mock-test`
- `/workspace/exercise/adaptive?from=dashboard`
- `/workspace/grammar/grammar-focus?from=grammar_library`
- `/workspace/mistake/subordinate-clause-order?from=mistake_notebook`
- `/workspace/mock/full?from=mock_setup`

Check:

- no immediate feedback after mock submit;
- no provider secret or env value appears;
- debug provider details only appear when debug logs are enabled;
- MiniMax-M2.7 remains the configured live target;
- grammar remediation is never labeled as an official TestDaF task.

## Files used for this plan

- `README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/testdaf-digital-research.md`
- `docs/tabla-maestra-grammar.md`
- `docs/grammar-sections.md`
- `docs/providers.md`
- `components/dashboard/dashboard-overview.tsx`
- `components/grammar/grammar-library-screen.tsx`
- `components/notebook/mistake-notebook-screen.tsx`
- `components/mock/mock-test-setup.tsx`
- `components/workspace/workspace-screen.tsx`
- `components/workspace/workspace-client.tsx`
- `lib/mappers/types.ts`
- `lib/mappers/dashboard-to-view-model.ts`
- `lib/mappers/grammar-library-to-view-model.ts`
- `lib/mappers/mistake-notebook-to-view-model.ts`
- `lib/mappers/mock-results-to-view-model.ts`
- `lib/mappers/workspace-to-view-model.ts`
- `lib/server/page-data.ts`
- `lib/workspace-context.ts`
