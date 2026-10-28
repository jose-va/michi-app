import { Button } from "@/shadcn/components/button";
import GoogleMaps from "../../ui/location/GoogleMaps";
import {
  MICHI_ADDRESS,
  MICHI_LOCATION,
  getDirectionsUrl,
  getPlaceUrl,
} from "@/common/utils/location";
import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";
import type { ReactNode } from "react";
import { montserrat } from "@/app/fonts/font";
import { CONFIRMED_SCHEDULE } from "@/common/utils/home-content";

const DIRECTIONS_URL = getDirectionsUrl(MICHI_LOCATION);
const PLACE_URL = getPlaceUrl(MICHI_LOCATION);

// Spec 004 T7 — Ranura opcional para la sección inferior de reseñas
// (RF-3, RF-11): se renderiza como hermana DESPUÉS de la sección 003,
// nunca dentro del bloque mapa + panel; la 003 queda intacta y no se
// desplaza. Con ranura nula no se pinta nada (omisión limpia).
export default function LocationPage({
  reviewsSlot = null,
}: {
  reviewsSlot?: ReactNode;
}) {
  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-10 pb-6 md:py-8">
        <header className="flex flex-col items-center gap-3 rounded-lg bg-gradient-to-b from-black/60 via-black/40 via-80% to-transparent px-4 py-8 text-center md:py-10">
          <div className="flex w-full items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="hidden h-px w-8 bg-[#f5efe0]/50 min-[400px]:block sm:w-16"
            />
            <p className="text-sm font-semibold tracking-[0.35em] text-[#f5efe0] uppercase">
              Michi Sushi Bar
            </p>
            <span
              aria-hidden="true"
              className="hidden h-px w-8 bg-[#f5efe0]/50 min-[400px]:block sm:w-16"
            />
          </div>
          <h1
            className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.5)] md:text-5xl`}
          >
            Estamos en Granada
          </h1>
          <p className="max-w-xl text-lg text-white/80 md:text-xl">
            Ven a descubrir tu nuevo sushi bar.
          </p>
          <span
            aria-hidden="true"
            className="bg-primary mt-1 h-1 w-24 rounded-lg"
          />
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="h-96 overflow-hidden rounded-lg border border-white/10 shadow-2xl lg:h-auto lg:min-h-[28rem]">
            <GoogleMaps />
          </div>

          <aside className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/50 p-6 backdrop-blur-md">
            <div className="flex gap-4">
              <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <MapPin className="size-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-white">Dirección</h2>
                <p className="text-sm text-zinc-300">{MICHI_ADDRESS}</p>
                <a
                  href={PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-300 underline underline-offset-4 hover:text-white hover:underline focus-visible:text-white focus-visible:underline"
                >
                  Ver ubicación en Google Maps
                  <span className="sr-only">
                    {" "}
                    (se abre en una pestaña nueva)
                  </span>
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <Clock className="size-5" aria-hidden="true" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <h2 className="font-semibold text-white">Horario</h2>
                <div className="flex flex-col text-sm text-zinc-300">
                  <span>{CONFIRMED_SCHEDULE.monday.days}</span>
                  <span className="text-primary font-semibold">
                    {CONFIRMED_SCHEDULE.monday.hours.join(" y ")}
                  </span>
                </div>
                <div className="flex flex-col text-sm text-zinc-300">
                  <span>{CONFIRMED_SCHEDULE.tuesdayToSaturday.days}</span>
                  <span className="text-primary font-semibold">
                    {CONFIRMED_SCHEDULE.tuesdayToSaturday.hours.join(" y ")}
                  </span>
                </div>
                <div className="flex flex-col text-sm text-zinc-300">
                  <span>{CONFIRMED_SCHEDULE.sunday.days}</span>
                  <span className="font-semibold text-zinc-400">
                    {CONFIRMED_SCHEDULE.sunday.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary font-semibold hover:bg-primary! hover:brightness-110"
              >
                <Link href="/reservation">Reserva ahora</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white"
              >
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  Cómo llegar
                  <span className="sr-only">
                    (se abre en una pestaña nueva)
                  </span>
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
      {reviewsSlot}
    </>
  );
}
