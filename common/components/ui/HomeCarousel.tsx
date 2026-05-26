import Image from "next/image";
import { Card, CardContent } from "@/shadcn/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shadcn/components/carousel";

const images = [
  "/images/michi-image1.webp",
  "/images/michi-image2.webp",
];

export function HomeCarousel() {
  return (
    <Carousel className="w-full max-w-60 sm:max-w-xs">
      <CarouselContent>
        {images.map((value, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="relative aspect-square">
                <Image
                  src={value}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover "
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
