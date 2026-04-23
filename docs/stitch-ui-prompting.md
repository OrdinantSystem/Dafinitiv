# Stitch UI Prompting Guide

This document explains how to prompt Google Stitch effectively for this project.

## Why This Guide Exists

Stitch is not just a “make me a screen” tool.

Based on Google’s official descriptions, it works best when you give it:

- the business objective
- the feeling you want users to have
- examples or inspiration
- enough context to reason across multiple screens
- room to explore variants and iterate

For this project, that matters a lot because DaF Focus is not a single-page app. It is a multi-screen product with:

- guided practice
- mock exam mode
- progress tracking
- study planning
- skill visualization

So the best Stitch prompt for this project should behave more like a product design brief than like a one-line UI request.

## What The Official Sources Suggest

From Google’s official Stitch posts, the clearest guidance is:

- start with the business objective, not just a wireframe
- explain what you want users to feel
- include inspiration or visual direction
- use text, images, or even code as context
- generate multiple variants
- iterate quickly across screens and flows
- think in terms of connected user journeys, not isolated screens
- reuse design rules and systems across projects

Sources:

- Google Developers Blog: https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis/
- Google Keyword: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/

## What This Means For DaF Focus

For DaF Focus, a good Stitch prompt should include all of these layers:

### Product goal

What is the app for?

Answer:

- help learners prepare for the digital TestDaF
- combine exam practice, feedback, and adaptive study planning

### User type

Who is using it?

Answer:

- adult learners of German
- serious study users
- people preparing for a high-stakes language exam

### Emotional goal

What should the product feel like?

Answer:

- calm
- focused
- credible
- structured
- motivating without being childish

### UX reality

What kinds of screens does it need?

Answer:

- dashboard
- guided exercise screen
- mock exam screen
- results and feedback screen
- progress and skills screen
- study plan screen

### Design constraints

What should Stitch avoid?

Answer:

- generic SaaS dashboard style
- gamified language-app clichés
- cluttered exam screens
- low-contrast color choices
- overly decorative layouts that will be hard to implement in Next.js

## Recommended Visual Direction

This part is an inference based on the product and should be treated as a design recommendation, not as something stated by Google.

Recommended direction for DaF Focus:

- desktop-first responsive web app
- serious academic visual tone
- editorial but modern
- warm and intelligent rather than corporate
- readable enough for long study sessions

Suggested visual language:

- dark ink, stone, paper, muted teal, restrained accent color
- clean layout grid
- high information clarity
- slightly distinctive typography instead of a generic startup look

Suggested typography direction:

- elegant serif or semi-serif for major titles
- highly readable sans-serif for body, controls, and dense UI

## Recommended Screen Inventory

Ask Stitch to design a coherent system for these screens:

1. Home dashboard
2. Guided practice exercise screen
3. Mock exam exercise screen
4. Feedback and corrections screen
5. Progress and skill graph screen
6. Study plan screen

Optional later screens:

7. Onboarding / placement
8. Settings / model / account

## Best Prompt Strategy

Do not start with:

- “Design a dashboard for a German learning app”

Start with:

- product brief
- screen inventory
- user mood
- visual direction
- UX constraints
- output request

That gives Stitch enough context to create something coherent across multiple screens.

## Master Prompt

Use this as the main starting prompt in Stitch.

