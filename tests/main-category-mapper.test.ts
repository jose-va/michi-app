import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAIN_CATEGORIES,
  MAIN_FILTER_OPTIONS,
  getMainCategoryDescription,
  getMainCategoryTitle,
  isMainCategory,
  resolveCategoryFilter,
} from "../common/mappers/main-category.mapper";

test("asigna los 7 títulos de principales en español (RF-4)", () => {
  assert.equal(getMainCategoryTitle("STARTERS"), "Entrantes");
  assert.equal(getMainCategoryTitle("HOT_KITCHEN"), "Platos calientes");
  assert.equal(getMainCategoryTitle("SUSHI_CLASSIC"), "Sushi clásico");
  assert.equal(getMainCategoryTitle("MAKIS_ROLLS"), "Rolls y makis");
  assert.equal(getMainCategoryTitle("SPECIAL"), "Makis especiales");
  assert.equal(getMainCategoryTitle("COMBOS"), "Combinados");
  assert.equal(getMainCategoryTitle("DESSERTS"), "Postres");
});

test("asigna las 7 descripciones de principales en español (RF-5)", () => {
  assert.equal(
    getMainCategoryDescription("STARTERS"),
    "Para empezar: entrantes fríos, calientes y tartar.",
  );
  assert.equal(
    getMainCategoryDescription("HOT_KITCHEN"),
    "Raciones de fideos y arroz calientes.",
  );
  assert.equal(
    getMainCategoryDescription("SUSHI_CLASSIC"),
    "Nigiri, gunkan, temaki y otros bocados clásicos.",
  );
  assert.equal(
    getMainCategoryDescription("MAKIS_ROLLS"),
    "Hosomaki, uramaki, futomaki y katsumaki.",
  );
  assert.equal(
    getMainCategoryDescription("SPECIAL"),
    "Los especiales de la casa, creaciones únicas del chef.",
  );
  assert.equal(
    getMainCategoryDescription("COMBOS"),
    "Selecciones para compartir y descubrir sin complicaciones.",
  );
  assert.equal(
    getMainCategoryDescription("DESSERTS"),
    "Nuestra selección de postres.",
  );
});

test("MAIN_CATEGORIES tiene 7 con DESSERTS última (RF-9)", () => {
  assert.deepEqual(MAIN_CATEGORIES, [
    "STARTERS",
    "HOT_KITCHEN",
    "SUSHI_CLASSIC",
    "MAKIS_ROLLS",
    "SPECIAL",
    "COMBOS",
    "DESSERTS",
  ]);
});

test("ofrece 8 opciones visibles sin Postres y con Makis especiales (RF-2/RF-9)", () => {
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

test("resolveCategoryFilter: ausente o all muestra todas (RF-11)", () => {
  assert.deepEqual(resolveCategoryFilter(undefined), { kind: "all" });
  assert.deepEqual(resolveCategoryFilter("all"), { kind: "all" });
  assert.deepEqual(resolveCategoryFilter("ALL"), { kind: "all" });
  assert.deepEqual(resolveCategoryFilter("  all  "), { kind: "all" });
});

test("resolveCategoryFilter: featured insensible a caso y espacios (RF-11)", () => {
  assert.deepEqual(resolveCategoryFilter("featured"), { kind: "featured" });
  assert.deepEqual(resolveCategoryFilter("FEATURED"), { kind: "featured" });
  assert.deepEqual(resolveCategoryFilter("Featured"), { kind: "featured" });
  assert.deepEqual(resolveCategoryFilter("  Featured  "), { kind: "featured" });
});

test("resolveCategoryFilter: principales insensibles a caso y espacios (RF-11)", () => {
  assert.deepEqual(resolveCategoryFilter("STARTERS"), {
    kind: "main",
    main: "STARTERS",
  });
  assert.deepEqual(resolveCategoryFilter("starters"), {
    kind: "main",
    main: "STARTERS",
  });
  assert.deepEqual(resolveCategoryFilter("  hot_kitchen "), {
    kind: "main",
    main: "HOT_KITCHEN",
  });
  assert.deepEqual(resolveCategoryFilter("Sushi_Classic"), {
    kind: "main",
    main: "SUSHI_CLASSIC",
  });
  assert.deepEqual(resolveCategoryFilter("MAKIS_ROLLS"), {
    kind: "main",
    main: "MAKIS_ROLLS",
  });
  assert.deepEqual(resolveCategoryFilter("special"), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.deepEqual(resolveCategoryFilter("SPECIAL"), {
    kind: "main",
    main: "SPECIAL",
  });
  assert.deepEqual(resolveCategoryFilter("combos"), {
    kind: "main",
    main: "COMBOS",
  });
});

test("resolveCategoryFilter: DESSERTS directo resuelve a rama main (RF-9/RF-11)", () => {
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
});

test("resolveCategoryFilter: vacío, subs heredadas y basura son inválidos (RF-11)", () => {
  assert.deepEqual(resolveCategoryFilter(""), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("   "), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("NIGIRI_SUSHI"), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter(" nigiri_sushi "), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("basura"), { kind: "invalid" });
});

test("isMainCategory acepta las 7 principales en MAYÚSCULAS exactas", () => {
  assert.equal(isMainCategory("STARTERS"), true);
  assert.equal(isMainCategory("SPECIAL"), true);
  assert.equal(isMainCategory("COMBOS"), true);
  assert.equal(isMainCategory("DESSERTS"), true);
  assert.equal(isMainCategory("starters"), false);
  assert.equal(isMainCategory("desserts"), false);
  assert.equal(isMainCategory("NIGIRI_SUSHI"), false);
  assert.equal(isMainCategory(undefined), false);
});
