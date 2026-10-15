---
name: next-seo
description: Implements and audits SEO for Next.js App Router using the Metadata API, Open Graph, Twitter cards, robots, sitemaps, canonical URLs, and structured data. Use when the user mentions SEO, meta tags, search ranking, sharing previews, or sitemap/robots.
---

# Next.js SEO

Preserve existing metadata unless the task explicitly changes it. Use App Router conventions (Next.js 13+ / 16).

## Workflow

1. Read current `metadata` / `generateMetadata` on the target route (`app/layout.tsx`, `app/page.tsx`, segment layouts).
2. Compare with content on the page (title, description, headings, visible copy).
3. Apply missing or incorrect fields with minimal scope.
4. Validate titles/descriptions length and uniqueness per route.

## Global metadata (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // use real production URL
  title: {
    default: "Site name",
    template: "%s | Site name",
  },
  description: "Unique default description.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Site name",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

Set `metadataBase` so relative OG image paths resolve correctly.

## Per-page metadata

**Static page**

```tsx
export const metadata: Metadata = {
  title: "Page title",
  description: "Page-specific description.",
  alternates: { canonical: "/path" },
  openGraph: {
    title: "Page title",
    description: "Page-specific description.",
    url: "/path",
    images: [{ url: "/og/page.png", width: 1200, height: 630, alt: "..." }],
  },
};
```

**Dynamic page**

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getData(params);
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `/items/${params.slug}` },
  };
}
```

## On-page SEO (markup)

- One clear `<h1>` per page; logical heading hierarchy (`h2`, `h3`).
- When using WOW desktop/mobile headline variants (`desktop-view` / `mobile-view`), only one variant should be exposed to assistive tech and crawlers as the primary heading—hide the inactive variant with `aria-hidden="true"` or equivalent so you do not emit duplicate `h1` text. See [ui-build/references/wow-text-animation.md](../ui-build/references/wow-text-animation.md).
- Meaningful link text; avoid "click here" only.
- `lang` on `<html>` (e.g. `en`).
- Images: descriptive `alt` on content images.

## Technical

- **`app/robots.ts`**: allow/disallow rules; sitemap URL.
- **`app/sitemap.ts`**: static and dynamic URLs with `lastModified` when known.
- **Canonical**: `alternates.canonical` for duplicate or parameterized URLs.
- **noindex**: only for staging, thank-you pages, or explicit product rules via `robots: { index: false }`.

## Structured data

- Add JSON-LD via `<script type="application/ld+json">` in a Server Component or dedicated component for Organization, WebSite, Article, BreadcrumbList as required.
- Match visible content; do not stuff keywords.

## Social previews

- OG image 1200×630 (or project standard); consistent `og:title`, `og:description`, `og:url`.
- Twitter `card` and image aligned with OG when possible.

## Do not

- Change routing or APIs for SEO-only requests unless asked.
- Remove existing analytics or verification meta without instruction.
- Duplicate conflicting titles across layout template and page.

## Checklist

- [ ] Unique title and description per important route
- [ ] `metadataBase` set for production
- [ ] Canonical on indexable pages
- [ ] robots + sitemap if project uses them
- [ ] OG/Twitter for shareable pages
- [ ] Accessible headings and alt text
