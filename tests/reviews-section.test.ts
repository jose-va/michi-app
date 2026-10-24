// Spec 004 T5 — Componente presentacional ReviewsSection (RF-4, RF-6, RF-7, RF-13, RNF-7).
// Como es UI presentacional pura, la cobertura con `npm test` es
// verificación estática de la fuente: literales, accesibilidad,
// omisión con null y marca 003 intacta. El resto (navegador) va en T8.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const PATH = "common/components/ui/location/ReviewsSection.tsx";
const SOURCE = readFileSync(PATH, "utf8");

describe("ReviewsSection: contrato presentacional (RF-4, RF-10)", () => {
  it("expone ReviewsSection con prop view y con null no renderiza nada", () => {
    assert.ok(
      SOURCE.includes("ReviewsSection"),
      "el componente debe llamarse ReviewsSection",
    );
    assert.ok(
      SOURCE.includes("view: PublicView | null"),
      "la prop debe ser { view: PublicView | null }",
    );
    assert.ok(
      SOURCE.includes("view === null") && SOURCE.includes("return null"),
      "con view null debe devolver null (omisión limpia)",
    );
  });

  it("respeta el tope de 5 reseñas en el orden recibido (sin reordenar)", () => {
    assert.ok(
      SOURCE.includes(".slice(0, 5)"),
      "debe limitar a 5 reseñas con slice(0, 5)",
    );
    assert.ok(
      !SOURCE.includes(".sort("),
      "prohibido reordenar: el orden es el devuelto por Google",
    );
  });

  it("es Server Component sin red ni secretos", () => {
    assert.ok(!SOURCE.includes('"use client"'));
    assert.ok(!SOURCE.includes("'use client'"));
    assert.ok(!SOURCE.includes("fetch("), "presentacional puro: sin fetch");
    assert.ok(!SOURCE.includes("BACKEND_URL"));
    assert.ok(!SOURCE.includes("NEXT_PUBLIC"));
  });
});

describe("ReviewsSection: literales fijos (RF-4, RF-5, RF-6, RF-7)", () => {
  it("título literal «Opiniones de Google»", () => {
    assert.ok(SOURCE.includes("Opiniones de Google"));
  });

  it("enlace literal «Ver reseñas en Google Maps» solo con la URL pública devuelta", () => {
    assert.ok(SOURCE.includes("Ver reseñas en Google Maps"));
    assert.ok(
      SOURCE.includes("href={view.reviewsUrl}"),
      "el único enlace usa la URL pública devuelta",
    );
    assert.ok(
      !SOURCE.includes("getPlaceUrl") && !SOURCE.includes("getDirectionsUrl"),
      "prohibido construir enlaces propios dentro de la sección",
    );
  });

  it("etiqueta de contraste «Datos de Google» desde la vista", () => {
    assert.ok(SOURCE.includes("view.contrastLabel"));
  });

  it("foto con alt literal «Foto del local en Google Maps»", () => {
    // T6: la foto se delega al Client hijo ReviewsCoverPhoto (fallback
    // onError); el alt literal vive en el hijo y el HTML renderizado lo
    // conserva. La sección aporta el src condicional.
    const cover = readFileSync(
      "common/components/ui/location/ReviewsCoverPhoto.tsx",
      "utf8",
    );
    assert.ok(
      cover.includes('alt="Foto del local en Google Maps"'),
      "el hijo de foto conserva el alt literal de RF-6",
    );
    assert.ok(SOURCE.includes("view.coverPhotoUrl"));
    assert.ok(SOURCE.includes("ReviewsCoverPhoto"));
  });

  it("atribuciones visibles: pie Google Maps, resumen, foto y autores", () => {
    assert.ok(
      SOURCE.includes("view.attribution"),
      "pie con atribución a Google Maps",
    );
    assert.ok(
      SOURCE.includes("view.summaryAttribution"),
      "atribución del resumen junto al resumen",
    );
    assert.ok(
      SOURCE.includes("view.coverPhotoAttribution"),
      "atribución de la foto junto a la foto",
    );
    assert.ok(
      SOURCE.includes("review.author"),
      "atribución de cada autor junto a su reseña",
    );
  });

  it("nunca muestra internos no mostrables (RF-14, T11)", () => {
    // Recorte T11: teléfono visible como parte de RF-5; Place ID, recurso,
    // clave, coordenadas, horario, precio, web y servicios nunca salen.
    for (const banned of [
      "placeId",
      "resourceName",
      "GOOGLE_",
      "X-Goog-Api-Key",
      "X-Goog-FieldMask",
      "readableCoords",
      "contrastHours",
      "weeklyHours",
      "priceLevel",
      "website",
      "services",
    ]) {
      assert.ok(
        !SOURCE.includes(banned),
        `la sección no debe mencionar ${banned}`,
      );
    }
    assert.ok(
      SOURCE.includes("view.contactPhone"),
      "el teléfono visible de RF-5 se muestra",
    );
    assert.ok(
      !SOURCE.includes("view.readableCoords"),
      "las coordenadas ya no se muestran (recorte T11)",
    );
  });
});

