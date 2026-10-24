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
  id: "motto" | "menu" | "reservations" | "location";
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  actionLabel?: string;
  actionHref?: string;
}

export const HOME_SECTIONS: readonly HomeSection[] = [
  {
    id: "motto",
    title: "Nuestra Filosofía",
    description:
      "Donde el arte del sushi se une al encanto de las tapas, creando una experiencia única que combina tradición japonesa con calidez granaína.",
  },
  {
    id: "menu",
    title: "NUESTRA CARTA",
    description:
      "Explora nuestra selección de sushi, nigiris y maki rolls, preparados al momento con el producto más fresco.",
    image:
      "/images/Ebi Pasión.webp",
    imageAlt: "Ebi Pasión",
    actionLabel: "Ver todos los platos",
    actionHref: "/product",
  },
  {
    id: "reservations",
    title: "Reserva tu mesa",
    description:
      "Disfruta de una experiencia gastronómica japonesa cercana.",
    image:
      "/images/Dish Composition [5_4-2304x2880-watermarked] d88.webp",
    imageAlt: "Dish Composition [5_4-2304x2880-watermarked] d88",
    actionLabel: "Reservar mesa",
    actionHref: "/reservation",
  },
  {
    id: "location",
    title: "¿Dónde estamos?",
    description:
      "Visítanos en Calle Gutierre Tibón, Santiago Lozano 8, local 2",
    actionLabel: "Cómo llegar",
    actionHref: "/location",
  },
] as const;

export const CONFIRMED_SCHEDULE = {
  weekdays: {
    days: "Lunes a sábado",
    hours: ["08:00–16:00", "20:00–23:00"],
  },
  sunday: {
    days: "Domingo",
    status: "Cerrado",
  },
} as const;
