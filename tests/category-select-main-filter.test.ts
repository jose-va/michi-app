import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// T10 — Filtro con 8 visibles + URL directa SPECIAL/DESSERTS (RF-1, RF-2, RF-3, RF-11).

const selectSource = readFileSync(
  new URL("../common/components/layout/product/CategorySelect.tsx", import.meta.url),
  "utf8",
);

test("CategorySelect itera MAIN_FILTER_OPTIONS del nuevo mapper y no filterCategories", () => {
  assert.match(selectSource, /MAIN_FILTER_OPTIONS/);
  assert.match(selectSource, /MAIN_FILTER_OPTIONS\.map\(/);
  assert.doesNotMatch(selectSource, /filterCategories/);
  assert.doesNotMatch(selectSource, /\bcategories\.map\(/);
});

test("CategorySelect delega la lectura a resolveCategoryFilter", () => {
  assert.match(selectSource, /resolveCategoryFilter\(/);
  assert.match(
    selectSource,
    /from "@\/common\/mappers\/main-category\.mapper"/,
  );
});

test("CategorySelect escribe canónico: all borra el param y resetea page", () => {
  assert.match(selectSource, /resetPageParam\(searchParams\)/);
  assert.match(selectSource, /if \(value === "all"\) params\.delete\("category"\)/);
  assert.match(selectSource, /params\.set\("category", value\)/);
});

test("MAIN_FILTER_OPTIONS ofrece las 8 opciones en orden con valores canónicos", async () => {
  const { MAIN_FILTER_OPTIONS } = await import(
    "../common/mappers/main-category.mapper"
  );
  assert.deepEqual(
    MAIN_FILTER_OPTIONS.map((option) => option.value),
    [
      "all",
      "featured",
      "STARTERS",
      "HOT_KITCHEN",
      "SUSHI_CLASSIC",
      "MAKIS_ROLLS",
      "SPECIAL",
      "COMBOS",
    ],
  );
  assert.deepEqual(
    MAIN_FILTER_OPTIONS.map((option) => option.label),
    [
      "Todas",
      "Destacados",
      "Entrantes",
      "Platos calientes",
      "Sushi clásico",
      "Rolls y makis",
      "Makis especiales",
      "Combinados",
    ],
  );
});

test("DESSERTS no aparece en el desplegable pero resuelve a rama main (RF-2/RF-11)", async () => {
  const {
    MAIN_FILTER_OPTIONS,
    resolveCategoryFilter,
    getMainCategoryTitle,
    getMainCategoryDescription,
  } = await import("../common/mappers/main-category.mapper");
  assert.ok(
    !MAIN_FILTER_OPTIONS.some((option) => option.value === "DESSERTS"),
  );
  assert.ok(!MAIN_FILTER_OPTIONS.some((option) => option.label === "Postres"));
  assert.deepEqual(resolveCategoryFilter("DESSERTS"), {
    kind: "main",
    main: "DESSERTS",
  });
  assert.deepEqual(resolveCategoryFilter("desserts"), {
    kind: "main",
    main: "DESSERTS",
  });
  assert.deepEqual(resolveCategoryFilter(" desserts "), {
    kind: "main",
    main: "DESSERTS",
  });
  assert.equal(getMainCategoryTitle("DESSERTS"), "Postres");
  assert.equal(
    getMainCategoryDescription("DESSERTS"),
    "Nuestra selección de postres.",
  );
});

test("SPECIAL visible resuelve a rama main con título y descripción (RF-3/RF-11)", async () => {
  const {
    MAIN_FILTER_OPTIONS,
    resolveCategoryFilter,
    getMainCategoryTitle,
    getMainCategoryDescription,
  } = await import("../common/mappers/main-category.mapper");
  assert.ok(
    MAIN_FILTER_OPTIONS.some(
      (option) => option.value === "SPECIAL" && option.label === "Makis especiales",
    ),
  );
  assert.deepEqual(resolveCategoryFilter("SPECIAL"), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.deepEqual(resolveCategoryFilter("special"), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.deepEqual(resolveCategoryFilter(" special "), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.equal(getMainCategoryTitle("SPECIAL"), "Makis especiales");
  assert.equal(
    getMainCategoryDescription("SPECIAL"),
    "Los especiales de la casa, creaciones únicas del chef.",
  );
});