```text
Design a high-fidelity responsive web app UI for a product called DaF Focus.

DaF Focus is an AI-first preparation platform for the digital TestDaF exam. The product helps learners practice official task types from the exam, receive structured feedback, track progress through a skill graph, and follow an adaptive study plan.

Business goal:
- help serious learners prepare efficiently for the digital TestDaF
- make practice feel focused, credible, and modern
- combine exam simulation with adaptive learning support

Target users:
- adult learners of German
- intermediate to advanced learners preparing for university-related language certification
- users who want a more serious and structured product than a playful language app

What users should feel:
- calm
- focused
- supported
- academically confident
- never overwhelmed

Core product areas:
1. Home dashboard
2. Guided practice screen for one TestDaF exercise
3. Mock exam screen with stricter timing and less visual distraction
4. Feedback/results screen with corrections, rubric-style breakdown, and next steps
5. Progress screen with a skill graph and section trends
6. Study plan screen with recommended next tasks and remediation focus

Important UX constraints:
- this is not a generic SaaS dashboard
- this is not a childish gamified app
- the UI should feel intelligent, clean, and serious
- the app must work well on desktop and adapt gracefully to tablet and mobile
- long study sessions should feel visually comfortable
- reading, writing, and timed task flows should be very legible
- the mock exam screen should feel stricter and more minimal than guided practice
- feedback screens should feel precise, helpful, and motivating

Visual direction:
- editorial and modern
- structured and elegant
- academic but not old-fashioned
- distinctive typography
- restrained, high-contrast color system
- avoid generic purple AI aesthetics
- avoid bland white startup dashboard aesthetics

Suggested style:
- a refined web app with strong spacing rhythm
- subtle depth, cards, panels, and sectioning
- one expressive typeface for headings plus a highly readable sans-serif for interface text
- colors inspired by ink, paper, stone, and a restrained accent

Accessibility and implementation constraints:
- prioritize accessibility and readability
- use reusable components and a coherent design system
- design realistic layouts that can later be implemented cleanly in Next.js
- keep forms, panels, tabs, timers, and answer areas implementation-friendly

Specific UI requirements:
- dashboard should show current level, section progress, upcoming tasks, weak skills, and recent activity
- guided practice screen should show task prompt, source material, answer area, progress status, and optional coaching cues
- mock exam screen should emphasize timing, sequence, and minimal distraction
- feedback screen should show overall result, criterion breakdown, strengths, weaknesses, recurring mistakes, and recommended next action
- progress screen should show skill graph levels from 1 to 5, section trends, and historical improvement
- study plan screen should show prioritized tasks, why they were recommended, and estimated focus areas

Create:
- one coherent design system for the whole product
- desktop-first screens with responsive behavior in mind
- multiple screen designs that clearly belong to the same app
- a polished but realistic product direction that could be exported and implemented

Please generate 2 to 3 distinct visual directions first, then expand the strongest direction into the full multi-screen flow.
```

## Best Follow-Up Prompts

After the master prompt, use short focused follow-ups like these.

### 1. Choose a direction

```text
Expand direction 2. Keep the same design system and create the full product flow.
```

### 2. Make it less generic

```text
Push this further away from a generic SaaS dashboard. Make it feel more editorial, more intentional, and more suitable for a serious language exam preparation product.
```

### 3. Improve the guided practice screen

```text
Refine the guided practice screen for long study sessions. Make the reading flow, task prompt, answer area, and coaching feedback easier to scan without clutter.
```

### 4. Make mock mode stricter

```text
Redesign the mock exam screen so it feels more exam-like: calmer, stricter, more focused, with stronger timing hierarchy and fewer supportive elements than guided mode.
```

### 5. Improve the progress screen

```text
Refine the progress screen so the skill graph, section trends, and recommended focus areas are easier to understand at a glance.
```

### 6. Improve implementation realism

```text
Keep the same visual direction, but simplify any overly decorative patterns and make the layout more implementation-friendly for a Next.js web app using reusable components.
```

### 7. Add mobile thinking

```text
Show how the chosen design system adapts to tablet and mobile, especially for dashboard, guided practice, and feedback screens.
```

## Prompt For The Section Pages

Use this after Stitch has already generated the main landing or dashboard direction and you want the four main section-entry pages of the product.

```text
Using the established DaF Focus design system, design the four section pages of the app:

1. Lesen
2. Hoeren
3. Schreiben
4. Sprechen

These are not generic marketing pages. They are functional section hubs inside a serious exam preparation product.

Each section page should:
- clearly communicate what this section trains
- show the available task types inside that section
- show the learner’s current progress in that section
- show weak points or recommended focus areas
- offer clear entry points into guided practice and mock-style practice
- feel connected to the same product as the main dashboard

Shared requirements across all four section pages:
- consistent navigation and layout system
- strong hierarchy and readability
- implementation-friendly component structure for Next.js
- a calm, academic, high-trust visual tone
- clear differentiation between progress information and action buttons

Section-specific requirements:

Lesen page:
- emphasize reading focus, text comprehension, task types, and strategy
- include cards or grouped items for the 7 reading task formats
- show metrics such as reading accuracy, detail comprehension, and pacing

Hoeren page:
- emphasize listening focus, audio or video-based practice, and note-taking style tasks
- include grouped items for the 7 listening task formats
- visually prepare for future audio-based interactions even if the current version is text-first
- show metrics such as listening comprehension, note precision, and error patterns

Schreiben page:
- emphasize productive writing, argumentation, and source summarization
- include the 2 writing task types clearly
- show metrics such as task fulfillment, cohesion, grammar control, and source use
- provide a more editorial writing-focused layout than the other sections

Sprechen page:
- emphasize oral production, structure, timing, and spoken response tasks
- include the 7 speaking task formats
- visually suggest timed speaking practice and later voice integration
- show metrics such as fluency, structure, comprehensibility, and response control

Please create these four section pages as a coherent set.
Make them clearly distinct from one another, but still part of the same design system.
Show how each page adapts the same product language to a different skill area.
```

