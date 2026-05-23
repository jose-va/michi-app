import { bodoni, montserrat, playfair } from "./fonts/font";
import { HomeCarousel } from "@/common/components/ui/HomeCarousel";

export default function Home() {

  return (
      <section className="flex flex-col gap-3 items-start justify-center py-10 px-5 max-w-100">
        <span className={`${bodoni.className} flex text-5xl md:text-6xl font-bold`}>Michi Sushi</span>
        <span className={`${montserrat.className} font-light`}>Donde el arte del sushi se une al encanto de las tapas, creando una experiencia que combina tradición japonesa con calidez granaína.</span>
        
        <div className="mx-8 md:mx-4 my-4">
          <HomeCarousel />

        </div>
      </section>
  );
}
