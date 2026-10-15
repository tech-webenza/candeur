# Figma → page workflow (ui-build)

Use this when the user asks to build or implement a page from Figma with the **ui-build** skill.

## Prerequisites

1. Figma file URL or `fileKey` + `nodeId`.
2. Read plugin skill **figma-design-to-code** before `get_design_context`.
3. Read [bootstrap-and-styling.md](bootstrap-and-styling.md), [wow-text-animation.md](wow-text-animation.md), [motion-and-interactions.md](motion-and-interactions.md).

## Steps

1. **Design intake** — Screenshot + design context; note typography, colors, spacing, assets, breakpoints implied by frames.
2. **Assets** — Export or use existing `public/` assets; `next/image` with correct dimensions.
3. **Route** — `app/<route>/page.tsx` + `app/<route>/page.css` (mandatory).
4. **Markup** — Semantic HTML; Bootstrap `row` / `col-*` inside `.delta-container` (95% width).
5. **Styles** — Figma values in `page.css`; global only for Lenis/WOW/Bootstrap import and `.delta-container`.
6. **Motion** — Lenis at root; WOW for text; Embla for carousels ([embla-carousel.md](embla-carousel.md)); `desktop-view` / `mobile-view` for headline variants.
7. **QA** — Compare to Figma at mobile, tablet, laptop, desktop; no horizontal overflow; no Tailwind classes on the page.

## Output quality bar

**Pixel-perfect** means: type scale, weights, line-heights, letter-spacing, colors, padding, and alignment match the Figma reference within normal browser rounding—fix the largest visual deltas first (layout → type → spacing → color → motion).
