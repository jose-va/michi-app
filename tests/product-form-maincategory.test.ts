import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { productFormSchema } from "../common/types/product-form.types";

const complete = {
  name: "Nigiri",
  japaneseName: "",
  description: "",
  price: 3,
  mainCategory: "SUSHI_CLASSIC",
  category: "NIGIRI_SUSHI",
  allergens: [] as string[],
  pieces: 0,
};

test("el esquema rechaza el payload sin principal (mainCategory ausente)", () => {
  const withoutMain: Record<string, unknown> = { ...complete };
  delete withoutMain.mainCategory;
  assert.ok(!productFormSchema.safeParse(withoutMain).success);
});

test("el esquema rechaza la principal vacía con mensaje en español", () => {
  const r = productFormSchema.safeParse({ ...complete, mainCategory: "" });
  assert.ok(!r.success);
  assert.ok(
    r.error.issues.some(
      (i) =>
        i.path.join(".") === "mainCategory" &&
        i.message === "Por favor, seleccione una categoría",
    ),
  );
});

test("el esquema acepta un payload completo con principal y subcategoría", () => {
  const r = productFormSchema.safeParse(complete);
  assert.ok(r.success);
  assert.equal(r.data.mainCategory, "SUSHI_CLASSIC");
  assert.equal(r.data.category, "NIGIRI_SUSHI");
});

test("category (subcategoría) sigue siendo obligatoria y no vacía", () => {
  assert.ok(
    !productFormSchema.safeParse({ ...complete, category: "" }).success,
  );
});

test("Product declara mainCategory obligatorio", () => {
  const src = readFileSync(
    new URL("../common/types/product.types.ts", import.meta.url),
    "utf8",
  );
  assert.ok(src.includes("mainCategory: string"));
});
