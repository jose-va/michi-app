// Spec 004 T11 — Recorte + avatar y fotos por reseña.
// RF-2, RF-4, RF-5, RF-14. RNF-7. AJUSTE T12: la accesibilidad queda fuera
// del recorte (ni parseo, ni saneado, ni FieldMask, ni sección). Tests
// primero (rojo): parseo recortado
// (dirección, teléfono, editorial y nombre si difiere; sin horario, sin
// coords, sin precio, sin web, sin servicios y sin accesibilidad), avatar y fotos
// por reseña con omisión limpia, saneado sin internos ni campos fuera del
// recorte, FieldMask recortada y sección con avatar/fotos y estrellas T10
// intactas.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  parsePlaceDetails,
  sanitizeForClient,
} from "@/common/utils/reviews-content";

// Fixture recortada con forma de Places API New: incluye avatar del autor
// (authorAttribution.photoUri), fotos adjuntas a la reseña (review.photos)
// y todos los campos que el recorte debe ignorar (horarios, coordenadas,
// precio, web, servicios).
const TRIMMED_FIXTURE = {
  name: "places/ChIJ-test-resource-7777",
  id: "ChIJ-test-place-id-7777",
  displayName: { text: "Otro nombre distinto" },
  rating: 4.6,
  userRatingCount: 123,
  generativeSummary: {
    overview: { text: "Los clientes destacan el sushi fresco." },
  },
  reviews: [
    {
      authorAttribution: {
        displayName: "Ana G.",
        photoUri: "https://example.com/avatar-ana.jpg",
      },
      rating: 5,
      relativePublishTimeDescription: "hace 2 semanas",
      text: { text: "El mejor sushi de Granada." },
      photos: [
        {
          url: "https://example.com/resena-ana-1.jpg",
          attribution: "Foto de Ana G.",
        },
      ],
    },
    {
      authorAttribution: { displayName: "Bruno M." },
      rating: 4,
      relativePublishTimeDescription: "hace 1 mes",
      text: { text: "Muy rico todo." },
    },
  ],
  formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
  regularOpeningHours: {
    weekdayDescriptions: ["lunes: 13:00–16:00"],
  },
  currentOpeningHours: {
    weekdayDescriptions: ["lunes: 13:00–16:00"],
  },
  currentOpeningHoursText: "Abierto ahora",
  location: { latitude: 37.1975, longitude: -3.6019 },
  internationalPhoneNumber: "+34 958 111 222",
  priceLevel: "PRICE_LEVEL_MODERATE",
  websiteUri: "https://ejemplo-restaurante.es",
  editorialSummary: { text: "Sushi fresco en el norte de Granada." },
  takeout: true,
  dineIn: true,
  delivery: true,
  reservable: true,
  servesVegetarianFood: true,
  accessibilityOptions: {
    wheelchairAccessibleEntrance: true,
  },
  googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=77777" },
  googleMapsUri: "https://maps.google.com/?cid=77777",
};

