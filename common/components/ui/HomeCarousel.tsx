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
import {
  CAROUSEL_IMAGE_ALTS,
  DEFAULT_CAROUSEL_IMAGES,
} from "@/common/utils/home-content";

export interface HomeCarouselProps {
  images?: readonly string[];
}

function getDishName(src: string, index: number) {
  return CAROUSEL_IMAGE_ALTS[src] || `Fotografía ${index + 1} de Michi Sushi`;
}

export function HomeCarousel({
  images = DEFAULT_CAROUSEL_IMAGES,
}: HomeCarouselProps) {
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

  const currentName = images[selected]
    ? getDishName(images[selected], selected)
    : "";

  return (
    <div className="flex w-full max-w-md flex-col items-center lg:max-w-2xl">
      <Carousel
        className="w-full"
        opts={{ loop: true }}
        plugins={[autoplay]}
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={src}>
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={src}
                  alt={getDishName(src, index)}
                  fill
                  sizes="(min-width: 1024px) 42rem, 28rem"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 0 && (
        <div className="-mt-4 flex flex-col items-center gap-2 md:-mt-6">
          <p
            aria-hidden="true"
            className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] whitespace-nowrap text-zinc-300 uppercase md:gap-4 md:text-sm md:tracking-[0.4em]"
          >
            <span className="via-michi-sake block h-px w-6 shrink-0 bg-linear-to-r from-transparent to-transparent md:w-12" />
            {currentName}
            <span className="via-michi-sake block h-px w-6 shrink-0 bg-linear-to-r from-transparent to-transparent md:w-12" />
          </p>

          {images.length > 1 && (
            <div className="flex items-center">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Ver ${getDishName(src, index)}`}
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
          )}
        </div>
      )}
    </div>
  );
}
