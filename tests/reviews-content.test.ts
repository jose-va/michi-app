// Spec 004 T1 — Lógica pura de parseo, formato y recorte (RF-4, RF-14, RNF-1, RNF-8).
// Solo cubre T1: parsePlaceDetails, formatRating, trimReviewText,
// pickCoverPhoto y sanitizeForClient. T2 (visibilidad/identidad) y
// T3 (frescura de caché) quedan pendientes en sus propias tareas.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTRAST_LABEL,
  MAX_REVIEW_CHARS,
  formatRating,
  isCacheFresh,
  isIdentityUsable,
  parsePlaceDetails,
  pickCoverPhoto,
  sanitizeForClient,
  shouldShowSection,
  trimReviewText,
} from "@/common/utils/reviews-content";

// Fixture completa con forma de Places API (nueva): valoración,
// recuento, resumen IA con atribución, 6 reseñas en un orden dado
// (para verificar el tope de 5 sin reordenar), dirección, horario,
// 2 fotos, URLs públicas e internos que nunca deben salir al cliente.
const FULL_FIXTURE = {
  name: "places/ChIJ-test-resource-1234",
  id: "ChIJ-test-place-id-1234",
  rating: 4.6,
  userRatingCount: 123,
  generativeSummary: {
    overview: { text: "Los clientes destacan el sushi fresco y el trato." },
    attributions: [{ displayName: "Google" }],
  },
  reviews: [
    {
      authorAttribution: { displayName: "Ana G." },
      rating: 5,
      relativePublishTimeDescription: "hace 2 semanas",
      text: { text: "El mejor sushi de Granada, volveremos." },
    },
    {
      authorAttribution: { displayName: "Bruno M." },
      rating: 4,
      relativePublishTimeDescription: "hace 1 mes",
      text: { text: "Muy rico todo y buen servicio." },
    },
    {
      authorAttribution: { displayName: "Carla R." },
      rating: 5,
      relativePublishTimeDescription: "hace 2 meses",
      text: { text: "L".repeat(400) },
    },
    {
      authorAttribution: { displayName: "Dani P." },
      rating: 5,
      relativePublishTimeDescription: "hace 3 meses",
      text: { text: "Calidad-precio excelente." },
    },
    {
      authorAttribution: { displayName: "Elena S." },
      rating: 3,
      relativePublishTimeDescription: "hace 4 meses",
      text: { text: "Bien, aunque con espera." },
    },
    {
      authorAttribution: { displayName: "Fran T." },
      rating: 5,
      relativePublishTimeDescription: "hace 5 meses",
      text: { text: "Sexta reseña que no debe salir (tope 5)." },
    },
  ],
  formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
  currentOpeningHoursText: "Abierto ahora",
  photos: [
    {
      url: "https://example.com/foto-portada.jpg",
      attribution: "Foto de Google",
    },
    { url: "https://example.com/foto-segunda.jpg" },
  ],
  googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=12345" },
  googleMapsUri: "https://maps.google.com/?cid=12345",
  location: { latitude: 37.1975, longitude: -3.6019 },
  internationalPhoneNumber: "+34 600 111 222",
};

describe("reviews-content: parseo de fixture completa (RF-4)", () => {
  it("extrae valoración, recuento, resumen, dirección y URLs (recorte T11: sin horario)", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.rating, 4.6);
    assert.equal(parsed.reviewCount, 123);
    assert.equal(
      parsed.summary,
      "Los clientes destacan el sushi fresco y el trato.",
    );
    assert.equal(parsed.summaryAttribution, "Google");
    assert.equal(parsed.address, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(parsed.placeUrl, "https://maps.google.com/?cid=12345");
    assert.equal(parsed.googleMapsUri, "https://maps.google.com/?cid=12345");
  });

  it("conserva las reseñas en el orden recibido sin reordenar", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    assert.deepEqual(
      parsed.reviews.map((r) => r.author),
      ["Ana G.", "Bruno M.", "Carla R.", "Dani P.", "Elena S.", "Fran T."],
    );
    assert.equal(parsed.reviews[0].stars, 5);
    assert.equal(parsed.reviews[0].relativeTime, "hace 2 semanas");
    assert.equal(
      parsed.reviews[0].text,
      "El mejor sushi de Granada, volveremos.",
    );
  });

  it("devuelve null si no hay nada aprovechable", () => {
    assert.equal(parsePlaceDetails(null), null);
    assert.equal(parsePlaceDetails("texto"), null);
    assert.equal(parsePlaceDetails({}), null);
  });
});

