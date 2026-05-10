# Grammar remediation slices for B2-C1 TestDaF prep

## Purpose

This plan turns the current A1-C1 grammar taxonomy into interactive B2-C1 remediation work for DaF Focus. It does not replace TestDaF-format tasks. It sits between evaluated attempts, mistake notebook entries, and the next writing or speaking transfer task.

The target loop is:

```text
evaluation signal
  -> grammar slice
  -> repair drill
  -> corrected sentence or mini-paragraph
  -> TestDaF transfer prompt
  -> skill evidence update
```

## Product boundaries

- Grammar remediation is guided practice, not a mock exam.
- Every slice ends in a short TestDaF-relevant production task, but the slice itself should not pretend to be an official TestDaF task.
- TDN language should stay formative: use "TDN-Tendenz" or "would likely block TDN 4/5 performance" only as tutoring guidance, not as official score prediction.
- Demo fallback behavior should remain usable without live MiniMax access.
- Live-provider work should keep the current MiniMax target at `MiniMax-M2.7`.

## Prioritization logic

Prioritize grammar topics by three signals:

1. **Production impact**: errors that distort meaning in Schreiben/Sprechen outrank errors that are only local form issues.
2. **Transfer value**: patterns used across several TestDaF task types outrank narrow textbook topics.
3. **Current skill graph fit**: each slice must map to an existing `grammar.*` skill tag so the adaptive loop can route learners without adding a database first.

## Existing skill-tag map

| Current skill tag | Useful taxonomy sources | What it should mean in the trainer |
| --- | --- | --- |
| `grammar.word_order` | G52, G55, G56, G58 | V2, Vorfeld choices, object order, `nicht`, focus, `es` structures |
| `grammar.verb_position` | G53, G59-G64 | Verb-final subordinate clauses, infinitive clauses, relative clauses, clause frames |
| `grammar.case_and_articles` | G04-G12, G15, G17-G19 | case marking, articles, adjective endings inside noun phrases |
| `grammar.prepositions` | G45-G50, G67 | preposition meaning, case selection, da-/wo-compounds |
| `grammar.connectors_and_subordination` | G54, G60-G63, G70-G71 | logical connectors, clause linking, punctuation, transformations |
| `grammar.adjective_endings` | G19, G21, G69 | adjective endings, participial attributes, dense noun phrases |

## Priority 1 slices

These six slices should ship first because they directly affect academic writing and spoken argumentation.

### 1. Connector logic and clause shape

- **Skill tag**: `grammar.connectors_and_subordination`
- **Taxonomy**: G54, G60-G63, G70-G71
- **Common learner pattern**: correct connector meaning but wrong syntax, for example `trotzdem dass`, `wegen, weil`, or verb position after `obwohl/deshalb`.
- **Why it matters for TestDaF**: Schreiben 1 needs argument progression; Schreiben 2 and Sprechen 6 need source relations without changing the source meaning.
- **Micro-cycle**:
  1. Recognition: choose whether a sentence needs `weil`, `obwohl`, `deshalb`, `während`, `dadurch dass`, or a prepositional alternative.
  2. Repair: fix verb position and comma placement in 5 short academic sentences.
  3. Controlled production: combine two claims about study/work/living costs with the required relation.
  4. Transfer: write a 70-word mini-argument that uses one causal, one concessive, and one contrast relation.
- **Correction pattern**: meaning first, then connector class, then verb placement.
- **Acceptance criteria**: learner can transform `Viele Studierende arbeiten. Sie haben wenig Zeit.` into at least two accurate relation types without losing meaning.

### 2. Information structure and German word order

- **Skill tag**: `grammar.word_order`
- **Taxonomy**: G52, G55-G56, G58
- **Common learner pattern**: English-style subject-first sentences, overloaded beginnings, misplaced `nicht`, or unclear focus.
- **Why it matters for TestDaF**: productive tasks reward clear, comprehensible structure. Better Vorfeld choices make source summaries and opinions easier to follow.
- **Micro-cycle**:
  1. Recognition: mark Vorfeld, finite verb, middle field, and sentence bracket in learner sentences.
  2. Repair: move time/cause/source elements into better positions.
  3. Controlled production: rewrite 6 sentences so the intended focus is first.
  4. Transfer: summarize a small chart trend in 4 sentences, each with a different Vorfeld choice.
- **Correction pattern**: finite verb anchor before style advice.
- **Acceptance criteria**: learner can keep the finite verb in position 2 while varying the first field for cohesion.

### 3. Case and article control in academic noun phrases

- **Skill tag**: `grammar.case_and_articles`
- **Taxonomy**: G04-G12, G15, G17-G19
- **Common learner pattern**: article/case endings collapse in phrases like `die Vorteil von das Studium`, especially after prepositions or verbs with fixed case.
- **Why it matters for TestDaF**: local errors add up quickly in Schreiben and can blur who did what to whom.
- **Micro-cycle**:
  1. Recognition: identify case trigger: verb, preposition, possession, or apposition.
  2. Repair: correct articles and adjective endings in short noun phrases.
  3. Controlled production: expand bare nouns into precise academic noun phrases.
  4. Transfer: write a 5-sentence paragraph about university housing using at least four corrected noun phrases.
