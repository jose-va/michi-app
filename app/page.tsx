import Image from "next/image";
import Link from "next/link";
import { montserrat, playfair, sigokae, centuryGothic } from "./fonts/font";
import { HomeCarousel } from "@/common/components/ui/HomeCarousel";
import GoogleMaps from "@/common/components/ui/location/GoogleMaps";
import { Button } from "@/shadcn/components/button";
import { HOME_SECTIONS } from "@/common/utils/home-content";

export default function Home() {
  const [mottoSection, menuSection, reservationsSection, locationSection] =
    HOME_SECTIONS;

  return (
    <div className="flex flex-col gap-16 bg-transparent pb-20 md:gap-24">
      {/* 1. Encabezado superior con nombre del restaurante y carrusel (RF-1) */}
      <section
        aria-label="Bienvenida y carrusel principal"
        className="grid items-center gap-10 py-6 md:grid-cols-2 md:py-12"
      >
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-end gap-3">
            <h1
              className={`${sigokae.className} text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl`}
            >
              <span className="block">MICHI</span>
              <span className="block">SUSHI</span>
            </h1>
            <span className="mb-4 text-3xl text-white/40" aria-hidden="true">
              道
            </span>
          </div>
          <p className="max-w-lg text-base text-zinc-300 md:text-lg">
            Gastronomía japonesa y tapeo en el norte de Granada.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <HomeCarousel />
        </div>
      </section>

      {/* 2. Cuatro secciones descriptivas en orden estricto, sobre el fondo (RF-3) */}
      <div className="flex flex-col gap-16 md:gap-20">
        {/* Sección 1: Lema del bar */}
        <section
          id="seccion-lema"
          aria-label="Lema del restaurante"
          className="mx-auto w-full max-w-3xl bg-transparent px-2 text-center"
        >
          <div className="space-y-3">
            <span className="text-primary text-xs font-bold tracking-widest uppercase brightness-120">
              {mottoSection.title}
            </span>
            <p
              className={`${playfair.className} text-2xl leading-relaxed text-zinc-300 italic md:text-3xl`}
            >
              &ldquo;{mottoSection.description}&rdquo;
            </p>
          </div>
        </section>

        {/* Sección 2: Carta con detalle medible RNF-4 (RF-3, RF-4, RF-6) */}
        <section
          id="seccion-carta"
          aria-label="Carta de Michi Sushi"
          className="grid grid-cols-1 items-center gap-8 bg-transparent md:grid-cols-2"
        >
          <div className="order-2 flex flex-col items-start gap-4 md:order-1">
            <h2
              className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
            >
              {menuSection.title}
            </h2>
            <p className="text-base text-zinc-300 md:text-lg">
              Explora nuestra selección de{" "}
              <strong className="font-bold text-white">sushi</strong>,{" "}
              <strong className="font-bold text-white">nigiris </strong>y
              <strong className="font-bold text-white"> maki rolls. </strong>
              Todos nuestros productos se preparan al momento con productos
              frescos.
            </p>
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-black font-semibold shadow-lg"
            >
              <Link href={menuSection.actionHref || "/product"}>
                {menuSection.actionLabel}
              </Link>
            </Button>
          </div>

          <div className="relative order-1 aspect-video w-full overflow-hidden md:order-2">
            {menuSection.image && (
              <Image
                src={menuSection.image}
                alt={menuSection.imageAlt || "Carta de sushi"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <span className="absolute right-4 bottom-4 flex size-24 flex-col items-center justify-center rounded-full bg-linear-to-br from-amber-400 via-orange-400 to-amber-600 p-2.5 text-center text-white shadow-lg ring-2 shadow-orange-950/20 ring-white/50 md:size-28">
              <span className="text-[9px] font-bold tracking-widest text-amber-100 uppercase drop-shadow-sm">
                Fusión Tropical
              </span>
              <span className="mt-0.5 text-xs leading-tight font-black tracking-tight text-white drop-shadow md:text-sm">
                Ebi &amp; Maracuyá
              </span>
            </span>
          </div>
        </section>

        {/* Sección 3: Reservas (texto descriptivo, imagen y botón a /reservation) */}
        <section
          id="seccion-reservas"
          aria-label="Reservas en Michi Sushi"
          className="grid items-center gap-8 bg-transparent md:grid-cols-2"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            {reservationsSection.image && (
              <Image
                src={reservationsSection.image}
                alt={reservationsSection.imageAlt || "Reservas en restaurante"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          <div className="flex flex-col items-start gap-4">
            <h2
              className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
            >
              {reservationsSection.title}
            </h2>
            <p className="text-base text-zinc-300 md:text-lg">
              {reservationsSection.description}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-black font-semibold shadow-lg"
            >
              <Link href={reservationsSection.actionHref || "/reservation"}>
                {reservationsSection.actionLabel}
              </Link>
            </Button>
          </div>
        </section>

        {/* Sección 4: Ubicación (texto descriptivo, imagen y botón a /location) */}
        <section
          id="seccion-ubicacion"
          aria-label="Ubicación de Michi Sushi"
          className="grid items-center gap-8 bg-transparent md:grid-cols-2"
        >
          <div className="order-2 flex flex-col items-start gap-4 md:order-1">
            <h2
              className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
            >
              {locationSection.title}
            </h2>
            <p className="text-base text-zinc-300 md:text-lg">
              {locationSection.description}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-black font-semibold shadow-lg"
            >
              <Link href={locationSection.actionHref || "/location"}>
                {locationSection.actionLabel}
              </Link>
            </Button>
          </div>

          <div className="relative order-1 aspect-video w-full overflow-hidden md:order-2">
            <GoogleMaps zoom={15} />
          </div>
        </section>
      </div>
    </div>
  );
}
