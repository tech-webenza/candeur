# Motion and interactions (Next.js / React)

Inspect the repo before adding dependencies. If these libraries already exist, match their patterns exactly.

**Layout/styling on ui-build pages:** Bootstrap 5 + per-page CSS + `.delta-container` (95% width). No Tailwind. See [bootstrap-and-styling.md](bootstrap-and-styling.md).

## Stack defaults (when not in project)

| Concern | Library | Package |
|--------|---------|---------|
| Smooth scroll | Lenis | `lenis` |
| Carousels | **Embla** | `embla-carousel`, `embla-carousel-react` |
| Text animation | GSAP | `gsap`, `@gsap/react` (optional) |
| Component / micro motion | Motion | `motion` (v11+) |
| Button hover (rolling label) | Motion UI pattern | See `.cursor/skills/motion-rolling-buttons/SKILL.md` |

Do not add duplicate scroll or carousel libraries. **Do not use Swiper** in this repo.

## Button rolling text (site CTAs)

Use `DeltaButtonLink` / `DeltaHeaderCta` from `@/components/ui/delta-button` (staggered rolling label). Official registry: `npx shadcn@latest add @motion/button-rolling-text-stagger` after `MOTION_TOKEN` is set — see **motion-rolling-buttons** skill.

## Client boundaries

- Lenis, Embla, GSAP, and Motion require `"use client"`.
- Keep wrappers thin: `components/providers/SmoothScroll.tsx`, route-specific `*Carousel.tsx` under `components/home/` or `components/carousel/`.
- Do not mark entire pages client-only for one animated section; isolate client subtrees.

## Lenis — smooth scroll

1. Install: `npm install lenis`
2. Provider at root (inside `body`, after fonts):

```tsx
"use client";

import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

3. Wire `onScroll` → `scanPendingWowElements()` for WOW text.
4. Respect `prefers-reduced-motion`: disable Lenis or set `smoothWheel: false` when reduced motion is requested.
5. Anchor links: use Lenis `scrollTo` for in-page targets; preserve focus for accessibility.

## Embla — carousels

Full Figma workflow: [embla-carousel.md](embla-carousel.md).

Summary:

1. `useEmblaCarousel(EMBLA_SMOOTH_OPTIONS)` from `embla-carousel-react`.
2. Import `components/carousel/embla.css`.
3. Responsive `slidesPerView` via `--embla-slide-size` on a scoped class (768px / 1200px breakpoints).
4. Navigation: `useEmblaCarouselA11y` for prev/next, dots, `scrollTo(index)`.
5. Slide images: optional `useEmblaParallax(emblaApi)` + `data-embla-parallax` layer.
6. After slide changes, call `scanPendingWowElements()` for WOW copy in slides.

Do not build custom horizontal snap divs for carousel designs.

## Text animation

Prefer semantic HTML; animate wrappers, not individual characters unless design requires split text.

### WOW — scroll-triggered headlines and copy (project default)

Full markup, delays, desktop/mobile split, scroll trigger, and CSS: [wow-text-animation.md](wow-text-animation.md).

Implementation: `WowProvider` + `lib/wow/scrollAnimations.ts` (adds `.wow-animated` when elements enter the viewport). With Lenis, wire `onScroll` → `scanPendingWowElements()`.

### Scroll-linked word reveal (pinned vision copy)

[scroll-reveal-words.md](scroll-reveal-words.md). Not WOW on the same text.

**GSAP** — when WOW / scroll-reveal patterns do not fit.

## Micro interactions

- Buttons/links: consistent `transition` duration (150–300ms), hover/focus/active states, visible focus rings.
- Primary/secondary CTAs: hover lift, shadow, chevron slide.
- Cards: subtle hover motion when design shows it.
- Touch: adequate hit targets (min ~44px); Embla drag must not block vertical scroll (`touch-action: pan-y` on container).

## Performance

- Isolate carousel client components; avoid dynamic import unless SSR issues.
- Parallax: `transform` only; respect reduced motion.
- Avoid animating `width`, `height`, `top`, `left`; prefer `transform` and `opacity`.

## Build validation

- Typecheck and lint
- Keyboard / dot nav on carousels
- Test reduced motion (Lenis, parallax, WOW)
- Check mobile scroll (Lenis + Embla)
- No horizontal overflow from carousel
