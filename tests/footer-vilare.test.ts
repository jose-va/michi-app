import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "common/components/layout/SiteFooter.tsx"),
  "utf8",
);

describe("Crédito Vilare en la línea de cierre (RF-23, T18)", () => {
  it("muestra el texto visible «Diseñado por»", () => {
    assert.ok(source.includes("Diseñado por"));
  });

  it("usa la imagen Vilare SVG con alt exacto y hueco 160×64 sin deformar", () => {
    assert.ok(source.includes("/logos/VILARE.svg"));
    assert.ok(source.includes('alt="Desarrollado por Vilare"'));
    assert.ok(source.includes("h-[64px] w-[160px]"));
    assert.ok(source.includes("object-contain"));
  });

  it("no crea 5ª zona de bloques (vuelve a 4 columnas)", () => {
    assert.ok(source.includes("md:grid-cols-4"));
    assert.ok(!source.includes("md:grid-cols-5"));
  });

  it("el logo Vilare enlaza a su LinkedIn en pestaña nueva", () => {
    assert.ok(source.includes("https://www.linkedin.com/in/vilare/"));
    assert.ok(source.includes('target="_blank"'));
    assert.ok(source.includes('rel="noopener noreferrer"'));
    assert.ok(source.includes("group-hover:brightness-125"));
    assert.ok(source.includes("cursor-pointer"));
  });
});
