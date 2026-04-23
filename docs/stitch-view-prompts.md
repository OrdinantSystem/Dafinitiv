# Stitch View Prompts

This document lists the remaining product views that are still worth designing for DaF Focus, beyond:

- the main dashboard
- the four section pages: Lesen, Hoeren, Schreiben, Sprechen
- the core AI practice workspace

## Recommended Priority

### Core views to design next

1. Onboarding and placement
2. Mock exam setup
3. Mock exam results summary
4. Detailed attempt feedback and review
5. Progress and skill graph
6. Study plan
7. Session history

### Strong next-wave views

8. Mistake notebook
9. Settings and preferences

## 1. Onboarding And Placement

Why this view matters:

- new users need a clear first step
- the app should learn the user’s goal, target, and weak areas
- this view sets the tone of the whole product

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the onboarding and placement flow for the product.

This flow is for a serious AI-first TestDaF preparation platform, not a playful language-learning app.

Goals of this flow:
- welcome the user clearly
- understand their exam goal and current situation
- collect enough information to personalize the dashboard, study plan, and practice recommendations

The onboarding flow should include:
- a welcome screen
- target exam goal selection
- target section confidence self-assessment for Lesen, Hoeren, Schreiben, and Sprechen
- preferred study mode selection such as guided practice or mock-oriented preparation
- optional exam date or preparation timeline
- a final summary screen before entering the dashboard

What the interface should feel like:
- calm
- premium
- clear
- academically serious
- low-friction and not overwhelming

Important UI constraints:
- avoid generic SaaS onboarding
- avoid childish language-app patterns
- make the flow feel trustworthy and intelligent
- keep it easy to implement in Next.js with reusable step components

Please show:
- the multi-step flow
- progress indicator across steps
- mobile adaptation ideas
- one polished final direction
```

## 2. Mock Exam Setup

Why this view matters:

- mock mode is a distinct product flow
- users need to understand duration, rules, and scope before starting

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the mock exam setup screen for DaF Focus.

This screen should help the learner start a realistic mock session in a clear and confident way.

The screen should support:
- full mock exam selection
- single-section mock selection
- overview of the sections included
- estimated duration
- exam rules such as fixed order, strict timing, and delayed feedback
- a readiness checklist before starting

The design should feel:
- more serious and stricter than normal guided practice
- calm and trustworthy
- clear about commitment and time

Important UI areas:
- mock type selection
- section selection if partial mock is allowed
- duration summary
- rule summary
- start button with strong visual importance
- warning or confirmation state before launch

Please make this screen feel like the entrance to an exam simulation, not just another settings form.
Keep it implementation-friendly for a Next.js app.
```

## 3. Mock Exam Results Summary

Why this view matters:

- after a mock session, users need a clear high-level outcome before diving into details

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the mock exam results summary screen for DaF Focus.

This screen appears after a learner completes a mock exam or section mock.

The screen should summarize:
- section-by-section performance
- estimated TDN tendency per section
- strongest section
- weakest section
- major recurring issues
- recommended next focus

The emotional goal:
- honest
- rigorous
- motivating
- never harsh or chaotic

Important UI requirements:
- strong summary hierarchy at the top
- section cards for Lesen, Hoeren, Schreiben, and Sprechen
- clear next-step recommendations
- link to review detailed feedback
- option to start a targeted follow-up practice flow

The screen should feel more analytical than the dashboard, but still elegant and readable.
Avoid making it look like a generic analytics dashboard.
```

## 4. Detailed Attempt Feedback And Review

Why this view matters:

- one of the most important parts of the product is not just doing the task, but understanding what happened afterward

Paste this into Stitch:

```text
Using the established DaF Focus design system, design a dedicated detailed attempt feedback and review screen.

This screen is for reviewing one completed TestDaF-style exercise after submission.

The screen should show:
- task title and context
- learner answer
- AI feedback summary
- criterion-by-criterion breakdown
- strengths
- weaknesses
- recurring mistakes
- recommended next action
- optional retry or related follow-up exercises

