import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

const ZINC_100: [number, number, number] = [244, 244, 245];
const ZINC_200: [number, number, number] = [228, 228, 231];
// Peor caso: fondo blanco, card bg-black/80 y foto blanca al 30 % con brightness-75 (~93 por canal).
const WORST_CASE_BG: [number, number, number] = [93, 93, 93];

function linearize(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("About: card translúcida y tonos claros (RF-6, RNF-1)", () => {
  it("card bg-black/80 con blur sobre la foto", () => {
    assert.ok(SOURCE.includes("bg-black/80"));
    assert.ok(SOURCE.includes("backdrop-blur-md"));
  });

  it("card no demasiado opaca (sin bg-black/85 o superior)", () => {
    for (const opaque of ["bg-black/85", "bg-black/90", "bg-black/95"]) {
      assert.ok(!SOURCE.includes(opaque), `card demasiado opaca: ${opaque}`);
    }
  });

  it("título y firma en text-zinc-100, párrafos en text-zinc-200", () => {
    assert.ok(SOURCE.includes("text-zinc-100"));
    assert.ok(SOURCE.includes("text-zinc-200"));
  });
});

describe("About: contraste mínimo 4,5:1 en el peor caso (RF-6, RNF-1)", () => {
  it("título/firma (zinc-100) sobre foto blanca + card 80 % + foto 30 %", () => {
    assert.ok(contrastRatio(ZINC_100, WORST_CASE_BG) >= 4.5);
  });

  it("párrafos (zinc-200) sobre foto blanca + card 80 % + foto 30 %", () => {
    assert.ok(contrastRatio(ZINC_200, WORST_CASE_BG) >= 4.5);
  });
});
