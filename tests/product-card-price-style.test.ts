import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("la badge de precio es amarilla y destaca como precio", () => {
  const badge = source.match(/<Badge\s+variant="secondary"\s+className="([^"]*)"/);
  assert.ok(badge, "priceBadge debe llevar className propia");
  assert.ok(badge[1].includes("bg-yellow-400"));
  assert.ok(badge[1].includes("text-yellow-950"));
  assert.ok(badge[1].includes("font-semibold"));
});

test("un separador vertical sutil une el precio con las piezas solo si hay precio", () => {
  assert.ok(
    /<span\s+className=\{cn\(\s*"text-sm font-extralight",\s*formatted && "border-l border-white\/30 pl-3"/.test(source),
    "las piezas llevan border-l border-white/30 pl-3 solo cuando hay precio",
  );
});
