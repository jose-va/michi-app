import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../common/components/ui/product/ProductCard.tsx", import.meta.url),
  "utf8",
);

test("piezas y descripción comparten tamaño y peso de texto", () => {
  const content = source.match(/<CardContent className="([^"]*)"/);
  assert.ok(content, "debe existir CardContent con className");
  assert.ok(content[1].includes("font-extralight"));
  assert.ok(!/\btext-(xs|base|lg)\b/.test(content[1]), "la descripción usa el tamaño base del Card (text-sm)");
  const pieces = source.match(/<span\s+className=\{cn\(\s*"([^"]*)"[^)]*\)\}\s*>\s*\{product\.pieces/);
  assert.ok(pieces, "debe existir el span de piezas");
  assert.ok(
    pieces[1].split(" ").includes("text-sm") &&
      pieces[1].split(" ").includes("font-extralight"),
    "piezas debe llevar text-sm font-extralight, igual que la descripción",
  );
  assert.ok(!pieces[1].includes("text-xs"));
});