describe("reviews-t11: parseo recortado (RF-5)", () => {
  it("conserva dirección, teléfono, editorial y nombre si difiere", () => {
    const parsed = parsePlaceDetails(TRIMMED_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.address, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(parsed.phone, "+34 958 111 222");
    assert.equal(
      parsed.editorialSummary,
      "Sushi fresco en el norte de Granada.",
    );
    assert.equal(parsed.placeName, "Otro nombre distinto");
  });

  it("no expone accesibilidad, horario, coordenadas, precio, web ni servicios", () => {
    const parsed = parsePlaceDetails(TRIMMED_FIXTURE);
    assert.ok(parsed !== null);
    const record = parsed as unknown as Record<string, unknown>;
    assert.ok(!("accessibility" in record), "sin accesibilidad");
    assert.ok(!("hours" in record), "sin horario actual");
    assert.ok(!("weeklyHours" in record), "sin horario semanal");
    assert.ok(!("coordinates" in record), "sin coordenadas");
    assert.ok(!("priceLevel" in record), "sin precio");
    assert.ok(!("website" in record), "sin web");
    assert.ok(!("services" in record), "sin servicios");
  });
});

describe("reviews-t11: avatar y fotos por reseña (RF-4)", () => {
  it("extrae avatar del autor y fotos adjuntas cuando Google las devuelve", () => {
    const parsed = parsePlaceDetails(TRIMMED_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.reviews.length, 2);
    assert.equal(
      parsed.reviews[0].authorAvatarUrl,
      "https://example.com/avatar-ana.jpg",
    );
    assert.equal(parsed.reviews[0].reviewPhotos.length, 1);
    assert.equal(
      parsed.reviews[0].reviewPhotos[0].url,
      "https://example.com/resena-ana-1.jpg",
    );
  });

  it("avatar y fotos ausentes se representan como nulo/vacío (omisión limpia)", () => {
    const parsed = parsePlaceDetails(TRIMMED_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.reviews[1].authorAvatarUrl, null);
    assert.deepEqual(parsed.reviews[1].reviewPhotos, []);
  });
});

describe("reviews-t11: saneado recortado (RF-2, RF-14)", () => {
  it("conserva solo el recorte y elimina Place ID, recurso, clave, coords, horario, precio, web, servicios y accesibilidad", () => {
    const parsed = parsePlaceDetails(TRIMMED_FIXTURE);
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    assert.equal(view.contrastAddress, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(view.contactPhone, "+34 958 111 222");
    assert.equal(
      view.editorialSummary,
      "Sushi fresco en el norte de Granada.",
    );
    assert.equal(view.contrastName, "Otro nombre distinto");
    // Avatar y fotos viajan en cada reseña.
    assert.equal(
      view.reviews[0].authorAvatarUrl,
      "https://example.com/avatar-ana.jpg",
    );
    assert.equal(view.reviews[0].reviewPhotos.length, 1);
    assert.equal(view.reviews[1].authorAvatarUrl, null);
    assert.deepEqual(view.reviews[1].reviewPhotos, []);
    const serialized = JSON.stringify(view);
    assert.ok(!serialized.includes("ChIJ-test-place-id-7777"));
    assert.ok(!serialized.includes("places/"));
    assert.ok(!serialized.includes("GOOGLE_"));
    assert.ok(!serialized.includes("X-Goog-Api-Key"));
    assert.ok(!serialized.includes("37.1975"), "sin coordenadas");
    assert.ok(!serialized.includes("Abierto ahora"), "sin horario");
    assert.ok(!serialized.includes("ejemplo-restaurante.es"), "sin web");
    assert.ok(!serialized.includes("Recogida"), "sin servicios");
    assert.ok(!serialized.includes("Precio"), "sin precio");
    const record = view as unknown as Record<string, unknown>;
    for (const banned of [
      "contrastHours",
      "weeklyHours",
      "readableCoords",
      "priceLevel",
      "website",
      "services",
      "accessibility",
    ]) {
      assert.ok(!(banned in record), `la vista no incluye ${banned}`);
    }
  });
});

describe("reviews-t11: FieldMask recortada (servidor, RF-5)", () => {
  it("pide avatar/fotos de reseña y útiles del recorte sin horario, coords, precio, web, servicios ni accesibilidad", () => {
    const source = readFileSync(
      "service/ReviewsEnrichmentService.ts",
      "utf8",
    );
    for (const field of [
      "reviews",
      "formattedAddress",
      "internationalPhoneNumber",
      "editorialSummary",
      "displayName",
    ]) {
      assert.ok(source.includes(field), `FieldMask incluye ${field}`);
    }
    for (const banned of [
      "regularOpeningHours",
      "currentOpeningHours",
      '"location"',
      "priceLevel",
      "websiteUri",
      "takeout",
      "dineIn",
      "delivery",
      "reservable",
      "servesVegetarianFood",
      "accessibilityOptions",
    ]) {
      assert.ok(!source.includes(banned), `FieldMask sin ${banned}`);
    }
    assert.ok(!source.includes("BACKEND_URL"));
    assert.ok(!source.includes("NEXT_PUBLIC"));
  });
});

describe("reviews-t11: sección con avatar y fotos (RF-4, RNF-7)", () => {
  const SECTION = "common/components/ui/location/ReviewsSection.tsx";
  const MEDIA = "common/components/ui/location/ReviewsReviewMedia.tsx";

  it("cada reseña muestra avatar y fotos con alternativos accesibles y omisión limpia", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      source.includes("authorAvatarUrl"),
      "la sección muestra el avatar del autor",
    );
    assert.ok(
      source.includes("reviewPhotos"),
      "la sección muestra las fotos adjuntas a la reseña",
    );
    const media = (() => {
      try {
        return readFileSync(MEDIA, "utf8");
      } catch {
        return source;
      }
    })();
    assert.ok(
      media.includes("alt="),
      "avatar y fotos con texto alternativo accesible",
    );
    assert.ok(
      media.includes("onError") || source.includes("onError"),
      "fallo de carga de avatar/foto se omite sin huecos",
    );
    assert.ok(
      source.includes("break-words"),
      "ajuste de línea sin desbordamiento a 320 px",
    );
    assert.ok(
      !source.includes("whitespace-nowrap"),
      "sin nowrap que rompa 320 px",
    );
    assert.ok(
      !source.includes("contrastHours") &&
        !source.includes("weeklyHours") &&
        !source.includes("readableCoords") &&
        !source.includes("priceLevel") &&
        !source.includes("view.website") &&
        !source.includes("view.services") &&
        !source.includes("view.accessibility"),
      "la sección no muestra horario, coords, precio, web, servicios ni accesibilidad",
    );
  });

  it("las 5 estrellas globales de T10 quedan intactas sin mover ni cambiar color", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(source.includes("view.ratingValue"));
    assert.ok(source.includes("view.ratingText"));
    assert.ok(source.includes('role="img"'));
    assert.ok(source.includes("aria-hidden"));
    assert.ok(
      source.includes("text-white") || source.includes("text-zinc-100"),
      "estrellas en tono claro intacto (≥4,5:1)",
    );
  });
});
