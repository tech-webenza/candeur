# WOW.js text animation (headlines and body copy)

Use this pattern for scroll-triggered text on marketing pages unless the project already documents an equivalent. Initialize scroll WOW once in a client provider (`WowProvider` + `lib/wow/scrollAnimations.ts`) so elements with class `wow` **only animate when they enter the viewport**—never on page load for off-screen content.

Respect `prefers-reduced-motion`: skip animation and show final visible state (`wow-animated wow-reduced`).

## Scroll trigger (required)

1. **Before in view:** `.wow` has `opacity: 0` and `animation-play-state: paused`. Do **not** set `animation-name` on `.wow` alone—only on `.wow.wow-animated`.
2. **When in view:** the provider adds `.wow-animated`, applies `data-wow-delay` as `animation-delay`, and runs the variant class (`fadeInUp`, `fadeInUpRotate`, `fadeInUpLessRotate`).
3. **Lenis:** call `scanPendingWowElements()` on Lenis `onScroll` and on `window` scroll/resize so smooth scroll still triggers animations.
4. **Carousels / dynamic content:** after Embla `select` / `reInit` or client mounts, call `scanPendingWowElements()` again.

Global CSS lives in `app/globals.css`; optional helper: `components/ui/Wow.tsx`.

## All copy and CTAs

Apply `wow fadeInUp` (unless a headline uses rotate variants) to:

- **`h3`** — section/card titles
- **`p`** — body copy, leads, labels
- **`a`** — text links and nav links (`text-link`, footer links)
- **`button`** — CTAs and icon buttons (e.g. carousel nav, play)

Stagger siblings with `data-wow-delay`: first `0.2s`, then `+0.1s` per item (`0.3s`, `0.4s`, …).

Pair primary buttons with **hover micro-interactions** in page CSS (`transform`, `box-shadow`, arrow `translateX`)—see [motion-and-interactions.md](motion-and-interactions.md).

## Desktop vs mobile

| Viewport | `h1` (short / line-based headline) | `h2` (longer multi-line headline) | Paragraphs and other text |
|----------|-------------------------------------|-------------------------------------|---------------------------|
| **Desktop** | Split into lines; `fadeInUpRotate` per line inside overflow wrappers; wrapper `h1.desktop-view` | Split into lines; `fadeInUpLessRotate` per line; wrapper `h2.desktop-view` | Single element: `wow fadeInUp` + `data-wow-delay` on the tag |
| **Mobile** | One block: `wow fadeInUp` on `h1` (no line split, no rotate) | One block: `wow fadeInUp` on `h2` | Same as desktop: `wow fadeInUp` + `data-wow-delay` |

Show/hide duplicate headings with project breakpoints (e.g. `desktop-view` visible from `lg` up, `mobile-view` below `lg`). Do not rely on JavaScript viewport detection for this split.

Example utilities (align with project breakpoint tokens):

```css
@media (max-width: 1023px) {
  .desktop-view {
    display: none;
  }
}

@media (min-width: 1024px) {
  .mobile-view {
    display: none;
  }
}
```

**Delay rule:** First animated line or block uses `data-wow-delay="0.2s"`. Each additional line or staggered sibling adds `0.1s` (0.2s → 0.3s → 0.4s …). Apply the same delay on `data-wow-delay` and inline `animation-delay` when WOW sets visibility inline.

## `h1` — short headline (desktop: line reveal + rotate)

Each phrase or line is wrapped in `overflow: hidden` and animates with `copy wow fadeInUpRotate`.

```html
<h1 class="desktop-view">
  <div style="overflow: hidden;">
    <div
      class="copy wow fadeInUpRotate"
      data-wow-delay="0.2s"
      style="visibility: visible; animation-delay: 0.2s; animation-name: fadeInUpRotate;"
    >
      Luxury Spaces
    </div>
  </div>
  <div style="overflow: hidden;">
    <div
      class="copy wow fadeInUpRotate"
      data-wow-delay="0.3s"
      style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInUpRotate;"
    >
      Born of Vision,
    </div>
  </div>
  <div style="overflow: hidden;">
    <div
      class="copy wow fadeInUpRotate"
      data-wow-delay="0.4s"
      style="visibility: visible; animation-delay: 0.4s; animation-name: fadeInUpRotate;"
    >
      Shaped by You
    </div>
  </div>
</h1>
```

