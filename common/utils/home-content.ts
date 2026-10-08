export const DEFAULT_CAROUSEL_IMAGES = [
  "/images/IMG_8115.webp",
  "/images/IMG_8118.webp",
  "/images/IMG_8121.webp",
  "/images/IMG_8127.webp",
  "/images/IMG_8496.webp",
] as const;

export const CAROUSEL_IMAGE_ALTS: Record<string, string> = {
  "/images/IMG_8115.webp":
    "Variedad de piezas de sushi artesanal y tapas japonesas de Michi Sushi",
  "/images/IMG_8118.webp":
    "Plato de sushi fresco y rollos especiales preparados al momento",
  "/images/IMG_8121.webp":
    "Presentación de sushi en mesa lista para degustar en Michi Sushi",
  "/images/IMG_8127.webp":
    "Ambiente acogedor y detalles del restaurante Michi Sushi en Granada",
  "/images/IMG_8496.webp":
    "Selección de nigiris y especialidades de la casa en Michi Sushi",
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
      "Donde el arte del sushi se une al encanto de las tapas, creando una experiencia que combina tradición japonesa con calidez granaína.",
  },
  {
    id: "menu",
    title: "CONOCE NUESTRA CARTA",
    description:
      "Explora una cuidada selección de sushi artesanal, nigiris frescos y rolls de fusión con el toque único de Granada, preparados al momento con producto fresco.",
    image: "/images/IMG_8118.webp",
    imageAlt: "Plato de sushi variado de la carta de Michi Sushi",
    actionLabel: "Ver todos los platos",
    actionHref: "/product",
  },
  {
    id: "reservations",
    title: "Reservas",
    description:
      "Asegura tu mesa y vive una velada especial disfrutando de nuestra cocina en el mejor ambiente.",
    image: "/images/IMG_8121.webp",
    imageAlt: "Mesa dispuesta para reservas en el restaurante Michi Sushi",
    actionLabel: "Reservar mesa",
    actionHref: "/reservation",
  },
  {
    id: "location",
    title: "Ubicación",
    description:
      "Visítanos en el centro de Granada. Descubre nuestro espacio y disfruta de una experiencia gastronómica cercana e inolvidable.",
    image: "/images/IMG_8127.webp",
    imageAlt: "Instalaciones y ubicación de Michi Sushi Granada",
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
