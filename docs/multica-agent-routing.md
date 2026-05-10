# Dafinitiv Multica Agent Routing

This document explains how the Multica project for Dafinitiv / DaF Focus is organized.

## Multica project

```text
Project: Dafinitiv
Project ID: 141b07b7-ac2d-40ef-9ae9-7dbb3bdbb92b
Repo: /srv/eve-orchestra/multica-workspaces/Dafinitiv
Live preview: http://51.195.102.49/dafinitiv
Model target: MiniMax-M2.7
```

The project is attached to the GitHub repo resource:

```text
https://github.com/OrdinantSystem/Dafinitiv
```

## Routing rule

Use the smallest relevant specialist:

| Work type | Multica agent |
| --- | --- |
| Intake, board planning, roadmap, broad tickets | Dafinitiv Project Steward |
| Digital TestDaF task fidelity, mock exam, TDN language | Dafinitiv TestDaF Exam Architect |
| German grammar curriculum, drills, transfer tasks | Dafinitiv German Grammar Curriculum Designer |
| Adaptive learning, skill graph, mistake notebook, study plan | Dafinitiv Adaptive Learning Architect |
| MiniMax-M2.7 prompts, provider behavior, tutor rules | Dafinitiv MiniMax Tutor Prompt Engineer |
| Learning UX, workspace flow, grammar/mistake/mock modes | Dafinitiv UX Practice Designer |
| Next.js, TypeScript, providers, tests, deployment checks | Dafinitiv Implementation Engineer |
| Secret handling, claim safety, audit, release readiness | Dafinitiv QA & Safety Reviewer |

## Good Multica card shape

```text
Title:
  Clear outcome, not a vague role request.

Agent:
  One specialist from the table above.

Goal:
  What should exist after the run?

Read first:
  README.md
  docs/README.md
  exact target file(s)
  docs/testdaf-digital-research.md for exam work
  docs/grammar-sections.md and docs/tabla-maestra-grammar.md for grammar work
  docs/providers.md for MiniMax/provider work

Output:
  File path, review memo, code change, prompt review, UX spec, or next-card recommendation.

Do not:
  expose API keys or .env values
  revert MiniMax-M2.7 to MiniMax-M2.5
  overclaim official TestDaF score prediction
  commit or push unless explicitly asked
```

## MiniMax model rule

Use this model target for live provider work:

```text
MiniMax-M2.7
```

Do not create new defaults, prompts, docs, or tickets around MiniMax-M2.5.

## Starter backlog created

```text
EVE-43 MiniMax 2.7: verify live provider config, prompts, and fallback behavior
EVE-44 Adaptive Learning Loop: improve attempt-to-feedback-to-next-practice flow
EVE-45 TestDaF Fidelity: review 23-task coverage and mock-practice boundaries
EVE-46 Grammar Trainer: design interactive B2-C1 grammar remediation slices
EVE-47 Practice UX: make workspace, grammar, mistake, and mock modes feel like one tutor
EVE-48 Implementation Roadmap: plan persistence for learners, attempts, evaluations, and mistakes
EVE-49 Dependency Security: resolve npm audit findings for Next.js/PostCSS
```

## Automation chain

The starter backlog has an enabled chain manifest:

```text
/srv/eve-orchestra/multica-automations/chains/dafinitiv-starter-roadmap.json
```

Wave graph:

```text
(EVE-43 + EVE-44 + EVE-45)
  -> (EVE-46 + EVE-47)
      -> (EVE-48 + EVE-49)
```

Start only the first frontier manually:

```text
EVE-43
EVE-44
EVE-45
```

The chain runner moves later cards from `backlog` to `todo` when prerequisites reach `in_review`. It never moves cards to `done`.
