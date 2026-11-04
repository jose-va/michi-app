import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("ProductCard normaliza featured con normalizeFeatured", () => {
  assert.match(source, /@\/common\/utils\/product-featured/);
  assert.match(source, /normalizeFeatured\(product\.featured\)/);
});

test("ProductCard muestra un icono accesible sobre la imagen solo si es destacado", () => {
  assert.match(source, /BadgeCheck/);
  assert.match(source, /isFeatured && \(/);
  assert.match(source, /Producto destacado/);
  assert.match(source, /absolute top-2 right-2/);
});
