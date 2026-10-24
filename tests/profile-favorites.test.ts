import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "../common/types/product.types";
import { resolveFavoriteProducts } from "../common/utils/profile-favorites";

function makeProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    name: "Producto",
    japaneseName: "Nombre japonés",
    description: "Descripción",
    category: "Makis",
    allergens: [],
    pieces: 8,
    price: 9.5,
    ...overrides,
  };
}

const catalog: Product[] = [
  makeProduct({ id: "p-1", name: "California Roll" }),
  makeProduct({ id: "p-2", name: "Nigiri Salmón" }),
  makeProduct({ id: "p-3", name: "Futomaki" }),
];

test("cruza por IDs conservando el orden del listado", () => {
  const resolved = resolveFavoriteProducts(catalog, ["p-3", "p-1"]);
  assert.deepEqual(
    resolved.map((product) => product.id),
    ["p-1", "p-3"],
  );
});

test("ignora los IDs huérfanos sin correspondencia", () => {
  const resolved = resolveFavoriteProducts(catalog, ["p-2", "huérfano"]);
  assert.deepEqual(
    resolved.map((product) => product.id),
    ["p-2"],
  );
});

test("lista vacía cuando nada resuelve", () => {
  assert.deepEqual(resolveFavoriteProducts(catalog, ["huérfano"]), []);
  assert.deepEqual(resolveFavoriteProducts(catalog, []), []);
  assert.deepEqual(resolveFavoriteProducts([], ["p-1"]), []);
});
