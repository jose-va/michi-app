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

test("asigna los 5 títulos de principales en español (RF-4)", () => {
  assert.equal(getMainCategoryTitle("STARTERS"), "Entrantes");
  assert.equal(getMainCategoryTitle("HOT_KITCHEN"), "Platos calientes");
  assert.equal(getMainCategoryTitle("SUSHI_CLASSIC"), "Sushi clásico y bocados");
  assert.equal(getMainCategoryTitle("MAKIS_ROLLS"), "Rolls y makis");
  assert.equal(getMainCategoryTitle("COMBOS"), "Combinados");
});

test("asigna las 5 descripciones de principales en español (RF-5)", () => {
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
    "Hosomaki, uramaki, futomaki y creaciones del chef.",
  );
  assert.equal(
    getMainCategoryDescription("COMBOS"),
    "Selecciones para compartir y descubrir sin complicaciones.",
  );
});

test("ofrece las 7 opciones de filtro en orden (RF-2/RF-11)", () => {
  assert.deepEqual(
    MAIN_FILTER_OPTIONS.map((option) => option.value),
    ["all", "featured", ...MAIN_CATEGORIES],
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
  assert.deepEqual(MAIN_CATEGORIES, [
    "STARTERS",
    "HOT_KITCHEN",
    "SUSHI_CLASSIC",
    "MAKIS_ROLLS",
    "COMBOS",
  ]);
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
  assert.deepEqual(resolveCategoryFilter("combos"), {
    kind: "main",
    main: "COMBOS",
  });
});

test("resolveCategoryFilter: vacío, subs heredadas, DESSERTS y basura son inválidos (RF-11)", () => {
  assert.deepEqual(resolveCategoryFilter(""), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("   "), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("NIGIRI_SUSHI"), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter(" nigiri_sushi "), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("DESSERTS"), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter(" desserts "), { kind: "invalid" });
  assert.deepEqual(resolveCategoryFilter("basura"), { kind: "invalid" });
});

test("isMainCategory solo acepta las 5 principales en MAYÚSCULAS exactas", () => {
  assert.equal(isMainCategory("STARTERS"), true);
  assert.equal(isMainCategory("COMBOS"), true);
  assert.equal(isMainCategory("starters"), false);
  assert.equal(isMainCategory("DESSERTS"), false);
  assert.equal(isMainCategory("NIGIRI_SUSHI"), false);
  assert.equal(isMainCategory(undefined), false);
});
