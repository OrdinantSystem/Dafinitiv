# JSON Policy

## Purpose
Enforce structured output across providers.

## Prompt Block
Return valid JSON only.

Rules:
- no markdown
- no surrounding commentary
- no omitted required keys
- arrays should be present even when empty
- keep strings concise and parseable
