import Image from "next/image";
import Link from "next/link";
import { montserrat, playfair } from "./fonts/font";
import { HomeCarousel } from "@/common/components/ui/HomeCarousel";
import { Button } from "@/shadcn/components/button";
import {
  CONFIRMED_SCHEDULE,
  HOME_SECTIONS,
} from "@/common/utils/home-content";
import { Clock, MapPin, CalendarDays } from "lucide-react";

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
              className={`${montserrat.className} text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl`}
            >
              MICHI
              <br />
              SUSHI
            </h1>
            <span
              className="mb-1 text-5xl font-light text-white/40 md:text-6xl"
              aria-hidden="true"
            >
              道
            </span>
          </div>
          <p className="max-w-md text-base text-zinc-300 md:text-lg">
            Cocina japonesa y tapeo artesanal en el corazón de Granada.
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
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              {mottoSection.title}
            </span>
            <p
              className={`${playfair.className} text-2xl leading-relaxed text-zinc-100 italic md:text-3xl`}
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
              Explora una cuidada selección de{" "}
              <strong className="font-bold text-white">
                sushi artesanal
              </strong>
              , <strong className="font-bold text-white">nigiris frescos</strong>{" "}
              y rolls de fusión con el toque único de{" "}
              <strong className="font-bold text-white">Granada</strong>,
              preparados al momento con producto fresco.
            </p>
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full font-semibold shadow-lg"
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
            <span className="absolute right-4 bottom-4 flex size-20 items-center justify-center rounded-full bg-primary p-2 text-center text-xs font-semibold text-primary-foreground md:size-24">
              Explora nuestros platos
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
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <CalendarDays className="size-5" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {reservationsSection.title}
            </h2>
            <p className="text-base text-zinc-300">
              {reservationsSection.description}
            </p>
            <Button asChild size="lg" className="font-semibold shadow-lg">
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
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <MapPin className="size-5" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {locationSection.title}
            </h2>
            <p className="text-base text-zinc-300">
              {locationSection.description}
            </p>
            <Button asChild size="lg" className="font-semibold shadow-lg">
              <Link href={locationSection.actionHref || "/location"}>
                {locationSection.actionLabel}
              </Link>
            </Button>
          </div>

          <div className="relative order-1 aspect-video w-full overflow-hidden md:order-2">
            {locationSection.image && (
              <Image
                src={locationSection.image}
                alt={locationSection.imageAlt || "Ubicación del restaurante"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </section>
      </div>

      {/* 3. Bloque independiente con el horario confirmado (RF-5) */}
      <section
        id="bloque-horarios"
        aria-label="Horario confirmado de apertura"
        className="mx-auto w-full max-w-2xl bg-transparent text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Clock className="size-6" />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Horario de Apertura
          </h2>
          <p className="text-sm text-zinc-400">
            Horario confirmado de atención al público
          </p>
          <div className="w-full divide-y divide-white/10 text-sm md:text-base">
            <div className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:text-left">
              <span className="font-medium text-zinc-200">
                {CONFIRMED_SCHEDULE.weekdays.days}
              </span>
              <span className="font-semibold text-primary">
                {CONFIRMED_SCHEDULE.weekdays.hours.join(" y ")}
              </span>
            </div>
            <div className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:text-left">
              <span className="font-medium text-zinc-200">
                {CONFIRMED_SCHEDULE.sunday.days}
              </span>
              <span className="font-semibold text-zinc-400">
                {CONFIRMED_SCHEDULE.sunday.status}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