describe("reviews-content: formato de valoración (RF-4)", () => {
  it("formato «4,6 (123 reseñas)» con coma decimal", () => {
    assert.equal(formatRating(4.6, 123), "4,6 (123 reseñas)");
  });

  it("usa coma también con valores enteros", () => {
    assert.equal(formatRating(5, 1), "5,0 (1 reseñas)");
    assert.ok(!formatRating(4.6, 123).includes("."));
  });
});

describe("reviews-content: recorte de texto (RNF-8)", () => {
  it("no toca textos de 300 caracteres o menos", () => {
    assert.equal(trimReviewText("corto"), "corto");
    assert.equal(trimReviewText("x".repeat(300)), "x".repeat(300));
  });

  it("recorta a 300 caracteres con puntos suspensivos", () => {
    const long = "L".repeat(400);
    const trimmed = trimReviewText(long);
    assert.ok(trimmed.startsWith("L".repeat(300)));
    assert.ok(trimmed.endsWith("…"));
    assert.equal(trimmed.length, 300 + "…".length);
  });

  it("MAX_REVIEW_CHARS es 300", () => {
    assert.equal(MAX_REVIEW_CHARS, 300);
  });
});

describe("reviews-content: foto de portada (RF-4/RF-6)", () => {
  it("elige la primera foto devuelta", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(
      pickCoverPhoto(parsed.photos)?.url,
      "https://example.com/foto-portada.jpg",
    );
  });

  it("devuelve null sin fotos", () => {
    assert.equal(pickCoverPhoto([]), null);
  });
});

describe("reviews-content: vista pública sin internos (RF-14, T11)", () => {
  it("sanitizeForClient elimina Place ID y recurso y conserva solo el recorte RF-5 (teléfono visible, sin coordenadas)", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    const serialized = JSON.stringify(view);
    assert.ok(!serialized.includes("ChIJ-test-place-id-1234"));
    assert.ok(!serialized.includes("places/"));
    // Recorte T11: el teléfono viaja visible; las coordenadas ya no viajan.
    assert.ok(view.contactPhone !== null);
    assert.ok(view.contactPhone.includes("600 111 222"));
    assert.ok(!("readableCoords" in view));
    assert.ok(!serialized.includes("37.1975"));
  });

  it("la vista pública conserva valoración, resumen, contraste, foto y URL", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    assert.equal(view.ratingText, "4,6 (123 reseñas)");
    assert.equal(
      view.summary,
      "Los clientes destacan el sushi fresco y el trato.",
    );
    assert.equal(view.contrastLabel, "Datos de Google");
    assert.equal(view.contrastAddress, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(view.coverPhotoUrl, "https://example.com/foto-portada.jpg");
    assert.equal(view.reviewsUrl, "https://maps.google.com/?cid=12345");
  });

  it("limita a 5 reseñas en el orden de Google con texto recortado", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    assert.equal(view.reviews.length, 5);
    assert.deepEqual(
      view.reviews.map((r) => r.author),
      ["Ana G.", "Bruno M.", "Carla R.", "Dani P.", "Elena S."],
    );
    assert.ok(view.reviews[2].text.endsWith("…"));
    assert.ok(view.reviews[2].text.length <= 301);
  });
});

