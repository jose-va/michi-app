import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { formatPriceES } from "../common/utils/product-price";

test("formatPriceES formatea 4.5 en español exacto", () => {
  assert.equal(formatPriceES(4.5), "4,50 €");
});

test("formatPriceES oculta precio 0", () => {
  assert.equal(formatPriceES(0), null);
});

test("formatPriceES oculta precio negativo", () => {
  assert.equal(formatPriceES(-1), null);
});

test("formatPriceES oculta NaN", () => {
  assert.equal(formatPriceES(NaN), null);
});

test("formatPriceES oculta Infinity", () => {
  assert.equal(formatPriceES(Infinity), null);
});

test("formatPriceES oculta undefined sin reservar hueco", () => {
  assert.equal(formatPriceES(undefined as unknown as number), null);
});

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("ProductCard usa el formateador de precio español", () => {
  assert.ok(
    source.includes("formatPriceES"),
    "ProductCard debe usar formatPriceES",
  );
  assert.ok(
    source.includes("common/utils/product-price"),
    "ProductCard debe importar el formateador de common/utils/product-price",
  );
  assert.ok(
    source.includes("formatPriceES(product.price)"),
    "ProductCard debe formatear product.price",
  );
});

test("ProductCard muestra el precio en badge inferior-derecha sobre la foto", () => {
  assert.ok(
    source.includes("absolute right-2 bottom-2"),
    "El badge de precio debe anclarse abajo a la derecha",
  );
  assert.ok(
    source.includes("rounded-full"),
    "El badge de precio debe ser redondeado",
  );
  assert.ok(
    source.includes("bg-black/75"),
    "El badge de precio debe usar fondo oscuro semitransparente",
  );
  assert.ok(
    source.includes("Precio"),
    "El badge de precio debe exponer etiqueta de precio para accesibilidad",
  );
});

test("ProductCard solo muestra el precio cuando es válido", () => {
  assert.ok(
    /\{formatted\s*&&/.test(source),
    "El badge de precio debe renderizarse solo si hay formato válido",
  );
  const wrapperIndex = source.indexOf("overflow-hidden");
  const priceIndex = source.indexOf("Precio");
  assert.ok(
    wrapperIndex >= 0 && priceIndex > wrapperIndex,
    "El badge de precio debe estar dentro del contenedor de la foto",
  );
});

test("ProductCard ancla los badges a la foto con recorte superior", () => {
  assert.ok(
    source.includes("relative") &&
      source.includes("overflow-hidden") &&
      source.includes("rounded-t-lg"),
    "La foto debe envolverse en contenedor relativo con recorte superior",
  );
  const wrapperIndex = source.indexOf("overflow-hidden");
  const badgeIndex = source.indexOf("<Badge");
  assert.ok(
    wrapperIndex >= 0 && badgeIndex > wrapperIndex,
    "El Badge de categoría debe quedar dentro del contenedor de la foto",
  );
  assert.ok(
    source.includes("absolute top-2 left-2"),
    "El Badge de categoría debe seguir arriba a la izquierda",
  );
});

test("ProductCard mantiene pieces junto al título", () => {
  assert.ok(source.includes("product.pieces"), "Debe mostrar pieces");
  assert.ok(
    source.includes("pieza") && source.includes("piezas"),
    "Debe mantener los literales pieza/piezas",
  );
});

test("ProductCard mantiene alérgenos en el footer y sin precio en el footer", () => {
  assert.ok(source.includes("<CardFooter"), "Debe mantener CardFooter");
  assert.ok(
    source.includes("product.allergens.map"),
    "Debe mantener los alérgenos en el footer",
  );
  const footerIndex = source.indexOf("<CardFooter");
  const footerSection = source.slice(footerIndex);
  assert.ok(
    !footerSection.includes("formatted") &&
      !footerSection.includes("Precio") &&
      !footerSection.includes("formatPriceES"),
    "El precio no debe estar en el footer",
  );
});
