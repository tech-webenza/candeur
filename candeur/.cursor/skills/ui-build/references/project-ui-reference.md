# Project UI Reference



## Styling stack (new pages / Figma + ui-build)



| Concern | Standard |

|--------|----------|

| Layout & components | **Bootstrap 5** |

| Page styles | **`app/<route>/page.css`** (one file per route) |

| Site content width | **`.delta-container`** — **95%** width, all breakpoints |

| Utilities | Bootstrap + page CSS classes — **no Tailwind** on these pages |

| Smooth scroll | **Lenis** |

| Headlines & copy | **WOW.js** — [wow-text-animation.md](wow-text-animation.md) |

| Carousels | **Embla** ([embla-carousel.md](embla-carousel.md)) |



Details: [bootstrap-and-styling.md](bootstrap-and-styling.md) · Figma workflow: [figma-to-page-workflow.md](figma-to-page-workflow.md)



## Typography

Primary font: **Inter** (+ system fallbacks) — `var(--font-delta)` in `globals.css`.

### Body copy scale (entire site)

On `body.site-body` in `globals.css` — **no `clamp()`** on `p`, `a`, or `button`:

| Breakpoint | `p` | `a`, `button` |
|------------|-----|----------------|
| Mobile (&lt; 768px) | 18px | 16px |
| Tablet (768px–1023px) | 20px | 18px |
| Desktop (1024px+) | 1.25vw | 1.15vw |

Headings (`h1`–`h3`) and display stats: route `page.css` / Figma. Do not override `p`/`a`/`button` font sizes in `page.css` for normal copy.



## Layout



Site horizontal container:

- Class: `.delta-container`

- Width: **95%** (mobile, tablet, laptop, desktop — same rule)



Section spacing:

[match Figma / existing pages in `page.css`]



## Breakpoints (Bootstrap 5)



Use Bootstrap's `sm` / `md` / `lg` / `xl` / `xxl` for column and display utilities.



QA viewports: mobile, tablet, laptop, desktop — container stays 95%.



## Components



Search `components/` for Header, Footer, buttons, cards before creating new ones.



Bootstrap patterns first; extract shared React components only when reused across routes.



## Animation



Motion overview:

[motion-and-interactions.md](motion-and-interactions.md)



WOW text:

[wow-text-animation.md](wow-text-animation.md)



Existing wrappers:

Search for `ReactLenis`, `lenis`, `useEmblaCarousel`, `WOW`, `wow`.



## Assets



Main assets:

@public/



## Design principles



- Pixel-perfect Figma parity in `page.css`.

- Reuse Bootstrap grid and existing components.

- One 95% container site-wide.

- No Tailwind on Figma/ui-build pages.

- Avoid unnecessary new dependencies.


