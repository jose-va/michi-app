import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("el pie de ProductCard tiene el mismo alto con y sin alérgenos (contenido de 25 px)", () => {
  assert.ok(
    /<CardFooter className="[^"]*items-center[^"]*"/.test(source),
    "CardFooter debe centrar verticalmente (items-center)",
  );
  assert.equal(
    (source.match(/min-h-\[25px\]/g) ?? []).length,
    2,
    "Ambas ramas deben tener min-h-[25px] (alto del icono)",
  );
  assert.ok(
    !/<CardFooter className="[^"]*min-h-/.test(source),
    "El alto sale del contenido, no de un min-h en el pie",
  );
});

test("sin alérgenos el pie muestra el texto en pequeño y gris", () => {
  assert.ok(
    source.includes("product.allergens?.length"),
    "Debe comprobar allergens con ?.length",
  );
  assert.ok(
    /<p className="[^"]*text-xs text-zinc-400"?[^>]*>\s*Este plato no contiene alérgenos\s*<\/p>/.test(
      source,
    ),
    "Debe mostrar «Este plato no contiene alérgenos» con text-xs text-zinc-400",
  );
});

test("con alérgenos se siguen pintando los iconos", () => {
  assert.ok(source.includes("product.allergens.map("));
  assert.ok(source.includes("getAllergenIcon(allergen)"));
});
