---
name: ui-modify
description: Safely modify an existing React/Next.js page while preserving Bootstrap 5 layout, per-page CSS, 95% delta-container, Lenis, WOW text animation, Embla carousels, and responsive behavior (no Tailwind on Bootstrap pages).
---

# UI Modify Skill

Modify the existing implementation with the smallest appropriate change.

## Before editing

Inspect:

- target page
- parent components
- child components
- styles
- data flow
- API calls
- hooks
- animations (Lenis, Embla, WOW.js)
- responsive behavior (mobile, tablet, laptop, desktop)
- smooth-scroll and carousel providers
- page-level `page.css` and Bootstrap markup

Understand how the current implementation works before changing it.

For Bootstrap pages, read [../ui-build/references/bootstrap-and-styling.md](../ui-build/references/bootstrap-and-styling.md). Edit styles in that route's `page.css`; keep `.delta-container` at 95%; do not introduce Tailwind utilities.

For motion/carousel changes, read [../ui-build/references/embla-carousel.md](../ui-build/references/embla-carousel.md) and [../ui-build/references/motion-and-interactions.md](../ui-build/references/motion-and-interactions.md)—match existing Embla wrappers; do not use Swiper or hand-rolled snap sliders.

When changing headline or body text animation, follow [../ui-build/references/wow-text-animation.md](../ui-build/references/wow-text-animation.md): desktop `h1` uses per-line `fadeInUpRotate` + `copy`; desktop `h2` uses per-line `fadeInUpLessRotate`; mobile headings use a single `wow fadeInUp`; paragraphs use `wow fadeInUp` with staggered `data-wow-delay`. Do not swap mobile to rotate variants.

For **scroll-scrubbed word reveal** (muted → full color while scrolling through a pinned block), use [../ui-build/references/scroll-reveal-words.md](../ui-build/references/scroll-reveal-words.md) — do not combine with WOW on the same headline.

## Modification strategy

Make the minimum changes required.

Do not rewrite the entire page unless explicitly requested.

Do not change unrelated components.

Do not replace working components with new implementations unnecessarily.

Do not change APIs or business logic for a visual-only request.

## Reuse

If the requested change can be achieved by modifying an existing component, modify it rather than creating a duplicate.

If a reusable component already exists, use it.

## Responsive behavior

After modifying desktop UI, verify that tablet and mobile behavior remains correct.

Do not fix one breakpoint by breaking another.

## Visual changes

When the request concerns:

- font
- spacing
- color
- alignment
- dimensions
- responsive layout
- images
- animation
- carousel behavior
- smooth scroll
- hover/focus micro interactions

change only the relevant implementation.

When adjusting carousels, change Embla options/CSS (`EMBLA_SMOOTH_OPTIONS`, `--embla-slide-size`)—not a new library. When adjusting scroll, change Lenis options or scope—not `overflow` hacks on `body` unless the project already does.

## Validation

After modification:

- check affected components
- check TypeScript
- check responsive behavior
- check existing interactions (Embla nav/dots, Lenis anchor scroll, animation cleanup)
- check `prefers-reduced-motion`
- check for unintended layout changes

Report only meaningful changes.