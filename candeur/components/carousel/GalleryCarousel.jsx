"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { readGalleryProgress } from "@/lib/embla/galleryProgress";
import { scanPendingWowElements } from "@/lib/wow/scrollAnimations";
import "@/components/carousel/embla.css";

function createGalleryAutoScrollPlugin() {
  return AutoScroll({
    direction: "forward",
    speed: 1.2,
    startDelay: 0,
    playOnInit: false,
    stopOnFocusIn: true,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });
}

export default function GalleryCarousel({ slides }) {
  const autoScrollRef = useRef(null);
  if (!autoScrollRef.current) {
    autoScrollRef.current = createGalleryAutoScrollPlugin();
  }

  const marqueeSlides = useMemo(() => [...slides, ...slides], [slides]);
  const contentSets = 2;

  const rootRef = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [autoScrollRef.current]
  );

  const setViewportRef = useCallback(
    (node) => {
      emblaRef(node);
      rootRef.current = node;
    },
    [emblaRef]
  );

  const [progress, setProgress] = useState(0);
  const isActiveRef = useRef(false);

  const syncProgress = useCallback(() => {
    if (!emblaApi) return;
    setProgress(readGalleryProgress(emblaApi, contentSets));
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    syncProgress();
    scanPendingWowElements();
  }, [syncProgress]);

  useEffect(() => {
    if (!emblaApi || !rootRef.current) return;

    let rafId = 0;
    const tick = () => {
      if (isActiveRef.current) syncProgress();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    syncProgress();
    emblaApi.on("scroll", syncProgress);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", syncProgress);
    emblaApi.on("pointerUp", syncProgress);
    emblaApi.on("settle", syncProgress);

    return () => {
      cancelAnimationFrame(rafId);
      emblaApi.off("scroll", syncProgress);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", syncProgress);
      emblaApi.off("pointerUp", syncProgress);
      emblaApi.off("settle", syncProgress);
    };
  }, [emblaApi, syncProgress, onSelect]);

  useEffect(() => {
    if (!emblaApi || !rootRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoScroll = emblaApi.plugins()?.autoScroll;

    const start = () => {
      isActiveRef.current = true;
      syncProgress();
      if (autoScroll && !reducedMotion && !autoScroll.isPlaying()) {
        autoScroll.play();
      }
    };
    const stop = () => {
      isActiveRef.current = false;
      autoScroll?.stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(rootRef.current);

    return () => {
      observer.disconnect();
      isActiveRef.current = false;
      autoScroll?.stop();
    };
  }, [emblaApi, syncProgress]);

  return (
    <div className="gallery-carousel embla gallery-carousel--marquee">
      <div className="embla__viewport" ref={setViewportRef}>
        <div className="embla__container">
          {marqueeSlides.map((slide, index) => (
            <div className="embla__slide" key={`${slide.id}-${index}`}>
              <figure className="gallery-card">
                <div className="gallery-card__media">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    loading="lazy"
                    width={800}
                    height={540}
                  />
                </div>
                <figcaption className="gallery-card__label">{slide.label}</figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <div className="gallery-progress" aria-hidden="true">
        <div className="gallery-progress__track">
          <div className="gallery-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
