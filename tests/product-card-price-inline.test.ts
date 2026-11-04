import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);
const header = source.slice(
  source.indexOf("<CardHeader>"),
  source.indexOf("</CardHeader>"),
);

test("la badge de precio se define una sola vez, sin parámetro de clase", () => {
  assert.equal((source.match(/<Badge/g) ?? []).length, 3);
  assert.equal((source.match(/Precio \$\{formatted\}/g) ?? []).length, 1);
  assert.ok(/const priceBadge\s*=\s*\(\)\s*=>/.test(source));
  assert.equal((source.match(/priceBadge\(\)/g) ?? []).length, 1);
  assert.ok(!/priceBadge\([^)]/.test(source));
  assert.ok(!/imageFailed\s*&&\s*formatted/.test(source));
});

test("el precio va antes que las piezas, en una fila distinta de la del título", () => {
  const title = header.indexOf("<CardTitle");
  const action = header.indexOf("<CardAction");
  const price = header.indexOf("priceBadge()");
  const pieces = header.indexOf("piezas");
  assert.ok(title >= 0 && price > title && pieces > price);
  assert.ok(!header.slice(title, header.indexOf("</CardTitle>")).includes("priceBadge"));
  // la fila 2 es hermana del título, no está dentro del mismo contenedor
  assert.ok(!/<div[^>]*>\s*<CardTitle/.test(header));
  assert.ok(action >= 0);
});

test("la fila 2 es condicional y deja aire entre sus elementos", () => {
  assert.ok(/\(formatted\s*\|\|\s*product\.pieces\s*>\s*0\)\s*&&/.test(header));
  assert.ok(/gap-[23]/.test(header));
  assert.ok(header.includes("1 pieza") || header.includes("pieza`"));
});

test("el header no depende de imageFailed (misma estructura con y sin foto)", () => {
  assert.ok(!header.includes("imageFailed"));
});

test("con foto ya no hay badge de precio superpuesta ni hueco reservado", () => {
  assert.ok(!source.includes("absolute right-2 bottom-2"));
  assert.ok(!/invisible/.test(source));
  assert.ok(!/aria-hidden/.test(source));
  assert.ok(/!imageFailed\s*&&\s*"pt-0"/.test(source));
  assert.ok(source.includes('!product.status && "opacity-60 grayscale"'));
});

test("la fila superior sin foto solo lleva la categoría", () => {
  const start = source.indexOf("flex flex-wrap items-center gap-2 px-4");
  const end = source.indexOf(") : (", start);
  const row = source.slice(start, end);
  assert.ok(row.includes("getCategoryBadge("));
  assert.ok(!row.includes("priceBadge") && !row.includes("formatted"));
});