Design goals:
- highly scannable
- rigorous but supportive
- structured like premium academic feedback
- not just a long chatbot transcript

Important interaction ideas:
- make it easy to compare the original task, the learner answer, and the evaluation
- clearly separate high-level summary from detailed feedback
- show actionable follow-up paths

Please create a layout that works well for long writing or speaking feedback, not only for small multiple-choice tasks.
```

## 5. Progress And Skill Graph

Why this view matters:

- the product needs a dedicated home for long-term progress, not just isolated session feedback

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the progress and skill graph screen for DaF Focus.

This screen should help the learner understand long-term development across the digital TestDaF.

It should include:
- overall progress summary
- section trends for Lesen, Hoeren, Schreiben, and Sprechen
- a skill graph with skill levels from 1 to 5
- weak areas that still need reinforcement
- strongest areas
- recent improvement over time

Design goals:
- analytical but readable
- motivating without becoming gamified
- elegant and calm
- implementation-friendly for a real web app

Important constraints:
- do not make it look like a generic business intelligence dashboard
- make the skill graph understandable for normal users, not only for developers
- use visual hierarchy carefully so the screen remains scannable

Please show a polished desktop version and how the same information would collapse on smaller screens.
```

## 6. Study Plan

Why this view matters:

- users need a place where the system translates analysis into a concrete next plan

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the study plan screen for DaF Focus.

This screen should show the learner an adaptive plan based on weak skills, recent performance, and section priorities.

The screen should include:
- today or next recommended tasks
- why each task was recommended
- focus skills for each recommendation
- distinction between exam practice and remediation exercises
- quick actions to start the next task
- optional weekly structure or plan grouping

The view should feel:
- practical
- motivating
- calm
- intelligently personalized

Important UI constraints:
- this is not a productivity app or task manager
- it should feel like a learning plan generated from performance data
- keep strong hierarchy between recommendation, rationale, and action

Please design this as a focused academic planning screen that still feels modern and implementation-friendly.
```

## 7. Session History

Why this view matters:

- once the user practices regularly, they will need a place to revisit attempts and feedback

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the session history view for DaF Focus.

This screen should let the learner browse and revisit past practice sessions and attempts.

The screen should include:
- a list or timeline of past sessions
- filters by section, task type, and mode
- status or result summary for each session
- easy access to detailed review pages
- a clean way to see patterns across recent attempts

Design goals:
- feel organized, not bureaucratic
- easy to scan
- useful for learners who return frequently
- consistent with the rest of the product

Please avoid a generic admin table look.
Make the history view feel like part of a premium learning product.
```

## 8. Mistake Notebook

Why this view matters:

- repeated errors are one of the strongest signals in language learning
- this view can become one of the most valuable study tools in the app

Paste this into Stitch:

```text
Using the established DaF Focus design system, design a mistake notebook view for DaF Focus.

This screen should help learners review recurring mistakes gathered from previous exercises.

The screen should include:
- recurring mistake categories
- example incorrect and corrected forms
- explanation or short rule
- linked skills
- related exercises or remediation recommendations
- a sense of what is improving and what still repeats

Design goals:
- extremely useful for review
- clean and readable
- more like a premium study notebook than a raw data table
- supportive but rigorous

Please create a screen that feels highly practical for real study sessions and long-term revision.
```

## 9. Settings And Preferences

Why this view matters:

- even in a focused MVP, users need some control over their experience

Paste this into Stitch:

```text
Using the established DaF Focus design system, design the settings and preferences screen for DaF Focus.

This should be a clean, serious preferences area for a language exam preparation product.

Possible settings areas:
- study preferences
- preferred mode defaults
- target exam level or target focus
- interface density or reading comfort settings
- notification or reminder settings
- optional advanced area for model or AI behavior preferences

Design goals:
- calm and minimal
- easy to scan
- not cluttered
- clearly lower priority than the core learning views

Please keep the design consistent with the rest of the product and implementation-friendly for a Next.js settings page.
```

