import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  FILTERED_PRODUCTS_PAGE_SIZE,
  paginateProducts,
} from "../common/utils/product-pagination";
import type { Product } from "../common/types/product.types";

function makeProduct(id: string): Product {
  return {
    id,
    name: `Producto ${id}`,
    japaneseName: "",
    description: "Descripción",
    category: "rolls",
    allergens: [],
    pieces: 8,
    price: 9.5,
  };
}

function makeProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => makeProduct(`p${i + 1}`));
}

test("sin productos devuelve contenido vacío", () => {
  const page = paginateProducts([], 0);
  assert.deepEqual(page.content, []);
  assert.equal(page.number, 0);
});

test("con 1 a 6 productos todo queda en una sola página", () => {
  for (const count of [1, 3, 6]) {
    const page = paginateProducts(makeProducts(count), 0);
    assert.equal(page.totalPages, 1, `con ${count} productos debe haber 1 página`);
    assert.equal(page.content.length, count);
    assert.equal(page.number, 0);
  }
});

test("con más productos que el tamaño de página hay varias páginas", () => {
  const products = makeProducts(FILTERED_PRODUCTS_PAGE_SIZE + 2);
  const first = paginateProducts(products, 0);
  assert.equal(first.totalPages, 2);
  assert.equal(first.content.length, FILTERED_PRODUCTS_PAGE_SIZE);
  assert.equal(first.number, 0);

  const second = paginateProducts(products, 1);
  assert.equal(second.number, 1);
  assert.equal(second.content.length, 2);
  assert.equal(second.content[0].id, `p${FILTERED_PRODUCTS_PAGE_SIZE + 1}`);
});

test("la página fuera de rango se recorta a la última disponible", () => {
  const page = paginateProducts(makeProducts(3), 5);
  assert.equal(page.number, 0);
  assert.equal(page.content.length, 3);
});

test("la página negativa o no numérica se recorta a la primera", () => {
  assert.equal(paginateProducts(makeProducts(3), -2).number, 0);
  assert.equal(paginateProducts(makeProducts(3), NaN).number, 0);
});

test("el tamaño de página inválido usa el valor por defecto", () => {
  const page = paginateProducts(makeProducts(3), 0, 0);
  assert.equal(page.content.length, 3);
  assert.equal(page.totalPages, 1);
});

const productPageSource = readFileSync(
  new URL(
    "../common/components/pages/product/ProductPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("ProductPage filtra y pagina con la misma rejilla y paginación", () => {
  const filteredIndex = productPageSource.indexOf("hasFilters");
  assert.ok(filteredIndex >= 0, "Debe mantener la rama filtrada");
  const filteredBranch = productPageSource.slice(filteredIndex);
  assert.ok(
    filteredBranch.includes("paginateProducts"),
    "La rama filtrada debe paginar en memoria sin inventar endpoints",
  );
  assert.ok(
    filteredBranch.includes("<ProductPagination"),
    "La rama filtrada debe mostrar la misma paginación que sin filtros",
  );
  assert.ok(
    filteredBranch.includes("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"),
    "La rama filtrada debe mantener la misma rejilla",
  );
});

test("ProductPage usa la página recortada para la paginación filtrada", () => {
  assert.ok(
    productPageSource.includes("paginateProducts(products, page"),
    "Debe paginar el resultado filtrado con la página pedida",
  );
  assert.ok(
    /currentPage=\{[a-zA-Z]+\.number\}/.test(productPageSource),
    "La paginación filtrada debe usar la página recortada",
  );
});

const paginationSource = readFileSync(
  new URL(
    "../common/components/ui/product/ProductPagination.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("ProductPagination conserva los filtros al cambiar de página", () => {
  assert.ok(
    paginationSource.includes("useSearchParams"),
    "Debe leer los parámetros actuales para no perder el filtro",
  );
  assert.ok(
    paginationSource.includes('params.set("page"'),
    "Debe cambiar solo el parámetro de página",
  );
});

const productCardSource = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("ProductCard sigue visible con movimiento reducido", () => {
  assert.ok(
    productCardSource.includes("motion-reduce:opacity-100"),
    "La tarjeta no debe quedarse invisible sin animación",
  );
});
