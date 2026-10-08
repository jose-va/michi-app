"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shadcn/components/carousel";
import { resolveGallery, type ImageLoadStatus } from "@/common/utils/home-gallery";
import {
  AUTOPLAY_INTERVAL_MS,
  REDUCED_MOTION_QUERY,
  shouldAutoplay,
} from "@/common/utils/home-autoplay";
import {
  CAROUSEL_IMAGE_ALTS,
  DEFAULT_CAROUSEL_IMAGES,
} from "@/common/utils/home-content";
import { cn } from "@/lib/utils";

export interface HomeCarouselProps {
  images?: readonly string[];
  initialLoadStatus?: Record<string, ImageLoadStatus>;
  className?: string;
}

export function HomeCarousel({
  images = DEFAULT_CAROUSEL_IMAGES,
  initialLoadStatus,
  className,
}: HomeCarouselProps) {
  const [loadStatus, setLoadStatus] = useState<Record<string, ImageLoadStatus>>(() => {
    if (initialLoadStatus) return initialLoadStatus;
    const initial: Record<string, ImageLoadStatus> = {};
    for (const img of images) {
      initial[img] = "loaded";
    }
    return initial;
  });

  const [api, setApi] = useState<CarouselApi>();
  const [hasPointer, setHasPointer] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = resolveGallery(images, loadStatus);
  const slideCount = validImages.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (
      !api ||
      !shouldAutoplay(slideCount, hasPointer, hasFocus, prefersReducedMotion)
    ) {
      return;
    }

    const id = window.setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
    };
  }, [api, slideCount, hasPointer, hasFocus, prefersReducedMotion]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleImageError = (failedSrc: string) => {
    setLoadStatus((prev) => ({
      ...prev,
      [failedSrc]: "failed",
    }));
  };

  // RF-10: Si hay 0 imágenes cargables, no mostrar contenido en el carrusel
  if (slideCount === 0) {
    return null;
  }

  // RF-1, RF-10: Si solo hay 1 imagen cargable, mantenerla visible sin autoplay ni controles manuales
  if (slideCount === 1) {
    const singleImage = validImages[0];
    return (
      <div
        className={cn("w-full max-w-xs sm:max-w-sm md:max-w-md", className)}
        data-testid="home-carousel-single"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={singleImage}
            alt={CAROUSEL_IMAGE_ALTS[singleImage] || "Fotografía de Michi Sushi"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority
            onError={() => handleImageError(singleImage)}
          />
        </div>
      </div>
    );
  }

  // Más de 1 imagen cargable: carrusel con avance automático, sin botones manuales visibles
  return (
    <div
      className={cn("relative w-full max-w-xs sm:max-w-sm md:max-w-md", className)}
      onMouseEnter={() => setHasPointer(true)}
      onMouseLeave={() => setHasPointer(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHasFocus(false);
        }
      }}
      data-testid="home-carousel-multi"
    >
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {validImages.map((src, index) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={src}
                  alt={CAROUSEL_IMAGE_ALTS[src] || `Fotografía ${index + 1} de Michi Sushi`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  priority={index === selectedIndex}
                  onError={() => handleImageError(src)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