describe("ReviewsSection: accesibilidad (RNF-7)", () => {
  it("título con nombre accesible", () => {
    assert.ok(SOURCE.includes("<h2"));
    assert.ok(SOURCE.includes("aria-labelledby"));
  });

  it("estrellas con etiqueta accesible de puntuación", () => {
    assert.ok(SOURCE.includes('role="img"'));
    assert.ok(SOURCE.includes("aria-label"));
    assert.ok(SOURCE.includes("de 5 estrellas"));
  });

  it("enlace operable por teclado con aviso accesible de pestaña nueva", () => {
    assert.ok(SOURCE.includes("<a"));
    assert.ok(SOURCE.includes('target="_blank"'));
    assert.ok(SOURCE.includes('rel="noopener noreferrer"'));
    assert.ok(SOURCE.includes("sr-only"));
    assert.ok(SOURCE.includes("se abre en una pestaña nueva"));
  });

  it("foto con alt y atribución con salto de línea sin truncar (RNF-8)", () => {
    assert.ok(SOURCE.includes("break-words"));
    assert.ok(!SOURCE.includes("truncate"));
    assert.ok(!SOURCE.includes("line-clamp"));
  });
});

describe("ReviewsSection: marca 003 intacta (RF-13)", () => {
  it("no toca h1 ni cabecera de la 003", () => {
    assert.ok(!SOURCE.includes("<h1"), "la sección no debe tener h1");
    assert.ok(
      !SOURCE.includes("Michi Sushi Bar"),
      "la marca 003 no se repite en la sección",
    );
    assert.ok(
      !SOURCE.includes("Estamos en Granada"),
      "la cabecera 003 queda intacta",
    );
  });
});

// Spec 004 T6 — Contraste «Datos de Google» y foto con fallback (RF-5, RF-6, RF-7).
describe("ReviewsSection: contraste y foto con fallback (T6, RF-5, RF-6, RF-7)", () => {
  it("muestra dirección tal cual bajo «Datos de Google» sin sustituir la 003 (recorte T11: sin horario)", () => {
    assert.ok(
      SOURCE.includes("view.contrastLabel"),
      "bloque etiquetado con view.contrastLabel («Datos de Google»)",
    );
    assert.ok(
      SOURCE.includes("view.contrastAddress"),
      "dirección de contraste tal cual",
    );
    assert.ok(
      !SOURCE.includes("view.contrastHours") &&
        !SOURCE.includes("view.weeklyHours"),
      "recorte T11: sin horario de Google en la sección",
    );
    for (const transform of [".toUpperCase(", ".toLowerCase(", ".trim()"]) {
      assert.ok(
        !SOURCE.includes(`contrastAddress${transform}`),
        `el contraste se muestra tal cual, sin ${transform}`,
      );
    }
    // El bloque de contraste es condicional por campos: lo ausente se omite
    // sin huecos (cada campo tras su propio !== null).
    assert.ok(SOURCE.includes("contrastAddress !== null"));
    assert.ok(SOURCE.includes("contactPhone !== null"));
    // Orden estable: reseñas → contraste → foto → enlace → atribución.
    const reviewsAt = SOURCE.indexOf("view.reviews");
    const contrastAt = SOURCE.indexOf("view.contrastLabel");
    const photoAt = SOURCE.indexOf("coverPhoto");
    const linkAt = SOURCE.indexOf("Ver reseñas en Google Maps");
    assert.ok(
      reviewsAt !== -1 &&
        contrastAt > reviewsAt &&
        photoAt > contrastAt &&
        linkAt > photoAt,
      "el orden reseñas → contraste → foto → enlace se mantiene",
    );
  });

  it("foto con fallback onError: sin foto o con error no deja huecos ni cambia el orden", () => {
    // Sin foto no se renderiza nada (bloque condicional por coverPhotoUrl).
    assert.ok(
      SOURCE.includes("view.coverPhotoUrl !== null"),
      "sin foto la sección no reserva hueco",
    );
    // Con error de carga la foto se omite vía onError en el Client hijo.
    const coverPath =
      "common/components/ui/location/ReviewsCoverPhoto.tsx";
    const cover = readFileSync(coverPath, "utf8");
    assert.ok(
      SOURCE.includes("ReviewsCoverPhoto"),
      "la sección delega la foto al Client hijo con fallback",
    );
    assert.ok(
      cover.includes("onError"),
      "la foto se oculta con onError si falla la carga",
    );
    assert.ok(
      cover.includes("return null"),
      "con error de carga no deja hueco roto",
    );
    assert.ok(
      cover.includes('alt="Foto del local en Google Maps"'),
      "el fallback conserva el alt literal de RF-6",
    );
  });

  it("atribución con wrap sin truncar (RF-7, RNF-8)", () => {
    const cover = readFileSync(
      "common/components/ui/location/ReviewsCoverPhoto.tsx",
      "utf8",
    );
    for (const [name, src] of [
      ["ReviewsSection", SOURCE],
      ["ReviewsCoverPhoto", cover],
    ] as const) {
      assert.ok(
        src.includes("break-words"),
        `${name}: la atribución usa wrap con break-words`,
      );
      for (const banned of [
        "truncate",
        "line-clamp",
        "text-ellipsis",
        "whitespace-nowrap",
        "overflow-hidden",
      ]) {
        assert.ok(
          !src.includes(banned),
          `${name}: prohibido ${banned} en la atribución`,
        );
      }
    }
  });
});
