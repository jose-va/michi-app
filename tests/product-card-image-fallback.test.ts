import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);
const utilsSource = readFileSync(
  new URL("../common/utils/product-image.ts", import.meta.url),
  "utf8",
);

test("ProductCard muestra un recuadro negro translúcido del mismo tamaño si la foto falla", () => {
  assert.ok(
    source.includes("imageFailed"),
    "ProductCard debe usar el estado imageFailed",
  );
  assert.ok(
    /\{imageFailed\s*\?\s*\(/.test(source),
    "ProductCard debe renderizar de forma condicional según imageFailed",
  );
  assert.ok(
    source.includes('className="h-44 w-full bg-black/60"'),
    "El fallback debe ser un div negro del mismo tamaño (h-44 w-full bg-black/60)",
  );
  assert.ok(
    source.includes("<Image"),
    "ProductCard debe seguir renderizando <Image> si la foto carga",
  );
});

test("ProductCard activa el fallo en onError del <Image>", () => {
  assert.ok(
    source.includes("onError"),
    "El <Image> del producto debe tener onError",
  );
  assert.ok(
    /onError=\{\(\)\s*=>\s*setImageFailed\(true\)\}/.test(source),
    "onError debe activar el fallo con setImageFailed(true)",
  );
});

test("ProductCard mantiene la geometría con pt-0 siempre (con y sin foto)", () => {
  assert.ok(
    /className=\{cn\(\s*"[^"]*pt-0/.test(source),
    "El Card debe incluir pt-0 en su cadena base para pegar la foto al borde superior",
  );
  assert.ok(
    !/imageFailed\s*&&\s*"pt-0"/.test(source),
    "El pt-0 no debe depender de imageFailed: la geometría es la misma con foto y con fallback",
  );
});

test("ProductCard ya no usa el placeholder dish-composition", () => {
  assert.ok(
    !source.includes("dish-composition"),
    "ProductCard no debe mencionar dish-composition",
  );
  assert.ok(
    !source.includes("PLACEHOLDER"),
    "ProductCard no debe mencionar PLACEHOLDER",
  );
  assert.ok(
    !utilsSource.includes("PRODUCT_IMAGE_PLACEHOLDER") &&
      !utilsSource.includes("dish-composition"),
    "product-image.ts no debe exportar el placeholder dish-composition",
  );
});

test("ProductCard mantiene siempre el Badge de categoría", () => {
  const badgeIndex = source.indexOf("<Badge");
  assert.ok(badgeIndex >= 0, "ProductCard debe seguir mostrando el Badge de categoría");
});
