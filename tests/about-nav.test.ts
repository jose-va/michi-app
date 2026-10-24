import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { navItems } from "@/common/components/layout/NavLinks";
import { FOOTER_SECTIONS } from "@/common/components/layout/footer-links";

describe("Menú principal: item «Sobre nosotros» al final (RF-7)", () => {
  it("contiene exactamente Carta, Reservar, Ubicacion y Sobre nosotros en ese orden", () => {
    assert.deepEqual(navItems, [
      { label: "Carta", href: "/product" },
      { label: "Reservar", href: "/reservation" },
      { label: "Ubicacion", href: "/location" },
      { label: "Sobre nosotros", href: "/about" },
    ]);
  });

  it("la etiqueta exacta «Sobre nosotros» enlaza a /about en última posición", () => {
    const last = navItems[navItems.length - 1];
    assert.equal(last.label, "Sobre nosotros");
    assert.equal(last.href, "/about");
  });

  it("no tiene hrefs ni etiquetas duplicados", () => {
    const hrefs = navItems.map((item) => item.href);
    const labels = navItems.map((item) => item.label);
    assert.equal(new Set(hrefs).size, hrefs.length);
    assert.equal(new Set(labels).size, labels.length);
  });
});

describe("Pie de página intacto tras añadir el item del menú (RF-7)", () => {
  it("FOOTER_SECTIONS sigue con «Nosotros» → /about", () => {
    const nosotros = FOOTER_SECTIONS.find(
      (item) => item.label === "Nosotros",
    );
    assert.deepEqual(nosotros, { label: "Nosotros", href: "/about" });
  });
});
