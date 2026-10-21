import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductPage.tsx", import.meta.url),
  "utf8",
);

test("product page imports getCategoryTitle from the category mapper", () => {
  assert.ok(
    pageSource.includes("@/common/mappers/category.mapper"),
    "ProductPage must import from @/common/mappers/category.mapper",
  );
  assert.ok(
    pageSource.includes("getCategoryTitle"),
    "ProductPage must use getCategoryTitle",
  );
});

test("product page imports centuryGothic font for the category title", () => {
  assert.ok(
    pageSource.includes("@/app/fonts/font"),
    "ProductPage must import from @/app/fonts/font",
  );
  assert.ok(
    pageSource.includes("centuryGothic"),
    "ProductPage must use the centuryGothic font",
  );
});

test("filtered-by-category branch renders getCategoryTitle(category) in an h2 before the grid", () => {
  const filtersStart = pageSource.indexOf("if (hasFilters)");
  assert.ok(filtersStart >= 0, "ProductPage must keep the hasFilters branch");
  const filtersBlock = pageSource.slice(filtersStart);

  assert.ok(
    filtersBlock.includes("getCategoryTitle(category)"),
    "Filtered branch must render getCategoryTitle(category)",
  );
  const heading = filtersBlock.match(/<h2[^>]*>\s*\{getCategoryTitle\(category\)\}\s*<\/h2>/)?.[0];
  assert.ok(heading, "Filtered branch must render getCategoryTitle(category) inside an h2");
  assert.ok(
    heading.includes("centuryGothic.className"),
    "Category h2 must use the centuryGothic font",
  );
  for (const token of ["text-3xl", "md:text-4xl", "mt-8", "mb-2", "text-white"]) {
    assert.ok(heading.includes(token), `Category h2 must include «${token}»`);
  }

  const headingIndex = filtersBlock.indexOf("<h2");
  const gridIndex = filtersBlock.indexOf("grid grid-cols-1");
  assert.ok(headingIndex >= 0, "Filtered branch must include an h2");
  assert.ok(gridIndex >= 0, "Filtered branch must keep the product grid");
  assert.ok(headingIndex < gridIndex, "Category h2 must render before the grid");
});

test("category heading only renders when filtering by category", () => {
  const filtersStart = pageSource.indexOf("if (hasFilters)");
  assert.ok(filtersStart >= 0, "ProductPage must keep the hasFilters branch");
  const filtersBlock = pageSource.slice(filtersStart);
  assert.ok(
    filtersBlock.includes("{category ? (") || filtersBlock.includes("{category &&"),
    "Category h2 must be conditional on the category filter",
  );
});
