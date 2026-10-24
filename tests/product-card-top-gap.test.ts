import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("ProductCard pega la foto al borde superior siempre (pt-0 incondicional)", () => {
  assert.ok(
    /className=\{cn\(\s*"[^"]*pt-0/.test(source),
    "El Card debe incluir pt-0 en su cadena base, no solo cuando falla la imagen",
  );
  assert.ok(
    !/imageFailed\s*&&\s*"pt-0"/.test(source),
    "El pt-0 no debe depender de imageFailed: la foto debe ir pegada con y sin imagen",
  );
});

test("ProductCard no añade margen/relleno superior al contenedor de la foto", () => {
  const wrapper = source.match(/<div className="([^"]*)">\s*\{imageFailed/);
  assert.ok(wrapper, "Debe existir el contenedor de la foto antes del ternario imageFailed");
  const classes = wrapper[1];
  assert.ok(!/(^|\s)(mt-|pt-)(?!\d*\/)/.test(classes) || !/(mt-|pt-)\d/.test(classes), `El contenedor de la foto no debe reservar hueco superior, encontrado: "${classes}"`);
  for (const banned of [" mt-", " pt-"]) {
    assert.ok(
      !classes.includes(banned),
      `El contenedor de la foto no debe contener "${banned.trim()}" (encontrado: "${classes}")`,
    );
  }
});

test("ProductCard mantiene el badge superpuesto sin reservar espacio", () => {
  assert.ok(
    source.includes("absolute top-2 left-2"),
    "El Badge de categoría debe seguir absoluto arriba a la izquierda",
  );
  const wrapperIndex = source.indexOf("overflow-hidden");
  const badgeIndex = source.indexOf("<Badge");
  assert.ok(
    wrapperIndex >= 0 && badgeIndex > wrapperIndex,
    "El Badge debe quedar dentro del contenedor de la foto (superpuesto, sin hueco propio)",
  );
});
