# Scroll-linked word reveal (pinned headline)

Use when Figma shows a large statement that **reveals word-by-word on scroll** (muted → full color), then normal page scroll continues. Typical for intro / vision blocks (e.g. “At the intersection of…”).

## Pattern

1. **Tall pin stage** — wrapper with extra scroll height (`~220vh` mobile, `~260vh` desktop).
2. **Sticky inner** — `position: sticky; top: 0; min-height: 100svh` centers the headline while the user scrolls through the stage.
3. **Word spans** — split copy on whitespace: each word is `<span class="scroll-reveal-word">`. Toggle **`is-on`** from scroll progress.
4. **Progress** — `lib/scroll/wordRevealProgress.ts`:
   - `progress = clamp(-stageRect.top / (stage.offsetHeight - innerHeight), 0, 1)`
   - `activeWords = floor(progress * wordCount)`; word `i` is on when `i < activeWords`.
5. **Reverse scroll** — lowering progress removes `is-on` from the end backward (no extra logic).
6. **Lenis** — update on `useLenis()` callback **and** `window` `scroll`/`resize` (fallback when Lenis is off).
7. **`prefers-reduced-motion`** — show all words `is-on` immediately; no pin scrub.

## Styles (route `page.css` or shared tokens)

```css
.scroll-reveal-word {
  opacity: 0.14;
  color: var(--delta-muted);
  transition: opacity 0.25s linear, color 0.25s linear;
}
.scroll-reveal-word.is-on {
  opacity: 1;
  color: var(--delta-navy);
}
```

Do **not** use WOW line reveals on the same headline; this effect replaces them for that block.

## Reference implementation

- Component: `components/home/IntroScrollReveal.tsx`
- Progress helpers: `lib/scroll/wordRevealProgress.ts`
- Example section: `app/page.tsx` → `#what-we-do` / `.home-intro`

## When to use vs WOW

| Effect | Use |
|--------|-----|
| Scroll scrub word color reveal | This doc + pin stage |
| Enter-viewport fade/rotate headlines | [wow-text-animation.md](wow-text-animation.md) |
