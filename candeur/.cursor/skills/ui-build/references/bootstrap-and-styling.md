# Bootstrap 5, layout, and page CSS (Figma → code)

Default stack for **new pages** built with the `ui-build` skill (especially from Figma): **Next.js App Router + Bootstrap 5 + per-page CSS + Lenis + WOW.js + Embla**. Do **not** use Tailwind CSS utility classes on these pages.

Inspect `package.json` before assuming Bootstrap is installed; add `bootstrap@5` when implementing the first Bootstrap page.

## Pixel-perfect Figma implementation

1. Load the Figma design-to-code skill, then fetch design context/screenshots from Figma MCP.
2. Map Figma frames to semantic sections; use Bootstrap **grid** (`container` / `row` / `col-*`) for structure, not arbitrary nested flex divs.
3. Translate Figma values into the **page CSS file** (font-size, line-height, letter-spacing, colors, gaps, radii, shadows)—match the design; do not round to “nice” numbers when Figma provides exact values.
4. Validate at **mobile, tablet, laptop, and desktop** widths; fix layout in CSS and Bootstrap column breakpoints, not one-off inline styles.
5. Wire **Lenis** (site scroll), **WOW.js** (headlines/copy per [wow-text-animation.md](wow-text-animation.md)), and **Embla** (carousels per [embla-carousel.md](embla-carousel.md)).

## No Tailwind on Figma / ui-build pages

- Do not add `className` strings that rely on Tailwind (`flex`, `grid`, `p-4`, `text-xl`, `md:`, etc.) on new marketing pages.
- Use Bootstrap component/grid classes and **BEM-like or page-scoped classes** defined in that route’s CSS file.
- Global `globals.css` may exist for resets, WOW keyframes, `.delta-container`, and **site-wide body copy scale**; page-specific rules stay in the page CSS file.

## Site-wide body copy (`p`, `a`, `button`)

Define **once** in `app/globals.css` on `body.site-body`. Do **not** use `clamp()` for these tags. Do **not** set `font-size` on `p` / `a` / `button` in route `page.css` unless overriding a one-off (prefer semantic tags + globals).

| Breakpoint | Range | `p` | `a`, `button` |
|------------|--------|-----|----------------|
| Mobile | default (&lt; 768px) | **18px** | **16px** |
| Tablet | 768px–1023px | **20px** | **18px** |
| Desktop | 1024px+ | **1.25vw** | **1.15vw** |

Use CSS variables (e.g. `--font-size-p`, `--font-size-interactive`) and media queries aligned with `desktop-view` / `mobile-view` (1024px). Headings (`h1`–`h3`) keep page-level or Figma-driven sizes in `page.css`.

## Site-wide container: 95% width

Use the **same horizontal content width on every breakpoint** (mobile, tablet, laptop, desktop): **95% of the viewport**, not pixel `max-width` tiers.

Define once in global CSS (e.g. `app/globals.css`):

```css
.delta-container {
  width: 95%;
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
  padding-right: 0;
}
```

Usage in JSX (every page section that should align to the site grid):

```tsx
<div className="delta-container">
  <div className="row">
    <div className="col-12 col-lg-6">...</div>
  </div>
</div>
```

Rules:

- Do not use Bootstrap’s default `.container` max-width breakpoints (576px, 768px, …) for page content unless overridden to 95%.
- Do not set different content widths per device (no `90%` mobile / `1200px` desktop split).
- Header, footer, and all sections share `.delta-container` (or a single outer wrapper with the same 95% rule).

Optional: if Bootstrap `.container` must be used for utilities, override in globals:

```css
.delta-container.container,
.container.delta-container {
  width: 95%;
  max-width: none;
}
```

## Bootstrap 5 in Next.js App Router

1. Install: `npm install bootstrap`
2. Import Bootstrap CSS **once** in root layout (after any custom reset):

```tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
```

3. Bootstrap JS (dropdown, modal, etc.): import only when the page needs interactive Bootstrap plugins—prefer small client components and `bootstrap` JS modules, or native markup + CSS when possible.
4. Prefer Bootstrap **grid**, **utilities** (`d-none`, `d-lg-block`, `g-*`, `order-*`), and **components** (nav, accordion) over custom layout CSS when they match the design.

Breakpoints (align responsive QA with Bootstrap):

| Name   | Bootstrap | Typical use        |
|--------|-----------|--------------------|
| Mobile | `< md`    | single column      |
| Tablet | `md`–`lg` | 2-column layouts   |
| Laptop | `lg`–`xl` | desktop-like grids |
| Desktop| `xl+`     | full compositions  |

Container width remains **95%** at all of the above.

## Per-page CSS file (required)

Each route gets its **own stylesheet**—do not put page-specific rules only in `globals.css`.

**Convention:** colocate with the route:

```
app/
  about/
    page.tsx
    page.css
```

In `page.tsx`:

```tsx
import "./page.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="delta-container">...</div>
    </main>
  );
}
```

- Scope styles with a page root class (e.g. `.about-page`) to avoid leaks.
- Shared tokens (colors, fonts) may live in `globals.css` or `app/theme.css`; section/layout unique to one page stays in `page.css`.
- WOW animation keyframes/classes: shared in `globals.css`; page-only overrides in `page.css` if needed.

## Figma → class naming

- Page root: `.{route}-page`
- Sections: `.{route}-page__hero`, `.{route}-page__features`
- Match Figma layer names only when it aids maintenance; prioritize consistent BEM over copying long Figma names.

## Checklist (ui-build completion)

- [ ] Global `p` / `a` / `button` sizes from `globals.css` (no `clamp()` on those tags; no duplicate `font-size` in `page.css` for body copy)
- [ ] Bootstrap 5 grid; no Tailwind on this page
- [ ] `.delta-container` at 95% for all sections
- [ ] `page.css` imported; styles scoped under page root class
- [ ] Lenis active; WOW on headings/copy; Embla for sliders
- [ ] Responsive: mobile, tablet, laptop, desktop
- [ ] Visual pass against Figma screenshot (pixel-level typography and spacing)
