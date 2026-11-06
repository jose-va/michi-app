import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FEATURED_CATEGORY,
  categories,
  filterCategories,
  getCategoryDescription,
  getCategoryTitle,
  isFeaturedCategory,
} from "../common/mappers/category.mapper";

test("isFeaturedCategory reconoce featured sin distinguir mayúsculas", () => {
  assert.equal(FEATURED_CATEGORY, "featured");
  for (const v of ["featured", "Featured", "FEATURED"]) {
    assert.equal(isFeaturedCategory(v), true);
  }
  for (const v of ["", undefined, "HOT_DISHES"]) {
    assert.equal(isFeaturedCategory(v), false);
  }
});

test("categories no contiene featured en ninguna capitalización", () => {
  assert.equal(categories.some((c) => c.toLowerCase() === "featured"), false);
});

test("filterCategories antepone featured y conserva el resto", () => {
  assert.equal(filterCategories[0], "featured");
  assert.deepEqual(filterCategories.slice(1), categories);
});

test("título y descripción de Destacados", () => {
  for (const v of ["featured", "Featured", "FEATURED"]) {
    assert.equal(getCategoryTitle(v), "Destacados");
    assert.equal(getCategoryDescription(v), "Recomendaciones de la casa y platos más vendidos.");
  }
  // RF-7/RF-9: DESSERTS dual con título propio «Postres»
  assert.equal(getCategoryTitle("DESSERTS"), "Postres");
  assert.equal(
    getCategoryDescription("DESSERTS"),
    "Nuestra selección de postres.",
  );
});