## Prompt For The Main Practice Tool

Use this when you want Stitch to design the central learning workspace where the learner actually does the task and then gets analysis back in a chat-like flow.

```text
Using the established DaF Focus design system, design the main practice tool view of the product.

This view is the core workspace where the learner interacts with the AI tutor and completes TestDaF practice tasks.

Concept:
- the experience combines a chat interface with a structured task workspace
- the learner receives a task in a rendered markdown-style interactive panel
- the learner completes the task inside the workspace
- after clicking submit, the answer is sent back into the conversation flow
- the AI returns analysis, corrections, rubric-style feedback, and next steps as rich markdown-like response cards

Design a desktop-first responsive web app screen for this tool.

Main UX goal:
- feel focused and intellectually serious
- combine the flexibility of chat with the clarity of a structured exercise interface
- make the learner feel guided, not lost
- keep the interaction readable during long study sessions

The screen should include:
- a conversation pane or chat timeline
- a main task panel that looks like a rendered markdown exercise workspace
- space for source material such as text, chart, prompt, or instructions
- a clear answer area depending on task type
- a submit action
- a feedback state after submission
- a way to distinguish between AI instructions, learner response, and AI analysis

Important interaction model:
- before submission, the task appears as an interactive study block inside the workspace
- after submission, the learner’s answer appears back inside the chat flow as a formatted message block
- the AI feedback also appears in the chat flow as structured rich content
- the interface should make this flow intuitive and visually elegant

Please design this as a hybrid between:
- a serious study workspace
- a chat-based AI tutor
- a structured exam practice tool

Required UI areas:
- left sidebar or top navigation for moving between dashboard, sections, progress, and study plan
- center workspace for the active task
- chat or conversation history panel
- top header with current mode, section, task title, and optional timer
- bottom composer or response controls

Support these states:
1. idle state before starting a task
2. active task state
3. answer drafting state
4. submitted state
5. analysis and feedback state

Please show how this tool could support different task types such as:
- reading task with source text plus answer area
- writing task with prompt plus long-form editor
- listening or speaking task with placeholders for future media controls

Visual direction:
- clean, refined, high-trust, and implementation-friendly
- not a generic chatbot
- not a generic dashboard
- not a playful language app
- should feel like a premium academic AI workspace

Design details to emphasize:
- strong visual separation between task content and chat content
- elegant rendering of markdown-like cards, lists, headings, callouts, and feedback blocks
- clear action hierarchy for submit, retry, next task, and review mistakes
- readable typography for dense text and long-form responses
- comfortable spacing for focus and concentration

Please generate 2 variations:
1. a more structured split-pane workspace
2. a more conversation-centered workspace

Then expand the stronger option into a polished final screen and show responsive adaptation ideas.
```

## Prompt For The Post-Submission Feedback View

If Stitch gives you a nice task screen but the feedback state still feels weak, use this refinement prompt.

```text
Refine the post-submission state of the DaF Focus practice tool.

I want the learner answer to reappear inside the chat timeline as a formatted markdown-style message card, followed by a rich AI analysis response.

The AI feedback should include:
- overall result
- criterion breakdown
- strengths
- weaknesses
- recurring mistakes
- suggested next step

Make this state feel:
- clear
- motivating
- rigorous
- easy to scan
- trustworthy

Avoid making it look like a generic chatbot response.
It should feel like structured academic feedback inside a premium AI learning workspace.
```

## Practical Advice For Using Stitch Well

### Good habit 1

Start broad, then narrow.

First ask for:

- visual directions
- overall product feel

Then ask for:

- specific screens
- refinements
- mobile behavior

### Good habit 2

Keep the product brief stable.

If you radically change the prompt every time, the design system may drift.

### Good habit 3

Ask Stitch for coherent flows, not isolated hero shots.

The product needs usable screens, not only beautiful screenshots.

### Good habit 4

Prioritize design system consistency.

Ask for:

- consistent navigation
- consistent panel logic
- consistent spacing
- reusable UI pieces

### Good habit 5

Use follow-up prompts for critique.

Examples:

- simplify this
- make hierarchy clearer
- improve exam focus
- make the feedback screen feel more trustworthy

## Best Next Step After Stitch

Once you get a direction you like, the next useful step is to convert the chosen direction into:

- screen inventory
- component list
- layout rules
- color tokens
- typography tokens
- spacing rules

That translation step will make the Next.js implementation much easier.
