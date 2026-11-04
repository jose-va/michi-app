import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const selectSource = readFileSync(
  new URL("../common/components/layout/product/CategorySelect.tsx", import.meta.url),
  "utf8",
);

test("CategorySelect itera filterCategories y no categories", () => {
  assert.match(selectSource, /filterCategories\.map\(/);
  assert.doesNotMatch(selectSource, /\bcategories\.map\(/);
});

test("CategorySelect normaliza featured/Featured/FEATURED con isFeaturedCategory", () => {
  assert.match(selectSource, /isFeaturedCategory\(/);
  assert.match(selectSource, /FEATURED_CATEGORY/);
});

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductPage.tsx", import.meta.url),
  "utf8",
);

test("ProductPage usa getFeaturedProducts con name y allergens si isFeaturedCategory", () => {
  assert.match(pageSource, /isFeaturedCategory\(category\)/);
  assert.match(
    pageSource,
    /ProductService\.getFeaturedProducts\(\{ name, allergens: allergensList \}\)/,
  );
});

test("ProductPage conserva searchProducts, getProducts, paginación, ProductEmpty y mapper", () => {
  assert.match(pageSource, /ProductService\.searchProducts\(\{ name, category, allergens: allergensList \}\)/);
  assert.match(pageSource, /ProductService\.getProducts\(page\)/);
  assert.match(pageSource, /paginateProducts\(products, page, size\)/);
  assert.match(pageSource, /<ProductEmpty \/>/);
  assert.match(pageSource, /getCategoryTitle\(category\)/);
  assert.match(pageSource, /getCategoryDescription\(category\)/);
});

test("ProductPage no filtra por estado la lista de destacados", () => {
  assert.doesNotMatch(pageSource, /\.filter\(/);
});

test("CategorySelect conserva «Todas» y el valor vacío sin category", () => {
  assert.match(selectSource, /<SelectItem value="all">Todas<\/SelectItem>/);
  assert.match(selectSource, /searchParams\.get\("category"\) \?\? ""/);
});
