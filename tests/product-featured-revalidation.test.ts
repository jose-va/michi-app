import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const read = (rel: string) =>
  readFileSync(new URL(rel, import.meta.url), "utf8");

const actions = read("../lib/server-actions.ts");
const page = read("../common/components/pages/product/ProductFormPage.tsx");
const categoryInput = read("../common/components/forms/product/CategoryInput.tsx");

function functionBody(source: string, name: string): string {
  const start = source.indexOf(`export async function ${name}(`);
  assert.notEqual(start, -1, `${name} no encontrada`);
  const next = source.indexOf("\nexport ", start + 1);
  return source.slice(start, next === -1 ? undefined : next);
}

for (const name of ["createProduct", "updateProduct"]) {
  test(`${name} revalida /product tras el éxito (RF-8)`, () => {
    const body = functionBody(actions, name);
    const tryPart = body.slice(0, body.indexOf("catch"));
    assert.match(tryPart, /revalidatePath\("\/product"\)/);
    assert.ok(
      tryPart.indexOf("ProductService.") < tryPart.indexOf("revalidatePath"),
      "revalida después de guardar",
    );
  });

  test(`${name} devuelve null en fallo y no revalida (RF-9)`, () => {
    const body = functionBody(actions, name);
    const catchPart = body.slice(body.indexOf("catch"));
    assert.match(catchPart, /return null/);
    assert.doesNotMatch(catchPart, /revalidatePath/);
  });
}

test("createProduct/updateProduct reenvían featured sin filtrarlo (RF-8)", () => {
  assert.match(functionBody(actions, "createProduct"), /ProductService\.create\(data\)/);
  assert.match(functionBody(actions, "updateProduct"), /\.\.\.data/);
});

test("ProductFormPage muestra toast.error existentes ante null (RF-9)", () => {
  assert.match(
    page,
    /const updated = await updateProduct\([^)]*\);[\s\S]*?else \{\s*toast\.error\("No se ha podido actualizar el producto"\);/,
  );
  assert.match(
    page,
    /const created = await createProduct\(payload\);[\s\S]*?else \{\s*toast\.error\("No se ha podido crear el producto"\);/,
  );
});

test("un fallo no navega ni resetea el formulario (sin perder datos, RF-9)", () => {
  for (const msg of [
    "No se ha podido actualizar el producto",
    "No se ha podido crear el producto",
  ]) {
    const i = page.indexOf(`toast.error("${msg}")`);
    assert.notEqual(i, -1);
    const tail = page.slice(i, page.indexOf("}", i));
    assert.doesNotMatch(tail, /router\.|form\.reset|reset\(/);
  }
  assert.doesNotMatch(page, /form\.reset|\breset\(/);
});

test("CategoryInput no incluye Destacados (RF-11)", () => {
  assert.match(categoryInput, /categories/);
  assert.doesNotMatch(categoryInput, /filterCategories|FEATURED_CATEGORY|Destacados/i);
});
