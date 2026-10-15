/**
 * Maps Embla scroll position to 0–100% for one content cycle (e.g. duplicated marquee track).
 */
export function readGalleryProgress(emblaApi, contentSets = 2) {
  if (!emblaApi) return 0;
  const value = emblaApi.scrollProgress();
  if (!Number.isFinite(value)) return 0;

  const sets = Math.max(1, contentSets);
  const cycle = 1 / sets;
  let part = value / cycle;
  part = part % 1;
  if (part < 0) part += 1;

  return part * 100;
}
