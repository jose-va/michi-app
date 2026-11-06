import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const selectSource = readFileSync(
  new URL("../common/components/layout/product/CategorySelect.tsx", import.meta.url),
  "utf8",
);

test("CategorySelect itera MAIN_FILTER_OPTIONS y no filterCategories", () => {
  assert.match(selectSource, /MAIN_FILTER_OPTIONS\.map\(/);
  assert.doesNotMatch(selectSource, /filterCategories/);
  assert.doesNotMatch(selectSource, /\bcategories\.map\(/);
});

test("CategorySelect normaliza con resolveCategoryFilter del nuevo mapper", () => {
  assert.match(selectSource, /resolveCategoryFilter\(/);
  assert.match(selectSource, /main-category\.mapper/);
});

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductPage.tsx", import.meta.url),
  "utf8",
);

test("ProductPage resuelve con resolveCategoryFilter y la rama featured usa getFeaturedProducts", () => {
  assert.match(pageSource, /resolveCategoryFilter\(category\)/);
  assert.match(pageSource, /resolved\.kind === "featured"/);
  assert.match(pageSource, /resolved\.kind === "invalid"/);
  assert.match(
    pageSource,
    /ProductService\.getFeaturedProducts\(\{ name, allergens: allergensList \}\)/,
  );
});

test("ProductPage conserva searchProducts por principal, getProducts, paginación, ProductEmpty y mappers", () => {
  assert.match(pageSource, /ProductService\.searchProducts\(\{ category: resolved\.main, name, allergens: allergensList \}\)/);
  assert.match(pageSource, /ProductService\.searchProducts\(\{ name, allergens: allergensList \}\)/);
  assert.match(pageSource, /ProductService\.getProducts\(page\)/);
  assert.match(pageSource, /paginateProducts\(products, page, size\)/);
  assert.match(pageSource, /<ProductEmpty \/>/);
  assert.match(pageSource, /getMainCategoryTitle\(resolved\.main\)/);
  assert.match(pageSource, /getCategoryTitle\(FEATURED_CATEGORY\)/);
});

test("ProductPage no filtra por estado la lista de destacados", () => {
  assert.doesNotMatch(pageSource, /\.filter\(/);
});

test("CategorySelect ofrece «Todas» vía MAIN_FILTER_OPTIONS y all sin category", () => {
  assert.match(selectSource, /MAIN_FILTER_OPTIONS/);
  assert.match(selectSource, /resolved\.kind === "all"/);
  assert.match(selectSource, /searchParams\.get\("category"\)/);
});
