import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { navItems } from "@/common/components/layout/NavLinks";
import { FOOTER_SECTIONS } from "@/common/components/layout/footer-links";

const SOURCE = readFileSync("app/about/page.tsx", "utf8");

describe("About T8: columna fluida sin scroll horizontal (RNF-2)", () => {
  it("columna centrada con max-w-prose y mx-auto", () => {
    assert.ok(SOURCE.includes("max-w-prose"));
    assert.ok(SOURCE.includes("mx-auto"));
  });

  it("sin anchos fijos en píxeles ni mínimos que desborden a 320 px", () => {
    assert.ok(!/w-\[\d+px\]/.test(SOURCE));
    assert.ok(!/min-w-/.test(SOURCE));
    assert.ok(!/max-w-\[\d+px\]/.test(SOURCE));
  });

  it("sin patrones que fuercen desborde horizontal", () => {
    assert.ok(!SOURCE.includes("whitespace-nowrap"));
    assert.ok(!/-mx-/.test(SOURCE));
    assert.ok(!/-ml-/.test(SOURCE));
    assert.ok(!/-mr-/.test(SOURCE));
  });
});

describe("About T8: composición móvil / escritorio (RNF-3)", () => {
  it("la sección ocupa la pantalla y deja ver el fondo del layout", () => {
    assert.ok(SOURCE.includes("min-h-screen"));
    assert.ok(!/\bbg-black(?![/\w-])/.test(SOURCE));
  });

  it("la foto cubre el contenedor, que crece con el texto", () => {
    assert.ok(SOURCE.includes("fill"));
    assert.ok(SOURCE.includes("object-cover"));
    assert.ok(SOURCE.includes("min-h-"));
  });

  it("jerarquía responsive: título mayor que cuerpo", () => {
    assert.ok(SOURCE.includes("text-xl"));
    assert.ok(SOURCE.includes("md:text-3xl"));
    assert.ok(SOURCE.includes("text-sm"));
    assert.ok(SOURCE.includes("md:text-base"));
  });

  it("relleno de la card aireado en escritorio", () => {
    assert.ok(SOURCE.includes("p-6"));
    assert.ok(SOURCE.includes("md:p-8"));
  });
});

describe("About T8: menú + footer al mismo destino (RF-1, RF-7)", () => {
  it("menú con «Sobre nosotros» → /about en última posición", () => {
    const last = navItems[navItems.length - 1];
    assert.deepEqual(last, { label: "Sobre nosotros", href: "/about" });
  });

  it("footer «Nosotros» intacto al mismo destino /about", () => {
    const nosotros = FOOTER_SECTIONS.find((item) => item.label === "Nosotros");
    assert.deepEqual(nosotros, { label: "Nosotros", href: "/about" });
  });

  it("sin restos del contenido provisional", () => {
    assert.ok(!/Accordion/i.test(SOURCE));
  });
});
