---
name: motion-rolling-buttons
description: Staggered rolling text on buttons and CTA links via Motion UI pattern (shadcn @motion/button-rolling-text-stagger). Use when adding or styling site buttons, header CTAs, or btn-delta links.
---

# Motion rolling buttons (Delta)

## Stack

- **Component:** `components/ui/button-rolling-text-stagger.tsx` (`RollingTextButton`, `RollingTextLinkLabel`)
- **Wrappers:** `components/ui/delta-button.tsx` (`DeltaButton`, `DeltaButtonLink`, `DeltaHeaderCta`)
- **Styles:** `components/ui/button-rolling-text-stagger.css` + existing `.btn-delta` / `.site-header__cta` in route CSS
- **Dependency:** `motion` (`motion/react`)

## Official Motion UI install (optional upgrade)

1. Set `MOTION_TOKEN` (see [Motion UI install](https://motion.dev/ui/install)).
2. Copy `.npmrc.example` → `.npmrc` when using Motion+ npm packages.
3. `components.json` already defines the `@motion` registry.
4. Replace the local implementation with the registry version:

```bash
npx shadcn@latest add @motion/button-rolling-text-stagger
```

Keep project-specific styling in `DeltaButtonLink` / `DeltaHeaderCta` wrappers, not inside the generated file.

## Usage

**CTA link (icon after label):**

```tsx
import { DeltaButtonLink } from "@/components/ui/delta-button";

<DeltaButtonLink
  href="#join"
  label="Explore Opportunities"
  className="btn-delta--primary wow fadeInUp"
  iconSrc="/images/home/arrow-red.svg"
  iconWidth={26}
  iconHeight={26}
/>
```

**Header CTA:**

```tsx
import { DeltaHeaderCta } from "@/components/ui/delta-button";

<DeltaHeaderCta href="#contact" label="Contact Us" iconSrc="/images/home/arrow-link.svg" />
```

**Native button:**

```tsx
import { DeltaButton } from "@/components/ui/delta-button";

<DeltaButton type="submit" label="Send message" className="btn-delta btn-delta--primary" />
```

## Rules

- Use **string labels** only (rolling effect duplicates label text).
- Icon-only controls (play, carousel arrows, dot nav) keep existing hover CSS — do not force rolling text.
- Respects `prefers-reduced-motion` (no roll animation).
- Do not add Tailwind utilities to Bootstrap marketing pages; keep layout in `page.css` and `btn-delta` classes.
- Remove duplicate `btn-delta` hover transforms when using wrappers (lift applies to `.delta-rolling-link` / `.delta-rolling-btn`).

## Related

- Landing data/API: `lib/landing/content.ts`, `app/api/landing/news/route.ts`
- Performance: `.cursor/skills/next-performance/SKILL.md`
- Route handlers: `.cursor/skills/next-api-routes/SKILL.md`
