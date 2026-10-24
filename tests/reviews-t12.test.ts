// Spec 004 T12 — Quitar accesibilidad de Google manteniendo recorte.
// RF-2, RF-5, RF-14. RNF-7. Tests primero (rojo): parseo sin
// accesibilidad (dirección, teléfono, editorial y nombre si difiere;
// sin horario, sin coords, sin precio, sin web, sin servicios y sin
// accesibilidad), máscara sin opciones de accesibilidad, saneado que
// conserva el recorte y elimina accesibilidad con internos, y sección
// con avatar/fotos y estrellas T10 intactas sin bloque de accesibilidad.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  parsePlaceDetails,
  sanitizeForClient,
} from "@/common/utils/reviews-content";

// Fixture con forma de Places API New que incluye opciones de
// accesibilidad que el recorte T12 debe ignorar por completo.
const NO_ACCESSIBILITY_FIXTURE = {
  name: "places/ChIJ-test-resource-1212",
  id: "ChIJ-test-place-id-1212",
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
  ],
  formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
  internationalPhoneNumber: "+34 958 111 222",
  editorialSummary: { text: "Sushi fresco en el norte de Granada." },
  accessibilityOptions: {
    wheelchairAccessibleEntrance: true,
  },
  googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=12121" },
  googleMapsUri: "https://maps.google.com/?cid=12121",
};

describe("reviews-t12: parseo sin accesibilidad (RF-5)", () => {
  it("conserva dirección, teléfono, editorial y nombre si difiere", () => {
    const parsed = parsePlaceDetails(NO_ACCESSIBILITY_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.address, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(parsed.phone, "+34 958 111 222");
    assert.equal(
      parsed.editorialSummary,
      "Sushi fresco en el norte de Granada.",
    );
    assert.equal(parsed.placeName, "Otro nombre distinto");
  });

  it("no expone accesibilidad ni horario, coords, precio, web o servicios", () => {
    const parsed = parsePlaceDetails(NO_ACCESSIBILITY_FIXTURE);
    assert.ok(parsed !== null);
    const record = parsed as unknown as Record<string, unknown>;
    for (const banned of [
      "accessibility",
      "hours",
      "weeklyHours",
      "coordinates",
      "priceLevel",
      "website",
      "services",
    ]) {
      assert.ok(!(banned in record), `sin ${banned}`);
    }
  });

  it("mantiene avatar y fotos por reseña", () => {
    const parsed = parsePlaceDetails(NO_ACCESSIBILITY_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(
      parsed.reviews[0].authorAvatarUrl,
      "https://example.com/avatar-ana.jpg",
    );
    assert.equal(parsed.reviews[0].reviewPhotos.length, 1);
  });
});

describe("reviews-t12: saneado sin accesibilidad (RF-2, RF-14)", () => {
  it("conserva el recorte y elimina accesibilidad con Place ID, recurso, clave y coords", () => {
    const parsed = parsePlaceDetails(NO_ACCESSIBILITY_FIXTURE);
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
    assert.equal(
      view.reviews[0].authorAvatarUrl,
      "https://example.com/avatar-ana.jpg",
    );
    assert.equal(view.reviews[0].reviewPhotos.length, 1);
    const record = view as unknown as Record<string, unknown>;
    assert.ok(!("accessibility" in record), "la vista no incluye accesibilidad");
    const serialized = JSON.stringify(view);
    assert.ok(!serialized.includes("ChIJ-test-place-id-1212"));
    assert.ok(!serialized.includes("places/"));
    assert.ok(!serialized.includes("37.1975"), "sin coordenadas");
    assert.ok(
      !serialized.includes("Entrada adaptada"),
      "sin opciones de accesibilidad",
    );
  });
});

describe("reviews-t12: FieldMask sin accesibilidad (servidor, RF-5)", () => {
  it("pide el recorte sin opciones de accesibilidad", () => {
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
    assert.ok(
      !source.includes("accessibilityOptions"),
      "FieldMask sin accessibilityOptions",
    );
    assert.ok(!source.includes("BACKEND_URL"));
    assert.ok(!source.includes("NEXT_PUBLIC"));
  });
});

describe("reviews-t12: sección sin accesibilidad (RF-5, RNF-7)", () => {
  it("lista dirección, teléfono y editorial sin accesibilidad, con avatar/fotos y estrellas intactas", () => {
    const source = readFileSync(
      "common/components/ui/location/ReviewsSection.tsx",
      "utf8",
    );
    for (const field of [
      "view.contrastAddress",
      "view.contactPhone",
      "view.editorialSummary",
    ]) {
      assert.ok(source.includes(field), `la sección muestra ${field}`);
    }
    assert.ok(
      !source.includes("view.accessibility"),
      "la sección no muestra accesibilidad",
    );
    assert.ok(
      !source.includes("accessibilityOptions"),
      "la sección no conoce opciones de accesibilidad",
    );
    assert.ok(source.includes("authorAvatarUrl"), "avatar intacto");
    assert.ok(source.includes("reviewPhotos"), "fotos por reseña intactas");
    assert.ok(source.includes("view.ratingValue"), "estrellas T10 intactas");
    assert.ok(source.includes("view.ratingText"), "literal intacto");
    assert.ok(source.includes("break-words"), "sin desbordamiento a 320 px");
    assert.ok(!source.includes("whitespace-nowrap"));
  });
});