- **Correction pattern**: trigger -> case -> article -> adjective ending.
- **Acceptance criteria**: learner can explain why the corrected form uses nominative, accusative, dative, or genitive.

### 4. Prepositions, case, and da-/wo-reference

- **Skill tag**: `grammar.prepositions`
- **Taxonomy**: G45-G50, G67
- **Common learner pattern**: translated prepositions (`diskutieren über/um`, `abhängen von`, `Interesse an`) and missing da-compounds in follow-up sentences.
- **Why it matters for TestDaF**: source mediation and argumentation rely on compact references like `daran`, `dafür`, `wobei`, `worauf`.
- **Micro-cycle**:
  1. Recognition: match verb/adjective/noun frames to prepositions.
  2. Repair: replace wrong prepositions and repair case marking.
  3. Controlled production: turn repeated noun phrases into da-/wo-compounds.
  4. Transfer: respond to a campus-policy prompt using 5 fixed prepositional frames.
- **Correction pattern**: lexical frame first; case ending second.
- **Acceptance criteria**: learner uses da-/wo-compounds for textual reference, not just as isolated grammar forms.

### 5. Dense noun phrases and adjective/participle attributes

- **Skill tag**: `grammar.adjective_endings`
- **Taxonomy**: G19, G21, G69
- **Common learner pattern**: either avoids dense noun phrases completely or produces unreadable ones with wrong endings.
- **Why it matters for TestDaF**: reading and source-summary tasks include compressed academic noun phrases; writing improves when the learner can unpack and rebuild them.
- **Micro-cycle**:
  1. Recognition: unpack a dense noun phrase into a relative clause.
  2. Repair: correct adjective and participle endings.
  3. Controlled production: compress relative clauses back into noun phrases only where it improves clarity.
  4. Transfer: summarize one chart finding with one simple clause and one dense noun phrase.
- **Correction pattern**: meaning before compression; do not reward complexity for its own sake.
- **Acceptance criteria**: learner can choose between a clear clause and a compact noun phrase.

### 6. Indirect speech and modal stance

- **Skill tag**: `grammar.verb_position` plus `discourse.register` for later routing
- **Taxonomy**: G29, G39, G42
- **Common learner pattern**: source claims are reported as the learner's own facts, or modal verbs are used only in basic meanings.
- **Why it matters for TestDaF**: Sprechen 6 and Schreiben 2 require reported arguments, distance, and stance.
- **Micro-cycle**:
  1. Recognition: decide whether a sentence is fact, source claim, assumption, or counterargument.
  2. Repair: rewrite direct claims with `laut`, `zufolge`, `soll`, `sei/habe`, or cautious present-tense reporting.
  3. Controlled production: report 4 peer arguments without overclaiming.
  4. Transfer: give a short oral-style response that separates source view and personal stance.
- **Correction pattern**: source attribution before Konjunktiv form accuracy.
- **Acceptance criteria**: learner can report someone else's view without presenting it as verified fact.

## Priority 2 slices

Ship these after the first six once the learning loop exposes more evidence.

| Slice | Skill tag | Taxonomy | Use when |
| --- | --- | --- | --- |
| Passive and alternatives | `grammar.verb_position` / future `grammar.voice` | G43-G44 | learner overuses `man` or cannot describe processes in summaries |
| Konjunktiv II for advice and critique | `grammar.verb_position` | G41 | Sprechen 1, Sprechen 7, polite proposals, hypothetical alternatives |
| Nominalization and transformation | `grammar.connectors_and_subordination` / future `grammar.nominalization` | G68-G70 | learner needs denser academic style in Schreiben without losing clarity |
| Relative clauses and reference chains | `grammar.verb_position` | G18, G64, G67 | learner repeats nouns or creates unclear references |
| Negation and focus particles | `grammar.word_order` | G23, G57 | learner's `nicht/kein/auch/nur` placement changes meaning |
| Time relations and tense contrast | `grammar.verb_position` | G38-G40, G60 | learner confuses sequence in summaries or experience reports |

## Drill templates

### Template A: repair ladder

Use for frequent recurring mistakes.

1. Show the learner's sentence with one marked problem.
2. Ask for the trigger, not the full correction.
3. Ask for the corrected phrase or clause.
4. Ask for a one-sentence rule in learner language.
5. Ask for a new sentence in a TestDaF topic context.

Best for: cases, prepositions, connector syntax, adjective endings.

### Template B: contrast pair

Use when two forms are both possible but mean different things.

1. Present two near-identical German sentences.
2. Ask what changed in meaning or stance.
3. Ask the learner to choose the right sentence for a given source claim.
4. Ask for one rewritten sentence with a different relation.

Best for: `obwohl/trotzdem`, `während/wohingegen`, `wegen/weil`, `soll/muss`, local vs directional prepositions.

