import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const form = read("common/components/forms/product/ProductForm.tsx");

test("«(opcional)» de Nombre japonés va atenuado dentro del FormLabel", () => {
  assert.ok(form.includes("Nombre japonés"));
  assert.ok(!form.includes("<FormLabel>Nombre japonés (opcional)</FormLabel>"));
  const match = form.match(
    /<FormLabel>\s*Nombre japonés\s*<span className="([^"]*)">\(opcional\)<\/span>\s*<\/FormLabel>/,
  );
  assert.ok(match, "span con (opcional) dentro de FormLabel");
  assert.ok(match[1].includes("text-muted-foreground"));
  assert.ok(match[1].includes("font-normal"));
});

test("«Piezas» es opcional y va entre Descripción y Precio", () => {
  const match = form.match(
    /<FormLabel>\s*Piezas\s*<span className="([^"]*)">\(opcional\)<\/span>\s*<\/FormLabel>/,
  );
  assert.ok(match, "span con (opcional) dentro de FormLabel de Piezas");
  assert.ok(match[1].includes("text-muted-foreground"));
  assert.ok(match[1].includes("font-normal"));
  const d = form.indexOf('name="description"');
  const p = form.indexOf('name="pieces"');
  const pr = form.indexOf('name="price"');
  assert.ok(d >= 0 && p > d && p < pr);
});


