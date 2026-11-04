import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const category = read("common/components/forms/product/CategoryInput.tsx");
const allergen = read("common/components/forms/product/AllergenInput.tsx");

const maxW = (src: string) => src.match(/max-w-\d+/)?.[0];

test("CategoryInput no usa any", () => {
  assert.ok(!category.includes(": any"));
});

test("Categoría y Alérgenos comparten el mismo ancho máximo", () => {
  assert.equal(maxW(allergen), "max-w-56");
  assert.equal(maxW(category), maxW(allergen));
  assert.ok(!category.includes("max-w-48"));
});
