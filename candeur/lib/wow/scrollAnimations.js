const WOW_SELECTOR = ".wow:not(.wow-animated)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.92 && rect.bottom > 0;
}

function animateElement(el) {
  if (el.classList.contains("wow-animated")) return;
  el.classList.add("wow-animated");
  if (prefersReducedMotion()) {
    el.classList.add("wow-reduced");
    el.style.visibility = "visible";
    el.style.opacity = "1";
    el.style.animation = "none";
    return;
  }
  const delay = el.getAttribute("data-wow-delay") || "0s";
  el.style.visibility = "visible";
  el.style.animationDelay = delay;
  const name = ["fadeInUpRotate", "fadeInUpLessRotate", "fadeInUp"].find((c) =>
    el.classList.contains(c)
  );
  if (name) el.style.animationName = name;
}

export function scanPendingWowElements() {
  if (typeof document === "undefined") return;
  document.querySelectorAll(WOW_SELECTOR).forEach((el) => {
    if (isInViewport(el)) animateElement(el);
  });
}

export function initWowScrollAnimations() {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) {
    document.querySelectorAll(".wow").forEach((el) => {
      el.classList.add("wow-animated", "wow-reduced");
      el.style.visibility = "visible";
      el.style.opacity = "1";
      el.style.animation = "none";
    });
    return () => {};
  }
  const onScroll = () => scanPendingWowElements();
  scanPendingWowElements();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
