"use client";

import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import "@/components/carousel/embla.css";

const AUTOPLAY_DELAY_MS = 2000;

function createFadePlugin() {
  return Fade();
}

function createAutoplayPlugin() {
  return Autoplay({
    delay: AUTOPLAY_DELAY_MS,
    playOnInit: false,
    jump: false,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
  });
}

function isCarouselInView(node) {
  const rect = node.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewportHeight * 0.85 && rect.bottom > viewportHeight * 0.15;
}

export default function TrustVisualCarousel({ slides }) {
  const fadeRef = useRef(null);
  const autoplayRef = useRef(null);
  if (!fadeRef.current) fadeRef.current = createFadePlugin();
  if (!autoplayRef.current) autoplayRef.current = createAutoplayPlugin();

  const rootRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 35,
      watchDrag: true,
    },
    [fadeRef.current, autoplayRef.current]
  );

  const setViewportRef = useCallback(
    (node) => {
      emblaRef(node);
      rootRef.current = node;
    },
    [emblaRef]
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!emblaApi || !node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const autoplay = emblaApi.plugins()?.autoplay;

    const start = () => {
      if (!autoplay || reducedMotion.matches) return;
      autoplay.play();
    };
    const stop = () => autoplay?.stop();

    const syncPlayback = () => {
      if (isCarouselInView(node)) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);

    syncPlayback();
    emblaApi.on("reInit", syncPlayback);
    window.addEventListener("resize", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);

    return () => {
      observer.disconnect();
      emblaApi.off("reInit", syncPlayback);
      window.removeEventListener("resize", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      stop();
    };
  }, [emblaApi]);

  return (
    <div className="trust-visual-carousel embla embla--fade">
      <div className="embla__viewport trust-visual" ref={setViewportRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide trust-visual__slide" key={slide.id}>
              <img src={slide.src} alt={slide.alt} width={1722} height={605} loading="lazy" />
              <span className="trust-visual__tag">{slide.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
