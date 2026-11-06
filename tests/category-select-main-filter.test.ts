import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// T5 — Desplegable de filtro con 7 opciones canónicas (RF-1, RF-2, RF-11).

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

test("MAIN_FILTER_OPTIONS ofrece las 7 opciones en orden con valores canónicos", async () => {
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
      "Sushi clásico y bocados",
      "Rolls y makis",
      "Combinados",
    ],
  );
});
