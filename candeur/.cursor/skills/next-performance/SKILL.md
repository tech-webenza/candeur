---
name: next-performance
description: Improves Next.js App Router performance through images, fonts, bundles, caching, RSC boundaries, and Core Web Vitals. Use when the user asks to optimize speed, LCP, CLS, INP, bundle size, lazy loading, or performance audits.
---

# Next.js performance

Optimize with the smallest change that fixes a measured problem. Inspect existing patterns before adding tooling.

## Workflow

1. Identify the issue (LCP element, large JS, layout shift, slow API, over-fetching).
2. Locate the route, component, or data fetch involved.
3. Apply the matching pattern below.
4. Verify: `npm run build`, check build output sizes; test affected routes on desktop and mobile.

## Images

- Use `next/image` for local and remote images; set `width`, `height`, or `fill` with a sized parent.
- Set `sizes` for responsive images so the browser picks appropriate widths.
- Use `priority` only for above-the-fold LCP image (typically one per page).
- Prefer modern formats via Next image pipeline; do not ship oversized PNGs when WebP/AVIF suffices.
- Decorative images: empty `alt=""`.

## Fonts

- Use `next/font` (already in layout when project uses it); avoid duplicate `@font-face` in CSS.
- Subset weights actually used; avoid loading entire families.
- `display: swap` is handled by next/font defaults.

## Server vs client

- Default to Server Components; add `"use client"` only for hooks, browser APIs, Lenis, Embla, GSAP, Motion.
- Push client boundaries down to the smallest subtree.
- Pass serializable props from server to client children; avoid passing large client-only objects.

## Data fetching

- Fetch on the server in layouts/pages when possible (`async` Server Components).
- Use appropriate caching: `fetch(url, { next: { revalidate: N } })` or `cache: 'force-cache'` per product rules.
- Parallelize independent fetches with `Promise.all`.
- Do not refetch the same data in every child; lift fetch to parent or use shared cache tags if the project uses them.

## Code splitting

- `next/dynamic` for heavy client-only modules (charts, maps, rich editors, optional carousels).
- Avoid importing server-only code into client components.
- Tree-shake: import named exports from libraries; keep Embla carousels in isolated client components.
- Bootstrap: import CSS once in root layout; avoid duplicating Bootstrap on individual pages. Page-specific CSS stays in each `page.css` (smaller globals).

## Lists and carousels

- Virtualize very long lists if the project has a virtualization pattern; do not render thousands of DOM nodes.
- Embla: CSS `--embla-slide-size` breakpoints; lazy-load slide media with `next/image`; avoid duplicate slide markup.

## Motion

- Prefer `transform` and `opacity`; avoid layout-thrashing properties in animations.
- WOW.js headline/copy uses the same properties (`translateY`, `rotate`, `opacity`); see [ui-build/references/wow-text-animation.md](../ui-build/references/wow-text-animation.md). Init WOW in one client provider; disable when `prefers-reduced-motion: reduce`.
- Disable or simplify Lenis/GSAP when `prefers-reduced-motion: reduce`.
- Do not run global scroll listeners on every page without need.

## Static assets

- Serve SVGs for icons when already in `public/`; inline only small critical SVGs if needed.
- Audit unused assets only when asked; do not delete without reference check.

## Metadata and third parties

- Defer non-critical scripts; use Next `Script` with `strategy="lazyOnload"` when third parties are required.
- Avoid blocking the main thread on first paint.

## Checklist (after changes)

- [ ] `npm run build` succeeds
- [ ] No new unnecessary client components
- [ ] LCP image has dimensions and sensible `priority` / no priority abuse
- [ ] No obvious CLS from images, fonts, or carousels
- [ ] Bundle not bloated by duplicate libraries

## Project rules

Follow `.cursor/rules/react-nextjs.mdc` and `protect-existing-code`: do not rewrite working routes for micro-optimizations.

## Landing page (`app/page.tsx`)

- **Server Component** — static section data from `getLandingContent()` in `lib/landing/content.ts` (no client bundle for copy arrays).
- **Code splitting** — `next/dynamic` for `RolesCarousel` and `LifeAtCarousel` (hero stays static import for LCP).
- **Images** — `next/image` with `sizes` on responsive cards; `priority` only on hero assets in `HeroExpand`.
- **Motion buttons** — client boundary only on `delta-button` / carousels / hero; see `motion-rolling-buttons` skill.
- **API** — `GET /api/landing/news` cached with `revalidate`; do not duplicate fetch in every section.
