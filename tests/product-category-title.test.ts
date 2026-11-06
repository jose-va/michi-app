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

test("main and featured branches render the resolved title in an h2 before the grid", () => {
  const mainStart = pageSource.indexOf('resolved.kind === "main"');
  assert.ok(mainStart >= 0, "ProductPage must keep the main branch");
  const mainBlock = pageSource.slice(mainStart);

  assert.ok(
    mainBlock.includes("getMainCategoryTitle(resolved.main)"),
    "Main branch must resolve its title with getMainCategoryTitle",
  );
  assert.ok(
    pageSource.includes("getCategoryTitle(FEATURED_CATEGORY)"),
    "Featured branch must resolve its title with getCategoryTitle",
  );
  const heading = pageSource.match(/<h2[^>]*>\s*\{title\}\s*<\/h2>/)?.[0];
  assert.ok(heading, "Branches must render the resolved title inside an h2");
  assert.ok(
    heading.includes("centuryGothic.className"),
    "Category h2 must use the centuryGothic font",
  );
  for (const token of ["text-2xl", "md:text-3xl", "mt-8", "mb-1", "text-white"]) {
    assert.ok(heading.includes(token), `Category h2 must include «${token}»`);
  }

  const headingIndex = pageSource.indexOf("<h2");
  const gridIndex = pageSource.indexOf("grid grid-cols-1");
  assert.ok(headingIndex >= 0, "ProductPage must include an h2");
  assert.ok(gridIndex >= 0, "ProductPage must keep the product grid");
  assert.ok(headingIndex < gridIndex, "Category h2 must render before the grid");
});

test("category heading only renders for main or featured, never for all", () => {
  const allStart = pageSource.indexOf('resolved.kind === "all"');
  assert.ok(allStart >= 0, "ProductPage must keep the all branch");
  const allBlock = pageSource.slice(allStart);
  assert.ok(!allBlock.includes("<h2"), "All branch must not render a title");
  assert.ok(pageSource.includes("<h2"), "Main/featured branches must render an h2");
});
