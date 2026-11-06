import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { productFormSchema } from "../common/types/product-form.types";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const valid = {
  name: "Maki",
  japaneseName: "",
  description: "",
  price: 5,
  mainCategory: "MAKIS_ROLLS",
  category: "MAKI",
  allergens: [] as string[],
  pieces: 0,
};

test("el esquema acepta los campos opcionales vacíos", () => {
  const r = productFormSchema.safeParse(valid);
  assert.ok(r.success);
  assert.equal(r.data.description, "");
  assert.equal(r.data.japaneseName, "");
  assert.equal(r.data.pieces, 0);
  assert.deepEqual(r.data.allergens, []);
});

test("la descripción solo con espacios se recorta a \"\"", () => {
  const r = productFormSchema.safeParse({ ...valid, description: "   " });
  assert.ok(r.success);
  assert.equal(r.data.description, "");
});

test("sigue rechazando nombre, precio y categoría inválidos", () => {
  assert.ok(!productFormSchema.safeParse({ ...valid, name: "" }).success);
  assert.ok(!productFormSchema.safeParse({ ...valid, price: 0 }).success);
  assert.ok(!productFormSchema.safeParse({ ...valid, category: "" }).success);
});

test("«Descripción» lleva «(opcional)» atenuado dentro del FormLabel", () => {
  const form = read("common/components/forms/product/ProductForm.tsx");
  const m = form.match(
    /<FormLabel>\s*Descripción\s*<span className="([^"]*)">\(opcional\)<\/span>\s*<\/FormLabel>/,
  );
  assert.ok(m);
  assert.ok(m[1].includes("text-muted-foreground"));
  assert.ok(m[1].includes("font-normal"));
});

test("«Foto del producto» lleva «(opcional)» atenuado", () => {
  const src = read("common/components/forms/product/ProductPhotoInput.tsx");
  const m = src.match(
    /<span className="text-sm font-medium">\s*Foto del producto\s*<span className="([^"]*)">\(opcional\)<\/span>\s*<\/span>/,
  );
  assert.ok(m);
  assert.ok(m[1].includes("text-muted-foreground"));
  assert.ok(m[1].includes("font-normal"));
});

test("ProductCard pinta la descripción solo si tiene contenido y conserva flex-1", () => {
  const src = read("common/components/ui/product/ProductCard.tsx");
  assert.ok(/product\.description\?\.trim\(\)\s*&&/.test(src));
  assert.ok(/<CardContent className="flex-1 font-extralight">/.test(src));
  assert.ok(!/<CardContent[^>]*>\s*<p className="text-pretty">/.test(src));
});

test("el esquema documenta los campos opcionales", () => {
  const src = read("common/types/product-form.types.ts");
  assert.ok(src.includes("description: z.string().trim()"));
});
