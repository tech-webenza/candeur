---
name: ui-visual-qa
description: Audit React/Next.js UI against Figma or screenshots for pixel-perfect layout (Bootstrap 5, 95% container, per-page CSS, no Tailwind), Embla carousels, WOW/Lenis motion, and responsive behavior—with minimal code changes.
---

# UI Visual QA

Act as a visual QA engineer.

The goal is to identify and correct visual differences between the implementation and the reference.

## Inspect

Compare:

- overall page width
- section heights
- container width
- horizontal alignment
- vertical spacing
- typography
- font size
- font weight
- line height
- image dimensions
- image cropping
- colors
- borders
- radius
- shadows
- buttons
- icons
- responsive behavior
- carousel slide width, gap, peek, pagination, and nav alignment (Embla)
- headline/text reveal timing and easing
- hover/focus/active states on interactive elements
- scroll smoothness vs reference (Lenis—not double scrollbars)

For layout/styling standards see [../ui-build/references/bootstrap-and-styling.md](../ui-build/references/bootstrap-and-styling.md). For motion, see [../ui-build/references/motion-and-interactions.md](../ui-build/references/motion-and-interactions.md). For WOW headline/copy, see [../ui-build/references/wow-text-animation.md](../ui-build/references/wow-text-animation.md).

## Priority

Fix differences in this order:

1. Overall layout
2. Container/grid
3. Section dimensions
4. Typography
5. Spacing
6. Images
7. Colors
8. Borders/radius/shadows
9. Micro alignment
10. Carousel/slider (Embla breakpoints and spacing)
11. Text animation (stagger, duration, trigger point)
12. Micro interactions (hover, focus, press)
13. Smooth scroll behavior (Lenis, nested scroll areas)

## Rules

Do not blindly change values.

First determine why the discrepancy exists.

Prefer changing the smallest number of values necessary.

Do not refactor unrelated code.

Do not change business logic.

## Responsive QA

Check:

- desktop
- tablet
- mobile

Look for:

- overflow
- wrapping problems
- incorrect stacking
- excessive whitespace
- compressed sections
- incorrect image cropping
- typography scaling issues
- carousel overflow or clipped slides
- animation playing when reduced motion is preferred (should simplify or disable)

## Layout QA checklist

- [ ] Content uses `.delta-container` at **95%** width on mobile, tablet, laptop, and desktop (not px max-width content areas)
- [ ] Bootstrap grid/classes used; **no Tailwind** utilities on ui-build / Figma pages
- [ ] Page-specific styles live in that route's `page.css`, not scattered in globals

## Motion QA checklist

- [ ] Embla matches design at desktop, tablet, laptop, mobile breakpoints
- [ ] No horizontal page overflow from carousel
- [ ] Desktop `h1`: line-based `fadeInUpRotate` + `copy`; mobile `h1`: single `fadeInUp` (no rotate split)
- [ ] Desktop `h2`: line-based `fadeInUpLessRotate`; mobile `h2`: single `fadeInUp`
- [ ] Body copy and other text: `wow fadeInUp` with correct `data-wow-delay` stagger (0.2s base, +0.1s)
- [ ] Text animations fire at correct scroll/viewport position
- [ ] Interactive states match reference (not missing focus/hover)
- [ ] Single smooth scroll path (Lenis); modals/drawers still scroll internally

## Final result

Make the implementation visually closer to the reference and preserve existing functionality.