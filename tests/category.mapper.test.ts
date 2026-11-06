import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categories,
  filterCategories,
  getCategoryDescription,
  getCategoryTitle,
} from "../common/mappers/category.mapper";

test("maps a known category to its Spanish title and description", () => {
  assert.equal(getCategoryTitle("NIGIRI_SUSHI"), "Nigiri sushi");
  assert.equal(
    getCategoryDescription("NIGIRI_SUSHI"),
    "Bolita de arroz coronada con cortes de pescado.",
  );
});

test("falls back to the category key when the category is unknown", () => {
  assert.equal(getCategoryTitle("UNKNOWN_CATEGORY"), "UNKNOWN_CATEGORY");
  assert.equal(getCategoryDescription("UNKNOWN_CATEGORY"), "");
});

test("exports the supported category keys", () => {
  assert.ok(categories.includes("NIGIRI_SUSHI"));
});

test("includes the TARTAR category after NIGIRI_SUSHI", () => {
  assert.ok(categories.includes("TARTAR"));
  assert.equal(
    categories.indexOf("TARTAR"),
    categories.indexOf("NIGIRI_SUSHI") + 1,
  );
  assert.equal(getCategoryTitle("TARTAR"), "Tartar");
  assert.notEqual(getCategoryDescription("TARTAR"), "");
});

test("DESSERTS no está en opciones ni tiene título propio (RF-9)", () => {
  assert.equal(categories.includes("DESSERTS"), false);
  assert.equal(filterCategories.includes("DESSERTS"), false);
  assert.equal(filterCategories.includes("Postres"), false);
  // Lectura tolerante: fallback al key sin romper (CL-7)
  assert.equal(getCategoryTitle("DESSERTS"), "DESSERTS");
  assert.equal(getCategoryDescription("DESSERTS"), "");
});

test("TARTAR y COMBOS conservan su texto (invariantes RF-7/RF-8)", () => {
  assert.equal(getCategoryTitle("TARTAR"), "Tartar");
  assert.equal(getCategoryTitle("COMBOS"), "Combinados");
  assert.notEqual(getCategoryDescription("TARTAR"), "");
  assert.notEqual(getCategoryDescription("COMBOS"), "");
});
