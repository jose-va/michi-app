import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getAllergenIcon, getAllergenTitle } from "../common/mappers/allergen.mapper";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const picker = read("common/components/layout/product/AllergenPicker.tsx");
const input = read("common/components/forms/product/AllergenInput.tsx");
const select = read("common/components/layout/product/AllergenSelect.tsx");
const form = read("common/components/forms/product/ProductForm.tsx");

test("AllergenPicker comparte la maquetación de /product", () => {
  assert.ok(picker.includes("grid-cols-2"));
  assert.ok(picker.includes("sm:grid-cols-3"));
  assert.ok(picker.includes("flex-row"));
  assert.ok(picker.includes('alt=""'));
  assert.ok(!picker.includes("grid-cols-5"));
});

test("AllergenInput usa el picker con trigger y panel en flujo", () => {
  assert.ok(input.includes("AllergenPicker"));
  assert.ok(input.includes("Seleccionar alérgenos"));
  assert.ok(input.includes("w-full max-w-56 justify-between gap-1"));
  assert.ok(input.includes("whitespace-nowrap"));
  assert.ok(input.includes("text-left"));
  assert.ok(picker.includes("min-w-0 flex-1 truncate text-left"));
  assert.ok(picker.includes("size-4 shrink-0"));
  assert.ok(!input.includes("grid-cols-5"));
  assert.ok(!input.includes("absolute"));
  assert.ok(!input.includes("mb-1"));
  assert.ok(input.includes("mt-2"));
});

test("AllergenSelect delega en el picker y conserva su panel absolute", () => {
  assert.ok(select.includes("AllergenPicker"));
  assert.ok(select.includes("absolute inset-x-3 top-full z-50 mt-2"));
  assert.ok(select.includes("Alérgenos"));
  assert.ok(select.includes("useSearchParams"));
});

test("ProductForm muestra la etiqueta Alérgenos", () => {
  assert.ok(form.includes("<FormLabel>Alérgenos</FormLabel>"));
});

test("valores desconocidos no rompen el mapper", () => {
  assert.equal(getAllergenTitle("DESCONOCIDO"), "DESCONOCIDO");
  assert.equal(getAllergenIcon("DESCONOCIDO"), "");
});
