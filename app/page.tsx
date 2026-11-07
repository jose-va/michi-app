import Image from "next/image";
import Link from "next/link";
import { montserrat, playfair, sigokae, centuryGothic } from "./fonts/font";
import { HomeCarousel } from "@/common/components/ui/HomeCarousel";
import FadeInLetters from "@/common/components/FadeInLetters";
import { RevealOnScroll } from "@/common/components/ui/RevealOnScroll";
import GoogleMaps from "@/common/components/ui/location/GoogleMaps";
import { Button } from "@/shadcn/components/button";
import { HOME_SECTIONS } from "@/common/utils/home-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://michisushigranada.es/#restaurant",
    name: "Michi Sushi Granada",
    url: "https://michisushigranada.es",
    image: "https://michisushigranada.es/og-image.jpg",
    telephone: "+34673821148",
    priceRange: "10€ - 20€",
    servesCuisine: ["Japonesa", "Sushi", "Tapas"],
    acceptsReservations: "True",
    menu: "https://michisushigranada.es/product",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Gutierre Tibón, Santiago Lozano, 8, Local 2",
      addressLocality: "Granada",
      postalCode: "18011",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.197459,
      longitude: -3.601981,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday"],
        opens: "20:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "16:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "20:00",
        closes: "23:00",
      },
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://michisushigranada.es/reservar",
        inLanguage: "es-ES",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "FoodEstablishmentReservation",
        name: "Reserva de mesa",
      },
    },
  };

  const [
    mottoSection,
    aboutSection,
    locationSection,
    menuSection,
    reservationsSection,
    deliverySection,
  ] = HOME_SECTIONS;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <div className="flex flex-col gap-16 bg-transparent pb-20 md:gap-26">
        <section
          aria-label="Bienvenida y carrusel principal"
          className="-mt-1 grid items-center gap-10 py-13 md:-mt-2 md:grid-cols-2 md:py-8"
        >
          <div className="ml-4 flex flex-col justify-center space-y-3">
            <div className="flex items-end gap-2">
              <h1
                className={`${sigokae.className} text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl`}
              >
                <span className="block">MICHI</span>
                <span className="block">SUSHI</span>
              </h1>
              <span
                className="mb-2 ml-1 text-2xl text-white/50 md:mb-4 md:text-3xl"
                aria-hidden="true"
              >
                道
              </span>
            </div>
            <span
              aria-hidden="true"
              className="bg-michi-sake h-1 w-20 rounded-full"
            />
            <p className="max-w-md text-base text-zinc-100 drop-shadow-sm md:text-lg">
              Gastronomía japonesa y cultura de tapeo. Tu punto de encuentro en
              Granada.
            </p>
            <div className="flex flex-row items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-michi-sake hover:bg-michi-sake! min-h-11 font-semibold text-stone-950 hover:brightness-110"
              >
                <Link href="/reservation">Reserva mesa</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-11 bg-white/10 font-semibold text-white shadow-lg backdrop-blur"
              >
                <Link href="/product">Explora la carta</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <HomeCarousel />
          </div>
        </section>

        <div className="flex flex-col gap-14 md:gap-20">
          <section
            id="seccion-lema"
            aria-label="Lema del restaurante"
            className="mx-auto -mt-2 w-full max-w-3xl bg-transparent text-center md:mt-0"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-zinc-200 uppercase brightness-120">
                Michi Café & Sushi Bar
              </span>
              <span className="text-michi-sake text-xs font-bold tracking-widest uppercase">
                {mottoSection.title}
              </span>
              <p
                className={`${centuryGothic.className} text-2xl leading-relaxed text-zinc-300 italic md:text-3xl`}
              >
                &ldquo;
                <FadeInLetters text={mottoSection.description} staggerMs={25} />
                &rdquo;
              </p>
            </div>
          </section>

          <RevealOnScroll>
            <section
              id="seccion-sobre-nosotros"
              aria-label="Sobre nosotros"
              className="mt-8 grid grid-cols-1 items-center gap-8 bg-transparent md:grid-cols-2"
            >
              <div className="order-2 flex flex-col items-start gap-4 md:order-1">
                <h2
                  className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
                >
                  {aboutSection.title}
                </h2>
                <p className="text-base text-zinc-300 md:text-lg">
                  {aboutSection.description}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-michi-sake hover:bg-michi-sake! min-h-11 font-semibold text-stone-950 hover:brightness-110"
                >
                  <Link href={aboutSection.actionHref || "/about"}>
                    {aboutSection.actionLabel}
                  </Link>
                </Button>
              </div>

              <div className="relative order-1 aspect-video w-full overflow-hidden rounded-2xl md:order-2">
                {aboutSection.image && (
                  <Image
                    src={aboutSection.image}
                    alt={aboutSection.imageAlt || "Sobre nosotros"}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              id="seccion-ubicacion"
              aria-label="Ubicación de Michi Sushi"
              className="grid items-center gap-8 bg-transparent md:grid-cols-2"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <GoogleMaps zoom={13} />
              </div>

              <div className="flex flex-col items-start gap-4">
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
                  className="bg-michi-sake hover:bg-michi-sake! min-h-11 font-semibold text-stone-950 hover:brightness-110"
                >
                  <Link href={locationSection.actionHref || "/location"}>
                    {locationSection.actionLabel}
                  </Link>
                </Button>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              id="seccion-carta"
              aria-label="Carta de Michi Sushi"
              className="mt-8 grid grid-cols-1 items-center gap-8 bg-transparent md:grid-cols-2"
            >
              <div className="order-2 flex flex-col items-start gap-4 md:order-1">
                <h2
                  className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
                >
                  {menuSection.title}
                </h2>
                <p className="text-base text-zinc-300 md:text-lg">
                  {menuSection.description}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-michi-sake hover:bg-michi-sake! min-h-11 font-semibold text-stone-950 hover:brightness-110"
                >
                  <Link href={menuSection.actionHref || "/product"}>
                    {menuSection.actionLabel}
                  </Link>
                </Button>
              </div>

              <div className="relative order-1 aspect-video w-full overflow-hidden rounded-2xl md:order-2">
                {menuSection.image && (
                  <Image
                    src={menuSection.image}
                    alt={menuSection.imageAlt || "Carta de sushi"}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <span className="animate-float-badge absolute right-4 bottom-4 flex size-24 flex-col items-center justify-center rounded-full bg-linear-to-br from-amber-400 via-orange-400 to-amber-600 p-2.5 text-center text-white shadow-lg ring-2 shadow-orange-950/20 ring-white/50 md:size-28">
                  <span className="text-[9px] font-bold tracking-widest text-amber-100 uppercase drop-shadow-sm">
                    Fusión Tropical
                  </span>
                  <span className="mt-0.5 text-xs leading-tight font-black tracking-tight text-white drop-shadow md:text-sm">
                    Ebi &amp; Maracuyá
                  </span>
                </span>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              id="seccion-reservas"
              aria-label="Reservas en Michi Sushi"
              className="grid items-center gap-8 bg-transparent md:grid-cols-2"
            >
              <div className="relative order-1 aspect-video w-full overflow-hidden rounded-2xl">
                {reservationsSection.image && (
                  <Image
                    src={reservationsSection.image}
                    alt={
                      reservationsSection.imageAlt || "Reservas en restaurante"
                    }
                    fill
                    className="scale-105 object-cover object-bottom transition-transform duration-700 ease-out hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>

              <div className="order-2 flex flex-col items-start gap-4">
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
                  className="bg-michi-sake hover:bg-michi-sake! min-h-11 font-semibold text-stone-950 hover:brightness-110"
                >
                  <Link href={reservationsSection.actionHref || "/reservation"}>
                    {reservationsSection.actionLabel}
                  </Link>
                </Button>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              id="seccion-pedido"
              aria-label="Pedir a domicilio en Uber Eats"
              className="grid items-center gap-8 bg-transparent md:grid-cols-2"
            >
              <div className="order-2 flex flex-col items-start gap-4 md:order-1">
                <h2
                  className={`${montserrat.className} text-4xl font-extrabold tracking-tight text-white uppercase md:text-5xl`}
                >
                  {deliverySection.title}
                </h2>
                <p className="text-base text-zinc-300 md:text-lg">
                  {deliverySection.description}
                </p>
                <a
                  href={deliverySection.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg transition-transform hover:scale-105 hover:cursor-pointer hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Image
                    src="/logos/Eats_Pill_RGB.svg"
                    alt={deliverySection.actionLabel || "Pedir en Uber Eats"}
                    width={110}
                    height={42}
                    className="h-auto w-27.5"
                  />
                  <span className="sr-only">
                    {" "}
                    (se abre en una pestaña nueva)
                  </span>
                </a>
              </div>

              <div className="relative order-1 aspect-video w-full overflow-hidden rounded-2xl md:order-2">
                {deliverySection.image && (
                  <Image
                    src={deliverySection.image}
                    alt={
                      deliverySection.imageAlt ||
                      "Sushi de Michi para pedir en Uber Eats"
                    }
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </section>
          </RevealOnScroll>
        </div>
      </div>
    </>
  );
}
