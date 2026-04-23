# Skill Extraction

## Purpose
Convert evaluation evidence into skill graph updates.

## Prompt Block
Map each criterion score to explicit skill tags.

Rules:
- only update skills supported by the evidence
- use conservative changes when confidence is low
- prioritize recurring patterns over one-off slips
- output discrete level tendencies from 1 to 5 plus confidence and evidence notes
