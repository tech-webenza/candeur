# Embla Carousel (Figma carousels)

**Default carousel library** for this project. Do not use Swiper or hand-rolled snap sliders for Figma carousel designs.

Packages: `embla-carousel`, `embla-carousel-react`.

## Setup

- Shared options: `lib/embla/defaults.ts` (`EMBLA_SMOOTH_OPTIONS` — `duration: 28` for smooth snap).
- Base layout CSS: `components/carousel/embla.css` (`.embla`, `.embla__viewport`, `.embla__container`, `.embla__slide`).
- Controls hook: `hooks/useEmblaCarouselA11y.ts` (selected index, prev/next, `scrollTo`).
- Image parallax: `hooks/useEmblaParallax.ts` — mark inner layer with `data-embla-parallax` inside `.embla-parallax`.

## Markup pattern

```tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { EMBLA_SMOOTH_OPTIONS } from "@/lib/embla/defaults";
import "@/components/carousel/embla.css";

const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_SMOOTH_OPTIONS);

<div className="embla my-carousel">
  <div className="embla__viewport" ref={emblaRef}>
    <div className="embla__container">
      {items.map((item) => (
        <div className="embla__slide" key={item.id}>...</div>
      ))}
    </div>
  </div>
</div>
```

## Responsive slides per view

Use CSS variables on a scoped wrapper (not `clamp` on slide size):

```css
.my-carousel {
  --embla-slide-spacing: 1.5rem;
  --embla-slide-size: 100%;
}
@media (min-width: 768px) {
  .my-carousel { --embla-slide-size: 50%; }
}
@media (min-width: 1200px) {
  .my-carousel { --embla-slide-size: 33.333%; }
}
```

## Smooth behavior

- Tune `duration` in `EMBLA_SMOOTH_OPTIONS` (higher = slower glide).
- `dragFree: false` for snap carousels; `loop: true` only when design needs infinite scroll and slide count supports it.
- `touch-action: pan-y` on `.embla__container` (in `embla.css`) so vertical page scroll still works.

## Parallax images

When Figma shows depth on slide photos:

```tsx
<div className="embla-parallax">
  <div className="embla-parallax__layer" data-embla-parallax>
    <Image fill ... />
  </div>
</div>
```

Call `useEmblaParallax(emblaApi)` in the same client component. Disabled when `prefers-reduced-motion: reduce`.

## WOW + dynamic slides

After `select` / `reInit`, call `scanPendingWowElements()` so newly visible slide copy animates.

## Synced dual carousels (copy slide + image fade)

When Figma shows **left copy sliding** and **right image cross-fading**:

1. **Copy:** standard horizontal Embla (`useEmblaCarousel(EMBLA_SMOOTH_OPTIONS)`).
2. **Media:** second Embla with `embla-carousel-fade` plugin (`Fade()`), `watchDrag: false`.
3. On copy `select` / `reInit`, call `fadeApi.scrollTo(copyApi.selectedScrollSnap())`.
4. Dots and prev/next call `copyApi.scrollTo(i)` (fade follows via sync).
5. Give the media column explicit `min-height` and `position: absolute; inset: 0` on `next/image` fill wrapper.

Reference: `components/home/LifeAtCarousel.tsx`.

## Reference components

- `components/home/RolesCarousel.tsx` — multi-column breakpoints + nav arrows.
- `components/home/LifeAtCarousel.tsx` — dual synced carousels, dot tabs, fade images.

## Accessibility

- Prev/next: `aria-label` on buttons.
- Dots: `role="tablist"` / `role="tab"` / `aria-selected`.
- Keyboard: Embla handles arrow keys when viewport is focused; ensure focusable controls.
