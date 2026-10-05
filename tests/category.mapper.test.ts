import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categories,
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
