# TestDaF Digital Research Notes

## Scope and source basis
This document summarizes the digital TestDaF format as consulted on 2026-03-30 from the official TestDaF pages:

- https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/
- https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/vorbereitung-auf-den-digitalen-testdaf/beispielaufgaben-zum-digitalen-testdaf/
- https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/
- https://www.testdaf.de/de/forschung/forschung-bei-gast/standard-setting-zum-digitalen-testdaf/

## High-level findings
- The digital TestDaF is organized into four sections: Lesen, Hoeren, Schreiben, and Sprechen.
- The public digital format contains 23 task types in total: 7 for Lesen, 7 for Hoeren, 2 for Schreiben, and 7 for Sprechen.
- The test uses fixed order, timed sections, and section-specific results rather than a single overall score.
- Productive sections are judged by task fit, coverage of instructions, clarity, language control, and source use where relevant.
- The standard-setting publication places the digital test in the B2.1 to C1.2 region with section results mapped to TDN 3, TDN 4, and TDN 5.
- The official sample materials are useful for structure and timing, but should not be copied into generated practice content.

## Design implications for an AI trainer
- The platform should model one prompt pack per official task type, not just one per section.
- The system should distinguish exam-format practice from remediation drills.
- The learner model should track more than grammar: task fulfillment, source mediation, register, cohesion, reading, listening, writing, and speaking all matter.
- The product should present estimated performance as pedagogical guidance, not as an official result predictor.
- Text-first support is strongest for Lesen and Schreiben. Hoeren and Sprechen need architecture ready for later audio support, even if the first version focuses on format and strategy.

## Official task matrix

| Section | Order | Task type | Public timing or note | Main competence focus |
| --- | --- | --- | --- | --- |
| Lesen | 1 | Lueckentext ergaenzen | 5 gaps, 4 min | local reading accuracy, lexical fit |
| Lesen | 2 | Textabschnitte ordnen | 4 sections, 5 min | cohesion, text logic |
| Lesen | 3 | Multiple Choice | 7 items, 15 min | global and detailed comprehension |
| Lesen | 4 | Sprachhandlungen zuordnen | 4 items, 6 min | rhetorical purpose, stance |
| Lesen | 5 | Aussagen Kategorien zuordnen | 7 items, 9 min | scanning and distributed evidence |
| Lesen | 6 | Aussagen einem Begriffspaar zuordnen | 4 items, 7 min | conceptual categorization |
| Lesen | 7 | Fehler in Zusammenfassung erkennen | 3 items, 7 min | integrated text plus graphic comparison |
| Hoeren | 1 | Uebersicht ergaenzen | preview 15 s, review 20 s | short-note listening |
| Hoeren | 2 | Textstellen zu Begriffspaar notieren | review 3 min | claim and support capture |
| Hoeren | 3 | Fehler in Zusammenfassung erkennen | review 2 min 30 s | integrated audio-summary comparison |
| Hoeren | 4 | Aussagen Personen zuordnen | preview 45 s, review 45 s | discussion tracking |
| Hoeren | 5 | Gliederungspunkte zu Vortrag ergaenzen | preview 10 s, review 3 min | lecture outline completion |
| Hoeren | 6 | Multiple Choice | preview 90 s, review 90 s | global and detailed listening |
| Hoeren | 7 | Laut- und Schriftbild abgleichen | review 20 s | spoken-written mismatch detection |
| Schreiben | 1 | Argumentativen Text schreiben | min 200 words, 30 min | argumentation and written control |
| Schreiben | 2 | Text und Grafik zusammenfassen | about 100-150 words, 30 min | source mediation |
| Sprechen | 1 | Rat geben | prep 30 s, speak 45 s | short advice |
| Sprechen | 2 | Optionen abwaegen | prep 45 s, speak 90 s | compare and justify |
| Sprechen | 3 | Text zusammenfassen | read 4 min, speak 2 min | oral source summary |
| Sprechen | 4 | Informationen abgleichen, Stellung nehmen | phased task | integrated graphic plus spoken response |
| Sprechen | 5 | Thema praesentieren | prep 2 min, speak 2 min 30 s | structured presentation |
| Sprechen | 6 | Argumente wiedergeben, Stellung nehmen | phased task | restate and evaluate arguments |
| Sprechen | 7 | Massnahmen kritisieren | prep 90 s, speak 90 s | critique and alternative proposal |

## Recommended product boundaries for v1
- Keep the application honest about what is fully simulated and what is format-accurate but text-first.
- Use generated source materials only.
- Store every evaluation as evidence that can update a discrete 1 to 5 skill graph.
- Offer both guided practice and mock exam mode from the same exercise metadata.