### Template C: compression and expansion

Use for academic style without passive lessons.

1. Expand a dense noun phrase into a clear clause.
2. Identify the head noun and case.
3. Rebuild the phrase with one modifier.
4. Use it in a source-summary sentence.

Best for: adjective endings, participial attributes, nominalization.

### Template D: transfer card

Use at the end of every slice.

1. Give a tiny TestDaF-relevant situation.
2. Require 3-5 target forms.
3. Limit length so grammar remains the focus.
4. Ask the tutor to evaluate only the target pattern plus comprehensibility.

Best for: all remediation slices.

## Skill-tag recommendations

The current six `grammar.*` tags are enough for the first release, but they are too broad for later adaptive routing. Add subskill metadata inside docs/prompts first; add new source tags only when implementation needs finer evidence.

Recommended future tags:

| Future tag | Why add it later |
| --- | --- |
| `grammar.voice` | passive, alternatives to passive, and process description are distinct from general verb position |
| `grammar.reported_speech_and_stance` | indirect speech and modal stance are central for source mediation |
| `grammar.nominalization` | academic style and compression need separate tracking |
| `grammar.reference_chains` | da-/wo-compounds, relative clauses, and pronoun reference affect cohesion |

Do not add these tags until tests and mappers are ready. For now, keep routing through the existing skill graph and store the finer slice id in prompt metadata or notebook entries.

## Prompt brief for grammar remediation

A grammar prompt should ask MiniMax-M2.7 or the fallback generator for this structure:

```json
{
  "sliceId": "connector-logic-clause-shape",
  "focusSkills": ["grammar.connectors_and_subordination"],
  "taxonomyIds": ["G54", "G60", "G61", "G62", "G70", "G71"],
  "learnerPattern": "connector meaning is partly right, but clause syntax changes meaning or clarity",
  "microExplanation": "2-4 plain sentences, no full lecture",
  "recognitionItems": [],
  "repairItems": [],
  "controlledProduction": {},
  "transferTask": {},
  "feedbackRubric": ["target pattern", "meaning preserved", "comprehensibility"]
}
```

Rules:

- Keep explanations short. The learner should do more than read.
- Use generated campus, academic, and social topics. Do not copy official sample materials.
- For grammar remediation, give immediate feedback. For mock mode, keep feedback deferred.
- Evaluate target grammar and comprehensibility; do not grade the whole TestDaF section.
- If live output is missing or invalid, fallback content should still provide the same slice structure.

## Suggested implementation sequence

### Card 1: document-backed grammar slice catalog

Owner: Implementation Engineer, reviewed by Grammar Curriculum Designer.

Deliverables:

- `src/domain/grammar-slices.ts` with the six priority slices as typed data.
- Fields: `id`, `title`, `priority`, `skillTags`, `taxonomyIds`, `testdafTransferTargets`, `microCycle`, `correctionPattern`, `acceptanceCriteria`.
- Unit test that every slice maps to at least one known `SKILL_TAGS` entry.

### Card 2: route `buildGrammarTrainingBrief` through slices

Owner: Implementation Engineer.

Deliverables:

- Update `src/agents/grammar-trainer.ts` so weak grammar skills choose a slice instead of only returning `training.grammar.remediation` or `training.grammar.micro_cycle`.
- Keep the old `promptId` field for compatibility.
- Add a new optional `sliceIds` field or a new function if changing the return shape is risky.

Acceptance criteria:

- Existing tests still pass.
- No provider or env behavior changes.
- Empty weak-grammar input returns safe fallback slice suggestions.

### Card 3: strengthen grammar prompts

Owner: MiniMax Tutor Prompt Engineer.

Deliverables:

- Expand `prompts/training/grammar/grammar-remediation.md` and `grammar-micro-cycle.md` with the slice contract above.
- Keep prompt language separate from official exam prompts.
- Include fallback-safe JSON shape guidance once prompt resolution exists.

### Card 4: UI handoff for grammar-library practice

Owner: UX Practice Designer + Implementation Engineer.

Deliverables:

- Grammar Library groups practice by slice, not by long lecture topic.
- Each card shows: problem pattern, 5-minute drill, transfer target, linked weak skill.
- Transfer task opens `/workspace/grammar/...`, not `/mock-test`.

## Verification checklist

For the implementation cards, run:

```bash
npm run typecheck
npm run test
npm run build:web
```

Manual smoke checks:

- `/grammar-library` shows remediation as short active practice.
- `/workspace/grammar/...` gives immediate grammar feedback.
- `/workspace/exercise/...` still behaves like TestDaF-format practice.
- `/mock-test` keeps stricter exam chrome and deferred feedback.
- Demo mode works with `APP_ENABLE_REAL_LLM=false`.

## Out of scope

- Official TestDaF score prediction.
- Full grammar course pages or passive textbook lessons.
- New database tables.
- Audio scoring for Sprechen or Hoeren.
- Changing MiniMax provider routing or model defaults.
