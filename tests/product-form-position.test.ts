import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { productFormSchema } from "../common/types/product-form.types";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const form = read("common/components/forms/product/ProductForm.tsx");
const page = read("common/components/pages/product/ProductFormPage.tsx");
const types = read("common/types/product-form.types.ts");

const valid = {
  name: "Michi",
  japaneseName: "",
  description: "",
  price: 5,
  category: "Rolls",
  allergens: [],
  pieces: 8,
};

test("ProductForm no renderiza el campo de posición", () => {
  assert.ok(!form.includes('name="position"'));
  assert.ok(!form.includes("Posición en la carta"));
  assert.ok(!form.includes("showPosition"));
});

test("ProductFormPage no usa showPosition y reenvía position oculta", () => {
  assert.ok(!page.includes("showPosition"));
  assert.ok(page.includes("position: product?.position"));
});

test("El esquema mantiene position opcional y las props no tienen showPosition", () => {
  assert.ok(types.includes("position: z.number().int().min(0).optional()"));
  assert.ok(!types.includes("showPosition"));
});

test("El esquema valida con y sin position", () => {
  assert.ok(productFormSchema.safeParse(valid).success);
  const withPos = productFormSchema.safeParse({ ...valid, position: 3 });
  assert.ok(withPos.success);
  assert.equal(withPos.data.position, 3);
});
