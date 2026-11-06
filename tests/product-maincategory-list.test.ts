import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductPage.tsx", import.meta.url),
  "utf8",
);

test("ProductPage resuelve el filtro con resolveCategoryFilter del nuevo mapper", () => {
  assert.match(pageSource, /main-category\.mapper/);
  assert.match(pageSource, /resolveCategoryFilter\(category\)/);
});

test("ProductPage rama featured usa getFeaturedProducts con name y allergens", () => {
  assert.match(
    pageSource,
    /ProductService\.getFeaturedProducts\(\{ name, allergens: allergensList \}\)/,
  );
});

test("ProductPage rama main usa searchProducts con la principal resuelta", () => {
  assert.match(
    pageSource,
    /ProductService\.searchProducts\(\{[^}]*category: resolved\.main[^}]*\}\)/,
  );
  assert.match(pageSource, /resolved\.kind === "main"/);
});

test("ProductPage rama all combina name/allergens y pagina sin filtros", () => {
  assert.match(pageSource, /resolved\.kind === "all"/);
  assert.match(
    pageSource,
    /ProductService\.searchProducts\(\{ name, allergens: allergensList \}\)/,
  );
  assert.match(pageSource, /ProductService\.getProducts\(page\)/);
});

test("ProductPage rama invalid muestra ProductEmpty", () => {
  assert.match(pageSource, /resolved\.kind === "invalid"/);
  assert.match(pageSource, /<ProductEmpty \/>/);
});

test("ProductPage pinta h2+p solo con principal o Destacados", () => {
  assert.match(pageSource, /getMainCategoryTitle\(/);
  assert.match(pageSource, /getMainCategoryDescription\(/);
  assert.match(pageSource, /getCategoryTitle\(/);
  assert.match(pageSource, /getCategoryDescription\(/);
  assert.match(pageSource, /<h2/);
});

test("ProductPage conserva paginacion y estado vacio ante error", () => {
  assert.match(pageSource, /paginateProducts\(products, page, size\)/);
  assert.match(pageSource, /<ProductPagination/);
  assert.match(pageSource, /if \(!products\.length\) return <ProductEmpty \/>/);
});
