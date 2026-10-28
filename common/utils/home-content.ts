export const DEFAULT_CAROUSEL_IMAGES = [
  "/carousel/Combinado De Nigiri.webp",
  "/carousel/Combinando Duo Mixto.webp",
   "/carousel/Ebi Assari.webp",
] as const;

export const CAROUSEL_IMAGE_ALTS: Record<string, string> = {
  "/carousel/Combinado De Nigiri.webp":
    "Combinado De Nigiri",
  "/carousel/Combinando Duo Mixto.webp":
    "Combinado dúo mixto",
  "/carousel/Ebi Assari.webp":
    "Ebi Assari",
};

export interface HomeSection {
  id: "motto" | "menu" | "reservations" | "location" | "delivery";
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  actionLabel?: string;
  actionHref?: string;
}

export const UBER_EATS_URL =
  "https://www.ubereats.com/store/michi-sushi-bar/C4prIh1gVIahmQgwtrvDTA/?analyticsUuid=1ad41473-1403-4d26-a8f3-5ae0165030bb&qrCodeScan=true&diningMode=DINE_IN" as const;

export const HOME_SECTIONS: readonly HomeSection[] = [
  {
    id: "motto",
    title: " GRANADA",
    description:
      "Donde el arte del sushi se une al encanto de las tapas, creando una experiencia única que combina tradición japonesa con calidez granaína.",
  },
  {
    id: "menu",
    title: "NUESTRA CARTA",
    description:
      "Todos nuestros productos se preparan al momento con ingredientes de alta calidad.",
    image:
      "/images/Ebi Pasión.webp",
    imageAlt: "Ebi Pasión",
    actionLabel: "Ver la carta",
    actionHref: "/product",
  },
  {
    id: "delivery",
    title: "PIDE A DOMICILIO",
    description: "Tu sushi favorito en casa con Uber Eats. Pide desde la aplicación.",
    image: "/images/Dish Composition [5_4-2304x2880-watermarked] d88.webp",
    imageAlt: "Sushi de Michi para pedir en Uber Eats",
    actionLabel: "Pedir en Uber Eats",
    actionHref: UBER_EATS_URL,
  },
  {
    id: "reservations",
    title: "Reserva mesa",
    description:
      "Disfruta de una experiencia gastronómica japonesa cercana y auténtica.",
    image:
      "/images/2326ceaf-1ded-46d3-b174-c7c6cfe55ed6.webp",
    imageAlt: "Reserva tu mesa en Michi Sushi",
    actionLabel: "Reservar ahora",
    actionHref: "/reservation",
  },
  {
    id: "location",
    title: "Dónde estamos",
    description:
      "Visítenos en Calle Gutierre Tibón, Santiago Lozano 8, Local 2, Granada.",
    actionLabel: "Cómo llegar",
    actionHref: "/location",
  },
] as const;

export const CONFIRMED_SCHEDULE = {
  monday: {
    days: "Lunes",
    hours: ["20:00–23:00"],
  },
  tuesdayToSaturday: {
    days: "Martes a Sábado",
    hours: ["08:00–16:00", "20:00–23:00"],
  },
  sunday: {
    days: "Domingo",
    status: "Cerrado",
  },
} as const;