Mobile counterpart (full headline text, no per-line split):

```html
<h1 class="mobile-view wow fadeInUp" data-wow-delay="0.2s">
  Luxury Spaces Born of Vision, Shaped by You
</h1>
```

In React/TSX, prefer a small helper or map over `lines: string[]` for the desktop `h1` to avoid copy-paste drift. Keep `overflow: hidden` on the outer wrapper per line.

## `h2` — longer headline (desktop: line reveal + less rotate)

Same overflow structure as `h1`, but inner divs use `wow fadeInUpLessRotate` only (no `copy` class).

```html
<h2 class="desktop-view">
  <div style="overflow: hidden;">
    <div
      class="wow fadeInUpLessRotate"
      data-wow-delay="0.2s"
      style="visibility: visible; animation-delay: 0.2s; animation-name: fadeInUpLessRotate;"
    >
      Building More Than Structures,
    </div>
  </div>
  <div style="overflow: hidden;">
    <div
      class="wow fadeInUpLessRotate"
      data-wow-delay="0.3s"
      style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInUpLessRotate;"
    >
      Creating Legacies
    </div>
  </div>
</h2>
```

Mobile:

```html
<h2 class="mobile-view wow fadeInUp" data-wow-delay="0.2s">
  Building More Than Structures, Creating Legacies
</h2>
```

## Paragraphs, labels, and other text

Add `wow fadeInUp` on the element itself (or a single wrapper), with `data-wow-delay` staggered per sibling (0.2s base, +0.1s per item). Do not use rotate variants on body copy.

```html
<p class="wow fadeInUp" data-wow-delay="0.2s">First paragraph.</p>
<p class="wow fadeInUp" data-wow-delay="0.3s">Second paragraph.</p>
```

## CSS (global)

Add WOW keyframes and animation classes to `app/globals.css` (shared across routes). Page-specific typography that wraps WOW markup belongs in that route's `page.css`. See [bootstrap-and-styling.md](bootstrap-and-styling.md).

If not already present in globals:

```css
@-webkit-keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translateY(25px);
    transform: translateY(25px);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translateY(25px);
    -ms-transform: translateY(25px);
    transform: translateY(25px);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
}

@keyframes fadeInUpRotate {
  0% {
    opacity: 0;
    -webkit-transform: translateY(50px);
    -ms-transform: translateY(50px);
    transform: translateY(50px) rotate(10deg);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0) rotate(0deg);
  }
}

.fadeInUpRotate {
  -webkit-animation-name: fadeInUpRotate;
  animation-name: fadeInUpRotate;
  animation-duration: 0.8s !important;
}

@keyframes fadeInUpLessRotate {
  0% {
    opacity: 0;
    -webkit-transform: translateY(30px) rotate(5deg);
    -ms-transform: translateY(30px) rotate(5deg);
    transform: translateY(30px) rotate(5deg);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0) rotate(0deg);
  }
}

.fadeInUpLessRotate {
  -webkit-animation-name: fadeInUpLessRotate;
  animation-name: fadeInUpLessRotate;
  animation-duration: 0.8s !important;
}

.fadeInUp {
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  animation-duration: 1.3s !important;
}
```

## Implementation notes (Next.js)

- WOW.js runs on the client; wrap init in a thin `"use client"` provider. Keep page sections as Server Components where possible and pass static headline lines as props.
- Semantic HTML: one logical heading per level per viewport variant (`desktop-view` / `mobile-view`), not duplicate SEO titles on both at once—hide the inactive variant from assistive tech if both exist in the DOM (`aria-hidden` on the hidden breakpoint variant, or render one variant via CSS `display` with care for screen readers).
- After hydration, WOW may set `visibility` and `animation-name` inline; that is expected.
- For new pages, follow this doc before introducing GSAP line splits for the same effect.
