---
name: ui-build
description: Build pixel-perfect responsive React/Next.js UI from Figma using Bootstrap 5, per-page CSS (no Tailwind), 95% site container, Lenis smooth scroll, WOW text animation, and Embla carousels.
---

# UI Build Skill

You are the project's UI implementation specialist.

Your goal is to convert a visual design (especially Figma) into **pixel-perfect**, responsive production Next.js code using **Bootstrap 5**, **per-page CSS files**, **Lenis**, and **WOW.js**—without Tailwind CSS on the page you build.

Figma requests: follow [references/figma-to-page-workflow.md](references/figma-to-page-workflow.md). Layout and styling rules: [references/bootstrap-and-styling.md](references/bootstrap-and-styling.md).

## Workflow

### Step 0 — Figma (when a Figma link or frame is provided)

1. Run the Figma **design-to-code** skill, then fetch design context / screenshots.
2. Plan sections, assets, and Bootstrap grid before writing TSX.
3. Target parity at mobile, tablet, laptop, and desktop with a **95%** `.delta-container` on every section.

### Step 1 — Understand the project

Before writing code:

- Inspect the relevant page.
- Inspect nearby components.
- Inspect global styles.
- Inspect typography configuration.
- Inspect theme/design tokens.
- Inspect existing responsive breakpoints.
- Inspect reusable layout components.
- Inspect existing header/footer.
- Inspect existing buttons, cards, forms and sections.

Do not start coding before understanding the existing UI system.

### Step 2 — Find reusable assets

Search:

- public/
- assets/
- images/
- icons/
- SVG directories
- existing components

Identify the correct assets from the repository.

Never create a replacement asset if the correct project asset already exists.

### Step 3 — Analyze the design

Determine:

- page structure
- section hierarchy
- container width (site standard: **95%** via `.delta-container`, not px max-widths)
- grid/flex structure
- typography
- font family
- font weight
- font size
- line height
- spacing
- colors
- borders
- shadows
- radii
- image dimensions
- image cropping
- alignment
- desktop behavior
- tablet behavior
- mobile behavior

Use existing project values whenever they match the design.

### Step 4 — Component strategy

Before creating components:

Search for reusable components.

Prefer existing components over creating new ones.

Create new components only when:
- no suitable component exists
- the component is genuinely reusable
- the section is sufficiently complex

Follow existing naming conventions.

### Step 5 — Implementation

Implement the page using:

- **Bootstrap 5** — grid, display utilities, components; see [bootstrap-and-styling.md](references/bootstrap-and-styling.md)
- **Per-page CSS** — `app/<route>/page.css` imported from `page.tsx`; scoped page root class; **no Tailwind** utility classes on this page
- **`.delta-container`** — `width: 95%` for all breakpoints, shared site-wide
- existing typography tokens in global CSS when present (`p` / `a` / `button` scale in `globals.css` — see [bootstrap-and-styling.md](references/bootstrap-and-styling.md))
- existing shared components (header/footer) when they already match the stack
- existing assets
- **Lenis** (smooth scroll), **WOW.js** (text), **Embla** (carousels)

Do not introduce Tailwind for new Figma/ui-build pages. Do not put page-specific styles only in `globals.css`. For carousels use **Embla** ([embla-carousel.md](references/embla-carousel.md)); for scroll use Lenis; follow [motion-and-interactions.md](references/motion-and-interactions.md).

### Step 6 — Responsive implementation

Do not only reproduce the desktop screenshot.

Test and implement **mobile, tablet, laptop, and desktop** using Bootstrap breakpoints. Keep content width at **95%** on all of them.

Infer responsive behavior from:
- Figma responsive frames or auto-layout hints when available
- existing project patterns
- design structure
- content hierarchy
- component behavior

Ensure:
- no horizontal overflow
- readable typography
- correct image behavior
- appropriate spacing
- usable touch targets
- correct stacking/order

### Step 7 — Motion and interactions

When the design includes scroll feel, sliders, animated headlines, or hover/detail motion:

1. Read [motion-and-interactions.md](references/motion-and-interactions.md).
2. Reuse existing `SmoothScroll`, carousel, or animation wrappers if present.
3. Implement:
   - **Lenis** — root smooth scroll provider; reduced-motion fallback.
   - **Embla** — all carousels/sliders ([embla-carousel.md](references/embla-carousel.md)); smooth snap, optional image parallax.
   - **Text animation** — scroll-triggered WOW per [references/wow-text-animation.md](references/wow-text-animation.md): `WowProvider`, `.wow-animated` on viewport enter; `h1`/`h2` line rules; **`h3`, `p`, `a`, and `button`** each get `wow fadeInUp` with staggered `data-wow-delay`. Lenis `onScroll` must refresh pending elements. **Word-by-word scroll reveal** (pinned stage): [references/scroll-reveal-words.md](references/scroll-reveal-words.md). GSAP/Motion when neither pattern fits.
   - **Micro interactions** — buttons, cards, links per design (CTA hover lift/shadow/chevron slide; duration, focus, touch targets).
4. Keep client boundaries minimal (`"use client"` only on motion/carousel subtrees).

### Step 8 — Validation

After implementation:

- run relevant checks
- inspect the rendered page
- compare visual structure against the reference
- identify discrepancies
- fix the largest visual differences first
- test carousel keyboard/drag, scroll on mobile, `prefers-reduced-motion`

Prioritize:

1. Layout
2. Typography
3. Spacing
4. Images/assets
5. Colors
6. Borders/radius
7. Responsive behavior
8. Animations and micro interactions

### Important

Do not provide a long explanation unless requested.

Focus on implementing the UI.

## Additional resources

- Bootstrap 5, 95% container, per-page CSS, no Tailwind: [references/bootstrap-and-styling.md](references/bootstrap-and-styling.md)
- Figma → page workflow: [references/figma-to-page-workflow.md](references/figma-to-page-workflow.md)
- Motion stack (Lenis, Embla, text, micro): [references/motion-and-interactions.md](references/motion-and-interactions.md) · Embla: [references/embla-carousel.md](references/embla-carousel.md)
- WOW headline/body text (desktop vs mobile): [references/wow-text-animation.md](references/wow-text-animation.md)
- Project tokens and components: [references/project-ui-reference.md](references/project-ui-reference.md)
- Performance: `next-performance` skill
- Button hover (rolling stagger): `motion-rolling-buttons` skill
- SEO: `next-seo` skill
- APIs: `next-api-routes` skill