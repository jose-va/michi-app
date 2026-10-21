export const DEFAULT_CAROUSEL_IMAGES = [
  "/images/Combinado De Nigiri Especial Aburi [5_4-1024x1280-watermarked] 539_cleanup.webp",
  "/images/Combinado dúo mixto.webp",
   "/images/Katsumaki Combinado 8 Piezas [5_4-1024x1280-watermarked] 2be_cleanup.webp",
] as const;

export const CAROUSEL_IMAGE_ALTS: Record<string, string> = {
  "/images/Combinado De Nigiri Especial Aburi [5_4-1024x1280-watermarked] 539_cleanup.webp":
    "Combinado De Nigiri Especial Aburi",
  "/images/Combinado dúo mixto.webp":
    "Combinado dúo mixto",
  "/images/Katsumaki Combinado 8 Piezas [5_4-1024x1280-watermarked] 2be_cleanup.webp":
    "Katsumaki Combinado",
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
      "Disfruta de una experiencia gastronómica japonesa cercana",
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
