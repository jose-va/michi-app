"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shadcn/components/carousel";
import { CAROUSEL_SLIDES } from "@/common/utils/home-content";

export function HomeCarousel() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 lg:max-w-2xl">
      <Carousel
        className="w-full"
        opts={{ loop: true }}
        plugins={[autoplay]}
        setApi={setApi}
      >
        <CarouselContent>
          {CAROUSEL_SLIDES.map(({ src, name }) => (
            <CarouselItem key={src}>
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={src}
                  alt={name}
                  fill
                  sizes="(min-width: 1024px) 42rem, 28rem"
                  className="object-cover"
                />
              </div>
              <p
                aria-hidden="true"
                className="relative -mt-4 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.25em] whitespace-nowrap text-zinc-300 uppercase md:-mt-6 md:gap-4 md:text-sm md:tracking-[0.4em]"
              >
                <span className="via-michi-sake block h-px w-6 shrink-0 bg-linear-to-r from-transparent to-transparent md:w-12" />
                {name}
                <span className="via-michi-sake block h-px w-6 shrink-0 bg-linear-to-r from-transparent to-transparent md:w-12" />
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center">
        {CAROUSEL_SLIDES.map(({ src, name }, index) => (
          <button
            key={src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ver ${name}`}
            aria-current={index === selected ? "true" : undefined}
            className="group rounded-full p-2 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                index === selected
                  ? "bg-michi-sake w-6"
                  : "w-1.5 bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
