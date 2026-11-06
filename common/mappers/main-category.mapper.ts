export type MainCategory =
  | "STARTERS"
  | "HOT_KITCHEN"
  | "SUSHI_CLASSIC"
  | "MAKIS_ROLLS"
  | "SPECIAL"
  | "COMBOS"
  | "DESSERTS";

export const MAIN_CATEGORIES: MainCategory[] = [
  "STARTERS",
  "HOT_KITCHEN",
  "SUSHI_CLASSIC",
  "MAKIS_ROLLS",
  "SPECIAL",
  "COMBOS",
  "DESSERTS",
];

const mainCategoryInfo: Record<MainCategory, { title: string; description: string }> = {
  STARTERS: {
    title: "Entrantes",
    description: "Para empezar: entrantes fríos, calientes y tartar.",
  },
  HOT_KITCHEN: {
    title: "Platos calientes",
    description: "Raciones de fideos y arroz calientes.",
  },
  SUSHI_CLASSIC: {
    title: "Sushi clásico",
    description: "Nigiri, gunkan, temaki y otros bocados clásicos.",
  },
  MAKIS_ROLLS: {
    title: "Rolls y makis",
    description: "Hosomaki, uramaki, futomaki y katsumaki.",
  },
  SPECIAL: {
    title: "Makis especiales",
    description: "Los especiales de la casa, creaciones únicas del chef.",
  },
  COMBOS: {
    title: "Combinados",
    description: "Selecciones para compartir y descubrir sin complicaciones.",
  },
  DESSERTS: {
    title: "Postres",
    description: "Nuestra selección de postres.",
  },
};

export function getMainCategoryTitle(main: string): string {
  return mainCategoryInfo[main as MainCategory]?.title ?? main;
}

export function getMainCategoryDescription(main: string): string {
  return mainCategoryInfo[main as MainCategory]?.description ?? "";
}

export function isMainCategory(value: unknown): value is MainCategory {
  return (
    typeof value === "string" &&
    (MAIN_CATEGORIES as string[]).includes(value)
  );
}

export type ResolvedCategoryFilter =
  | { kind: "all" }
  | { kind: "featured" }
  | { kind: "main"; main: MainCategory }
  | { kind: "invalid" };

export function resolveCategoryFilter(raw?: string): ResolvedCategoryFilter {
  if (raw == null) return { kind: "all" };
  const trimmed = raw.trim();
  if (trimmed === "") return { kind: "invalid" };
  const lower = trimmed.toLowerCase();
  if (lower === "all") return { kind: "all" };
  if (lower === "featured") return { kind: "featured" };
  const upper = trimmed.toUpperCase();
  if (isMainCategory(upper)) return { kind: "main", main: upper };
  return { kind: "invalid" };
}

export const MAIN_FILTER_OPTIONS: ReadonlyArray<{
  value: "featured" | MainCategory;
  label: string;
}> = [
  { value: "featured", label: "Destacados" },
  ...MAIN_CATEGORIES.filter((main) => main !== "DESSERTS").map((main) => ({
    value: main,
    label: mainCategoryInfo[main].title,
  })),
];
