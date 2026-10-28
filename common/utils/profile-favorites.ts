import type { Product } from "../types/product.types";

export function resolveFavoriteProducts(
  allProducts: Product[],
  favoriteIds: string[],
): Product[] {
  return allProducts.filter(
    (product) => product.id !== undefined && favoriteIds.includes(product.id),
  );
}
