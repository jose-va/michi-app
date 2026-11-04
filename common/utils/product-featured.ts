import type { Product } from "@/common/types/product.types";

/** Ausente, nulo o falso equivalen a no destacado. */
export function normalizeFeatured(value: boolean | null | undefined): boolean {
  return value === true;
}

/**
 * Query string (sin "?") del endpoint de destacados. Recorta el nombre,
 * ignora nombre en blanco y alérgenos vacíos, y nunca incluye `category`.
 */
export function buildFeaturedQuery({
  name,
  allergens,
}: {
  name?: string;
  allergens?: string[];
}): string {
  const params = new URLSearchParams();
  const trimmedName = name?.trim();
  if (trimmedName) params.set("name", trimmedName);
  for (const allergen of allergens ?? []) {
    if (allergen.trim()) params.append("allergens", allergen);
  }
  return params.toString();
}

/** Una respuesta que no es un array se trata como lista vacía. */
export function parseFeaturedResponse(json: unknown): Product[] {
  return Array.isArray(json) ? (json as Product[]) : [];
}
