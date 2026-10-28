"use client";

import { useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shadcn/components/carousel";
import {
  CAROUSEL_IMAGE_ALTS,
  DEFAULT_CAROUSEL_IMAGES,
} from "@/common/utils/home-content";

export interface HomeCarouselProps {
  images?: readonly string[];
}

export function HomeCarousel({ images = DEFAULT_CAROUSEL_IMAGES }: HomeCarouselProps) {
  const [autoplay] = useState(() => Autoplay());

  return (
    <Carousel
      className="w-full max-w-xl"
      opts={{ loop: true }}
      plugins={[autoplay]}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={src}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={CAROUSEL_IMAGE_ALTS[src] || `Fotografía ${index + 1} de Michi Sushi`}
                fill
                sizes="(min-width: 768px) 36rem, 100vw"
                className="object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
