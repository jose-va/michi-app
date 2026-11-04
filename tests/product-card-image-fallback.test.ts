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

test("ProductCard no pinta recuadro oscuro si la foto falla y muestra las insignias en fila", () => {
  assert.ok(
    source.includes("imageFailed"),
    "ProductCard debe usar el estado imageFailed",
  );
  assert.ok(
    !source.includes("h-44 w-full bg-black/60"),
    "Ya no debe existir el recuadro h-44 w-full bg-black/60",
  );
  assert.ok(
    source.includes("<ImageZoom"),
    "ProductCard debe seguir renderizando ImageZoom si la foto carga",
  );
  assert.ok(
    source.includes("flex flex-wrap items-center gap-2 px-4"),
    "Sin foto, las insignias deben ir en una fila flex flex-wrap",
  );
  assert.ok(
    source.includes("Precio ${formatted}") &&
      source.includes("getCategoryBadge("),
    "Las insignias de categoría y precio deben conservarse",
  );
  assert.equal(
    (source.match(/<Badge/g) ?? []).length,
    4,
    "Debe haber 4 <Badge: categoría con foto, categoría sin foto, Destacado y precio (constante priceBadge, una sola ubicación)",
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

// Nueva semántica: pt-0 sirve para la imagen a ras; sin foto el Card recupera su py-4 normal.
test("ProductCard aplica pt-0 solo cuando hay imagen", () => {
  assert.ok(
    /!imageFailed\s*&&\s*"pt-0"/.test(source),
    "El Card debe añadir pt-0 solo si la imagen no ha fallado",
  );
  assert.ok(
    !/rounded-lg border pt-0/.test(source),
    "pt-0 no debe ser fijo",
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
