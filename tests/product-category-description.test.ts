import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const pageSource = readFileSync(
  new URL("../common/components/pages/product/ProductPage.tsx", import.meta.url),
  "utf8",
);

test("product page imports getCategoryDescription from the category mapper", () => {
  assert.ok(
    pageSource.includes("@/common/mappers/category.mapper"),
    "ProductPage must import from @/common/mappers/category.mapper"
  );
  assert.ok(
    pageSource.includes("getCategoryDescription"),
    "ProductPage must use getCategoryDescription"
  );
});

test("filtered-by-category branch renders getCategoryDescription(category) in a p after the h2 and before the grid", () => {
  const filtersStart = pageSource.indexOf("if (hasFilters)");
  assert.ok(filtersStart >= 0, "ProductPage must keep the hasFilters branch");
  const filtersBlock = pageSource.slice(filtersStart);

  assert.ok(
    filtersBlock.includes("getCategoryDescription(category)"),
    "Filtered branch must render getCategoryDescription(category)"
  );
  const description = filtersBlock.match(
    /<p[^>]*>\s*\{getCategoryDescription\(category\)\}\s*<\/p>/
  )?.[0];
  assert.ok(
    description,
    "Filtered branch must render getCategoryDescription(category) inside a p"
  );

  const headingIndex = filtersBlock.indexOf("<h2");
  const descriptionIndex = filtersBlock.indexOf("<p");
  const gridIndex = filtersBlock.indexOf("grid grid-cols-1");
  assert.ok(headingIndex >= 0, "Filtered branch must include an h2");
  assert.ok(descriptionIndex >= 0, "Filtered branch must include a p");
  assert.ok(gridIndex >= 0, "Filtered branch must keep the product grid");
  assert.ok(
    headingIndex < descriptionIndex,
    "Category description must render after the h2"
  );
  assert.ok(
    descriptionIndex < gridIndex,
    "Category description must render before the grid"
  );
});
