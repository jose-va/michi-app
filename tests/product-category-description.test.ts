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

test("main and featured branches render the resolved description in a p after the h2 and before the grid", () => {
  const mainStart = pageSource.indexOf('resolved.kind === "main"');
  assert.ok(mainStart >= 0, "ProductPage must keep the main branch");

  assert.ok(
    pageSource.includes("getMainCategoryDescription(resolved.main)"),
    "Main branch must resolve its description with getMainCategoryDescription"
  );
  assert.ok(
    pageSource.includes("getCategoryDescription(FEATURED_CATEGORY)"),
    "Featured branch must resolve its description with getCategoryDescription"
  );
  const description = pageSource.match(
    /<p[^>]*>\s*\{description\}\s*<\/p>/
  )?.[0];
  assert.ok(
    description,
    "Branches must render the resolved description inside a p"
  );

  const headingIndex = pageSource.indexOf("<h2");
  const descriptionIndex = pageSource.indexOf("<p");
  const gridIndex = pageSource.indexOf("grid grid-cols-1");
  assert.ok(headingIndex >= 0, "ProductPage must include an h2");
  assert.ok(descriptionIndex >= 0, "ProductPage must include a p");
  assert.ok(gridIndex >= 0, "ProductPage must keep the product grid");
  assert.ok(
    headingIndex < descriptionIndex,
    "Category description must render after the h2"
  );
  assert.ok(
    descriptionIndex < gridIndex,
    "Category description must render before the grid"
  );
});
