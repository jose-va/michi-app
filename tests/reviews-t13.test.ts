// Spec 004 T13 — Fondo de la sección con el mismo degradado de la cabecera.
// RF-15. RNF-6, RNF-7. Tests primero (rojo): fondo completo de la sección
// idéntico al de la cabecera de ubicación (sustituye el fondo oscuro
// uniforme anterior), tarjetas internas intactas, y contraste objetivo
// 4,5:1 con textos claros sin desbordamiento.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const SECTION = "common/components/ui/location/ReviewsSection.tsx";
const PAGE = "common/components/pages/location/LocationPage.tsx";

// El degradado de referencia vive en la cabecera de la 003: debe usarse
// idéntico en la sección (mismo origen negro 60 %, mismo paso 40 % con
// parada 80 % y misma cola transparente).
const HEADER_GRADIENT =
  "bg-gradient-to-b from-black/60 via-black/40 via-80% to-transparent";

describe("reviews-t13: fondo idéntico al degradado de la cabecera (RF-15)", () => {
  it("la cabecera de referencia usa el degradado esperado", () => {
    const page = readFileSync(PAGE, "utf8");
    assert.ok(
      page.includes(HEADER_GRADIENT),
      "la cabecera 003 es la referencia del degradado",
    );
  });

  it("la sección usa en todo su fondo el mismo degradado de la cabecera", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      source.includes(HEADER_GRADIENT),
      "la sección debe usar el degradado idéntico al de la cabecera",
    );
  });

  it("la sección sustituye el fondo oscuro uniforme anterior", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      !source.includes("bg-black/50"),
      "la sección ya no usa el fondo oscuro uniforme anterior",
    );
  });
});

describe("reviews-t13: tarjetas internas intactas (RF-15)", () => {
  it("las tarjetas de reseña mantienen su aspecto actual", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      source.includes("bg-black/40"),
      "las tarjetas internas conservan su fondo actual",
    );
  });
});

describe("reviews-t13: contraste objetivo y sin overflow (RNF-6, RNF-7)", () => {
  it("los textos mantienen tonos claros sobre fondo oscuro (objetivo 4,5:1)", () => {
    const source = readFileSync(SECTION, "utf8");
    for (const tone of ["text-white", "text-zinc-200", "text-zinc-300"]) {
      assert.ok(source.includes(tone), `la sección conserva ${tone}`);
    }
  });

  it("sin desbordamiento horizontal a 320/375/1280", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(source.includes("break-words"), "atribución y textos con wrap");
    assert.ok(source.includes("max-w-6xl"), "ancho máximo acotado");
    assert.ok(source.includes("w-full"), "ancho fluido");
    assert.ok(!source.includes("whitespace-nowrap"));
  });
});