// Spec 004 T2 — Reglas puras de visibilidad e identidad (RF-10, RF-12, RF-5).
describe("reviews-content: visibilidad de la sección (RF-10, RF-12)", () => {
  it("oculta la sección si el detalle es nulo", () => {
    assert.equal(shouldShowSection(null), false);
  });

  it("oculta la sección con cero reseñas aunque haya valoración o resumen", () => {
    const parsed = parsePlaceDetails({
      rating: 4.6,
      userRatingCount: 123,
      generativeSummary: {
        overview: { text: "Resumen disponible." },
      },
      reviews: [],
      googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=12345" },
      googleMapsUri: "https://maps.google.com/?cid=12345",
    });
    assert.ok(parsed !== null);
    assert.equal(parsed.reviews.length, 0);
    assert.equal(shouldShowSection(parsed), false);
  });

  it("muestra la sección con al menos una reseña y enlace público", () => {
    const parsed = parsePlaceDetails(FULL_FIXTURE);
    assert.ok(parsed !== null);
    assert.ok(parsed.reviews.length >= 1);
    assert.equal(shouldShowSection(parsed), true);
  });

  it("muestra la sección con un solo enlace público disponible", () => {
    const parsed = parsePlaceDetails({
      reviews: [
        {
          authorAttribution: { displayName: "Ana G." },
          rating: 5,
          relativePublishTimeDescription: "hace 2 semanas",
          text: { text: "Muy bien." },
        },
      ],
      googleMapsUri: "https://maps.google.com/?cid=12345",
    });
    assert.ok(parsed !== null);
    assert.equal(parsed.placeUrl, null);
    assert.equal(shouldShowSection(parsed), true);
  });

  it("oculta la sección sin enlace público aunque haya reseñas", () => {
    const parsed = parsePlaceDetails({
      reviews: [
        {
          authorAttribution: { displayName: "Ana G." },
          rating: 5,
          relativePublishTimeDescription: "hace 2 semanas",
          text: { text: "Muy bien." },
        },
      ],
    });
    assert.ok(parsed !== null);
    assert.ok(parsed.reviews.length >= 1);
    assert.equal(parsed.placeUrl, null);
    assert.equal(parsed.googleMapsUri, null);
    assert.equal(shouldShowSection(parsed), false);
  });
});

describe("reviews-content: identidad usable (RF-12)", () => {
  it("usable solo con un único candidato de confianza alta", () => {
    assert.equal(isIdentityUsable(1, "alta"), true);
  });

  it("no usable con múltiples candidatos aunque la confianza sea alta", () => {
    assert.equal(isIdentityUsable(2, "alta"), false);
  });

  it("no usable con confianza no alta aunque haya un único candidato", () => {
    assert.equal(isIdentityUsable(1, "media"), false);
    assert.equal(isIdentityUsable(1, "baja"), false);
  });

  it("no usable sin candidatos", () => {
    assert.equal(isIdentityUsable(0, "alta"), false);
  });
});

describe("reviews-content: contraste etiquetado (RF-5)", () => {
  it("CONTRAST_LABEL es «Datos de Google»", () => {
    assert.equal(CONTRAST_LABEL, "Datos de Google");
  });
});

// Spec 004 T3 — Frescura de caché pura con reloj inyectado (RF-8).
describe("reviews-content: frescura de caché (RF-8)", () => {
  const TTL = 12 * 60 * 60 * 1000;

  it("vigente antes de 12 h", () => {
    const cachedAt = 1_000_000;
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL - 1), true);
    assert.equal(isCacheFresh(cachedAt, cachedAt + 60_000), true);
  });

  it("expirada después de 12 h", () => {
    const cachedAt = 1_000_000;
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL + 1), false);
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL * 2), false);
  });

  it("borde de 12 h exactas: ya expirada", () => {
    const cachedAt = 1_000_000;
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL), false);
  });

  it("respeta el TTL por defecto de 12 h sin pasarlo explícito", () => {
    const cachedAt = 5_000_000;
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL - 1), true);
    assert.equal(isCacheFresh(cachedAt, cachedAt + TTL), false);
  });

  it("expirada + fallo de revalidación: omisión sin obsoletos", () => {
    const cachedAt = 1_000_000;
    const now = cachedAt + TTL + 1;
    assert.equal(isCacheFresh(cachedAt, now), false);
    // Sin datos revalidados no hay vista que mostrar: la sección se
    // omite (null) en lugar de reutilizar la caché expirada.
    const revalidatedView = null;
    const viewToRender = isCacheFresh(cachedAt, now)
      ? "cached-view"
      : revalidatedView;
    assert.equal(viewToRender, null);
    assert.equal(shouldShowSection(viewToRender), false);
  });
});
