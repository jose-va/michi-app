import { bodoni, montserrat, playfair } from "./fonts/font";
import { HomeCarousel } from "@/common/components/ui/HomeCarousel";
import Link from "next/link";
import { Button } from "@/shadcn/components/button";

export default function Home() {
  return (
    <section className="grid-cols grid px-5 py-10 md:grid-cols-2">
      <div className="flex w-full max-w-100 flex-col justify-center">
        <div className="flex items-end gap-2">
          <span
            className={`${montserrat.className} text-5xl leading-tight font-bold md:text-6xl`}
          >
            MICHI
            <br />
            SUSHI
          </span>
          <span className="mb-1 text-5xl text-white/50">道</span>
        </div>

        <span className={`${montserrat.className} font-light mt-2`}>
          Donde el arte del sushi se une al encanto de las tapas, creando una
          experiencia que combina tradición japonesa con calidez granaína.
        </span>
        <Button
          asChild
          className="mt-4 w-fit hover:scale-105 hover:brightness-110"
        >
          <Link href="/product">Explora la carta</Link>
        </Button>
      </div>

      <div className="mt-20 flex justify-center">
        <HomeCarousel />
      </div>
    </section>
  );
}
