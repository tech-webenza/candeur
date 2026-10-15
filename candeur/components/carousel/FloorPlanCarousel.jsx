"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { EMBLA_SMOOTH_OPTIONS } from "@/lib/embla/defaults";

export default function FloorPlanCarousel({ plans, onDownloadClick }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...EMBLA_SMOOTH_OPTIONS,
    loop: true,
  });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  const plan = plans[index] || plans[0];

  return (
    <div className="floorplan-carousel embla">
      <div className="floorplan-carousel__stage">
        <button
          type="button"
          className="floorplan-nav floorplan-nav--prev"
          aria-label="Previous plan"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 51" fill="none">
            <path d="M27.7924 1.00855C26.4477 -0.336183 24.2646 -0.336183 22.9199 1.00855L1.0086 22.9232C-0.336132 24.2679 -0.336132 26.4477 1.0086 27.7924L22.9199 49.707C24.2646 51.0518 26.4477 51.0518 27.7924 49.707C29.1363 48.3628 29.1356 46.1826 27.7924 44.8379L8.58432 25.2319L27.7924 5.87772C29.1356 4.53302 29.1363 2.35283 27.7924 1.00855Z" fill="#142B22" />
          </svg>
        </button>
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {plans.map((item) => (
              <div className="embla__slide" key={item.id}>
                <div className="floorplan-slide">
                  <img src={item.src} alt={item.alt} width={962} height={566} loading="lazy" />
                  <a
                    className="floorplan-download"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onDownloadClick?.(item);
                    }}
                    aria-haspopup="dialog"
                  >
                    Download Plan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="floorplan-nav floorplan-nav--next"
          aria-label="Next plan"
          onClick={() => emblaApi?.scrollNext()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 51" fill="none">
            <path d="M1.00762 1.00855C2.35234 -0.336183 4.53543 -0.336183 5.88015 1.00855L27.7915 22.9232C29.1362 24.2679 29.1362 26.4477 27.7915 27.7924L5.88015 49.707C4.53543 51.0518 2.35234 51.0518 1.00762 49.707C-0.336212 48.3628 -0.335531 46.1826 1.00762 44.8379L20.2157 25.2319L1.00762 5.87772C-0.335531 4.53302 -0.336212 2.35283 1.00762 1.00855Z" fill="#142B22" />
          </svg>
        </button>
      </div>
      <div className="floorplan-meta">
        <p className="floorplan-meta__title wow fadeInUp" data-wow-delay="0.2s">
          {plan.title}
        </p>
        <p className="floorplan-meta__detail wow fadeInUp" data-wow-delay="0.3s">
          {plan.detail}
        </p>
      </div>
    </div>
  );
}
