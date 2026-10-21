import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FOOTER_LEGAL,
  FOOTER_SECTIONS,
} from "@/common/components/layout/footer-links";

describe("Enlaces del Bloque Secciones del footer (RF-3)", () => {
  it("contiene exactamente 5 enlaces", () => {
    assert.equal(FOOTER_SECTIONS.length, 5);
  });

  it("tiene etiquetas y hrefs exactos en orden", () => {
    assert.deepEqual(FOOTER_SECTIONS, [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/about" },
      { label: "Carta", href: "/product" },
      { label: "Reservar", href: "/reservation" },
      { label: "Ubicación", href: "/location" },
    ]);
  });

  it("no tiene hrefs ni etiquetas duplicados", () => {
    const hrefs = FOOTER_SECTIONS.map((item) => item.href);
    const labels = FOOTER_SECTIONS.map((item) => item.label);
    assert.equal(new Set(hrefs).size, hrefs.length);
    assert.equal(new Set(labels).size, labels.length);
  });
});

describe("Enlaces del Bloque Información legal del footer (RF-5)", () => {
  it("contiene exactamente 3 enlaces", () => {
    assert.equal(FOOTER_LEGAL.length, 3);
  });

  it("tiene etiquetas y hrefs exactos en orden", () => {
    assert.deepEqual(FOOTER_LEGAL, [
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Política de cookies", href: "/cookies" },
    ]);
  });

  it("no tiene hrefs ni etiquetas duplicados", () => {
    const hrefs = FOOTER_LEGAL.map((item) => item.href);
    const labels = FOOTER_LEGAL.map((item) => item.label);
    assert.equal(new Set(hrefs).size, hrefs.length);
    assert.equal(new Set(labels).size, labels.length);
  });

  it("no comparte hrefs con el Bloque Secciones", () => {
    const sectionHrefs = new Set(FOOTER_SECTIONS.map((item) => item.href));
    for (const item of FOOTER_LEGAL) {
      assert.ok(!sectionHrefs.has(item.href));
    }
  });
});
