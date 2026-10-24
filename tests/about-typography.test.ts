import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

function extractH1Class(): string {
  const match = SOURCE.match(/<h1[^>]*className=\{`([^`]*)`\}/);
  assert.ok(match, "h1 con className template no encontrado");
  return match[1];
}

describe("About T4: título, relato y tipografías Playfair (RF-2, RF-3, RF-4, RF-8)", () => {
  it("h1 único con título; kanji separado en span decorativo", () => {
    const h1Count = (SOURCE.match(/<h1[\s>]/g) ?? []).length;
    assert.equal(h1Count, 1);
    assert.ok(SOURCE.includes("ABOUT_TITLE"));
    assert.ok(SOURCE.includes("ABOUT_KANJI"));
    assert.ok(SOURCE.includes("<span"));
  });

  it("5 párrafos en orden + firma desde about-content.ts", () => {
    assert.ok(SOURCE.includes("getAboutParagraphs"));
    assert.ok(SOURCE.includes("ABOUT_SIGNATURE"));
  });

  it("título en Playfair, mayúsculas espaciadas, tono claro", () => {
    const h1Class = extractH1Class();
    assert.ok(h1Class.includes("playfair"));
    assert.ok(h1Class.includes("uppercase"));
    assert.ok(h1Class.includes("tracking-"));
    assert.ok(h1Class.includes("md:text-3xl"));
    assert.ok(!h1Class.includes("italic"));
  });

  it("cuerpo en Montserrat justificado, tono claro", () => {
    assert.ok(SOURCE.includes("montserrat.className"));
    assert.ok(SOURCE.includes("text-justify"));
    assert.ok(SOURCE.includes("leading-relaxed"));
    assert.ok(SOURCE.includes("text-zinc-200"));
  });

  it("firma en Playfair itálica, tono claro", () => {
    assert.ok(SOURCE.includes("italic"));
    assert.ok(SOURCE.includes("text-zinc-100"));
  });
});
