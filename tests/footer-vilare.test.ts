import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "common/components/layout/SiteFooter.tsx"),
  "utf8",
);

describe("Crédito Vilare en la línea de cierre (RF-23, T18)", () => {
  it("muestra el texto visible «Desarrollado por»", () => {
    assert.ok(source.includes("Desarrollado por"));
  });

  it("usa la imagen Vilare con alt exacto y hueco 160×64 sin deformar", () => {
    assert.ok(source.includes("/logos/LOGO-VILARE.webp"));
    assert.ok(source.includes('alt="Desarrollado por Vilare"'));
    assert.ok(source.includes("h-[64px] w-[160px]"));
    assert.ok(source.includes("object-contain"));
  });

  it("no crea 5ª zona de bloques (vuelve a 4 columnas)", () => {
    assert.ok(source.includes("md:grid-cols-4"));
    assert.ok(!source.includes("md:grid-cols-5"));
  });

  it("el logo Vilare no está envuelto en enlace", () => {
    const vilareIndex = source.indexOf("/logos/LOGO-VILARE.webp");
    assert.ok(vilareIndex > 0);
    const before = source.slice(Math.max(0, vilareIndex - 500), vilareIndex);
    const openAnchors = (before.match(/<a[\s>]/g) ?? []).length;
    const closeAnchors = (before.match(/<\/a>/g) ?? []).length;
    assert.equal(openAnchors, closeAnchors);
    assert.ok(!before.slice(closeAnchors === 0 ? 0 : before.lastIndexOf("</a>")).includes("<a"));
  });
});
