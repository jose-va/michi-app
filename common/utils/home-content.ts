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
  id: "motto" | "about" | "menu" | "reservations" | "location" | "delivery";
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
    id: "about",
    title: "SOBRE NOSOTROS",
    description:
      "Fusionamos técnica nipona y alma atlántica en un espacio de libertad creativa donde cada plato es un lienzo.",
    image:
      "/images/2326ceaf-1ded-46d3-b174-c7c6cfe55ed6.webp",
    imageAlt: "Exterior de Michi Sushi",
    actionLabel: "Conócenos",
    actionHref: "/about",
  },
  {
    id: "location",
    title: "Dónde estamos",
    description:
      "Visítenos en: C/ Gutierre Tibón, Santiago Lozano, 8, local 2. Consulta cómo llegar y nuestros horarios de apertura.",
    actionLabel: "Ver ubicación",
    actionHref: "/location",
  },
  {
    id: "menu",
    title: "NUESTRA CARTA",
    description:
      "Entrantes, platos calientes, sushi, makis especiales y combinados. Todos los platos se preparan con ingredientes de calidad.",
    image:
      "/images/Ebi Pasión.webp",
    imageAlt: "Ebi Pasión",
    actionLabel: "Ver carta",
    actionHref: "/product",
  },
  {
    id: "reservations",
    title: "Reserva mesa",
    description:
      "Disfruta de una experiencia gastronómica japonesa auténtica y cercana. Reserva ya tu mesa online.",
    image:
      "/images/IMG_1231.webp",
    imageAlt: "Reserva tu mesa en Michi Sushi",
    actionLabel: "Reservar",
    actionHref: "/reservation",
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
] as const;

export const CONFIRMED_SCHEDULE = {
  monday: {
    days: "Lunes",
    meals: { dinner: "20:00–23:00" },
  },
  tuesdayToSaturday: {
    days: "Martes a Sábado",
    meals: {
      breakfast: "desde las 08:00",
      lunch: "13:00–16:00",
      dinner: "20:00–23:00",
    },
  },
  sunday: {
    days: "Domingo",
    status: "Cerrado",
  },
} as const;

const MEAL_LABELS = {
  breakfast: "Desayuno",
  lunch: "Comida",
  dinner: "Cena",
} as const;

type MealKey = keyof typeof MEAL_LABELS;

export interface DetailedScheduleRow {
  days: string;
  services: { label: string; time: string }[];
  status: string | undefined;
}

export interface CompactScheduleRow {
  days: string;
  hours: string;
}

interface ScheduleDay {
  days: string;
  meals?: Partial<Record<MealKey, string>>;
  status?: string;
}

function scheduleDays(): ScheduleDay[] {
  return [
    CONFIRMED_SCHEDULE.monday,
    CONFIRMED_SCHEDULE.tuesdayToSaturday,
    CONFIRMED_SCHEDULE.sunday,
  ];
}

function mealEntries(day: ScheduleDay): { label: string; time: string }[] {
  const order: MealKey[] = ["breakfast", "lunch", "dinner"];
  return order.flatMap((key) => {
    const time = day.meals?.[key];
    return time ? [{ label: MEAL_LABELS[key], time }] : [];
  });
}

/** Una línea por servicio (Desayuno/Comida/Cena): ubicación y reserva. */
export function getDetailedScheduleRows(): DetailedScheduleRow[] {
  return scheduleDays().map((day) => ({
    days: day.days,
    services: mealEntries(day),
    status: day.status,
  }));
}

function compactHours(day: ScheduleDay): string {
  const { breakfast, lunch, dinner } = day.meals ?? {};
  const start = breakfast?.match(/\d{2}:\d{2}/)?.[0];
  const lunchEnd = lunch?.split("–")[1];
  const first = start && lunchEnd ? `${start}–${lunchEnd}` : (lunch ?? breakfast);
  return [first, dinner].filter(Boolean).join(" y ");
}

/** Una sola línea por día, con desayuno y comida fusionados: pie de página. */
export function getCompactScheduleRows(): CompactScheduleRow[] {
  return scheduleDays().map((day) => ({
    days: day.days,
    hours: day.status ?? compactHours(day),
  }));
}
