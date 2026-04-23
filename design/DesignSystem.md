# Design System Strategy: The Curated Sanctuary

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Curated Sanctuary."** Inspired by high-end architectural studios, the goal is to move away from the frantic, cluttered nature of typical dashboards toward a space that feels intentional, quiet, and premium. 

This system breaks the "template" look by utilizing **Asymmetric Type Weighting** and a **No-Line Surface Philosophy**. Instead of relying on a rigid grid of boxed-in content, we use expansive breathing room (Spacing Scale 16+) and tonal layering to guide the eye. The interface shouldn't feel like a software application; it should feel like a custom-bound editorial portfolio.

---

## 2. Colors & Surface Philosophy
The palette is grounded in the contrast between the warmth of **Soft Cream (#fbf9f1)** and the authority of **Deep Midnight (#0F172A)**, accented by the intellectual depth of **Signature Teal (#00685f)**.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning or card containment. Boundaries are defined through:
- **Tonal Layering:** Use `surface-container` tiers to define hierarchy. For example, a card using `surface-container-lowest` (#ffffff) sitting on a `surface-container-low` (#f6f4ec) section.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    - Base Level: `surface` (#fbf9f1)
    - Structural Containers: `surface-container` (#f0eee6)
    - Interactive Cards: `surface-container-lowest` (#ffffff)
- **Glass & Gradient Rule:** For floating elements or highlight sections (like the AI Advisor nudge), use semi-transparent variants of `primary-fixed` with a 12px-20px backdrop blur. Main CTAs should utilize a subtle linear gradient from `primary` (#004e47) to `primary-container` (#00685f) to add "soul" and depth.

---

## 3. Typography
We use **Plus Jakarta Sans** exclusively to maintain a modern, geometric clarity. The brand identity is conveyed through extreme contrast in scale.

- **Display & Headlines:** Use `display-lg` (3.5rem) and `headline-lg` (2rem) with tight letter-spacing (-0.02em). These should feel like editorial mastheads.
- **The Asymmetric Weighting:** Pair large, bold headlines with significantly smaller, wide-tracked `body-sm` (0.75rem) or `label-md` text. This gap creates a sophisticated "High-End" feel.
- **On-Surface Logic:** All primary text uses `on-surface` (#1b1c17), while secondary metadata uses `on-surface-variant` (#3e4947) to maintain a soft, accessible contrast ratio that mimics ink on paper.

---

## 4. Elevation & Depth
Depth in this system is organic, not artificial. We shun the "material" look of floating shadows for a more architectural "stacked" approach.

- **Tonal Layering Principle:** Avoid `elevation-1` through `elevation-5`. Instead, lift an element by moving it to a lighter surface token. A card on the `surface-dim` background should be `surface-bright`.
- **Ambient Shadows:** Shadows are reserved for high-level floating elements (Modals, Coaching Nudges). 
    - **Specs:** Blur: 40px-60px, Spread: -5px. 
    - **Color:** Use `on-surface` (#1b1c17) at 4-8% opacity. This mimics natural ambient light in a bright room.
- **The "Ghost Border" Fallback:** If a layout requires a container for accessibility in low-contrast environments, use a "Ghost Border": `outline-variant` (#bec9c6) at 20% opacity. Never use a 100% opaque border.

---

## 5. Components

### Buttons
- **Primary:** `round-full` (capsule). Background: `primary` gradient. Label: `on-primary`. Use for the "Main Action" (e.g., "Start Practice").
- **Secondary:** `round-full`. Background: `surface-container-highest` (#e4e3db). No border. Label: `on-surface`.
- **Tertiary/Ghost:** No background. `on-surface` text with a trailing icon. Use for navigational actions (e.g., "View Detailed Analysis").

### Cards & Containers
- **Visual Style:** All cards must use `round-xl` (3rem) or `round-md` (1.5rem) as per the Roundness Scale. 
- **The No-Divider Rule:** Forbid the use of horizontal rules/lines within cards. Separate content using `spacing-4` (1.4rem) or `spacing-6` (2rem) vertical blocks.

### Input Fields
- **Style:** Use `surface-container-low` as the field background with `round-sm` (0.5rem). 
- **States:** Focus state should not use a thick border, but rather a subtle glow of `primary-fixed` and a shift to `surface-container-lowest`.

### Progress Indicators
- **Style:** Use "Signature Teal" for the active track and `surface-variant` for the remaining track. Ensure the ends are `round-full` to match button styling.

---

## 6. Do's and Don'ts

### Do:
- **Use White Space as a Tool:** Allow elements to "float" within the `surface` background.
- **Embrace Asymmetry:** It’s okay to have a large headline on the left and a tiny label on the far right.
- **Color Shifts for Interaction:** Use subtle background shifts (e.g., from `surface-container-low` to `surface-container-high`) for hover states rather than shadows.

### Don't:
- **No 1px Lines:** Do not use dividers to separate list items. Use spacing.
- **No Harsh Shadows:** Avoid the standard "Drop Shadow" preset. If it looks like it's hovering too high, the shadow is too dark.
- **No Default Grids:** Don't let every card be the same width. Vary the scale of containers to reflect the importance of the data.
- **No Pure Black:** Always use `on-surface` (#1b1c17) or `tertiary` (#3d445a) for text to maintain the "Sanctuary" softness.