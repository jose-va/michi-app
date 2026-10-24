// Spec 004 T10 — Ampliación datos útiles + estrellas globales visuales.
// RF-2, RF-4, RF-5, RF-14. AJUSTE T11 (recorte aprobado): la ampliación de
// útiles queda revertida a dirección, teléfono, editorial y nombre si
// difiere; sin horario, sin coordenadas, sin precio, sin web, sin
// servicios y sin accesibilidad (T12). Los bloques de este fichero que
// cubrían esos campos verifican ahora su ausencia; las estrellas globales
// y la foto única siguen intactas.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  parsePlaceDetails,
  sanitizeForClient,
  type ParsedPlace,
} from "@/common/utils/reviews-content";

// Fixture con todos los campos útiles de RF-5 con forma de Places API New.
const USEFUL_FIXTURE = {
  name: "places/ChIJ-test-resource-9999",
  id: "ChIJ-test-place-id-9999",
  rating: 4.6,
  userRatingCount: 123,
  reviews: [
    {
      authorAttribution: { displayName: "Ana G." },
      rating: 5,
      relativePublishTimeDescription: "hace 2 semanas",
      text: { text: "Muy bien." },
    },
  ],
  formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
  regularOpeningHours: {
    openNow: true,
    weekdayDescriptions: [
      "lunes: 13:00–16:00, 20:00–23:00",
      "martes: 13:00–16:00, 20:00–23:00",
    ],
  },
  internationalPhoneNumber: "+34 958 111 222",
  location: { latitude: 37.1975, longitude: -3.6019 },
  priceLevel: "PRICE_LEVEL_MODERATE",
  websiteUri: "https://ejemplo-restaurante.es",
  editorialSummary: { text: "Sushi fresco en el norte de Granada." },
  takeout: true,
  dineIn: true,
  delivery: false,
  reservable: true,
  servesVegetarianFood: true,
  accessibilityOptions: {
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: false,
  },
  googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=99999" },
  googleMapsUri: "https://maps.google.com/?cid=99999",
};

describe("reviews-t10: parseo de datos útiles (RF-5, recorte T11+T12)", () => {
  it("extrae teléfono y editorial; ignora accesibilidad, horario, coords, precio, web y servicios", () => {
    const parsed = parsePlaceDetails(USEFUL_FIXTURE);
    assert.ok(parsed !== null);
    assert.equal(parsed.phone, "+34 958 111 222");
    assert.equal(
      parsed.editorialSummary,
      "Sushi fresco en el norte de Granada.",
    );
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
      assert.ok(!(banned in record), `${banned} no se extrae (recorte)`);
    }
  });
});

describe("reviews-t10: saneado recortado (RF-2, RF-14, recorte T11)", () => {
  it("conserva el recorte visible y elimina Place ID/recurso/clave y campos fuera del recorte", () => {
    const parsed = parsePlaceDetails(USEFUL_FIXTURE);
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    assert.ok(
      view.contactPhone !== null && view.contactPhone.includes("958 111 222"),
      "el teléfono viaja visible como parte de RF-5",
    );
    assert.ok(
      view.editorialSummary !== null,
      "editorial viaja a la vista",
    );
    assert.ok(
      view.ratingValue !== null && view.ratingValue === 4.6,
      "el valor numérico viaja para las estrellas globales",
    );
    const serialized = JSON.stringify(view);
    assert.ok(!serialized.includes("ChIJ-test-place-id-9999"));
    assert.ok(!serialized.includes("places/"));
    assert.ok(!serialized.includes("GOOGLE_"));
    assert.ok(!serialized.includes("X-Goog-Api-Key"));
    assert.ok(!serialized.includes("37.1975"), "sin coordenadas");
    assert.ok(!serialized.includes("lunes:"), "sin horario semanal");
    assert.ok(!serialized.includes("ejemplo-restaurante"), "sin web");
    assert.ok(!serialized.includes("Recogida"), "sin servicios");
    assert.ok(!serialized.includes("Precio"), "sin precio");
  });
});

describe("reviews-t10: omisión parcial sin huecos (RF-5, recorte T11)", () => {
  it("cada dato del recorte ausente es nulo sin huecos ni cambios de orden", () => {
    const parsed = parsePlaceDetails({
      rating: 4.6,
      userRatingCount: 123,
      reviews: [
        {
          authorAttribution: { displayName: "Ana G." },
          rating: 5,
          relativePublishTimeDescription: "hace 2 semanas",
          text: { text: "Muy bien." },
        },
      ],
      formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
      googleMapsUri: "https://maps.google.com/?cid=99999",
    });
    assert.ok(parsed !== null);
    const view = sanitizeForClient(parsed);
    assert.ok(view !== null);
    assert.equal(view.contactPhone, null);
    assert.equal(view.editorialSummary, null);
    assert.ok(
      !("accessibility" in (view as unknown as Record<string, unknown>)),
      "la vista no incluye accesibilidad (recorte T12)",
    );
    // Lo presente sigue intacto y en orden.
    assert.equal(view.contrastAddress, "C/ Gutierre Tibón 8, 18011 Granada");
    assert.equal(view.reviews.length, 1);
    assert.equal(view.ratingText, "4,6 (123 reseñas)");
  });

  it("opciones de accesibilidad se ignoran sin huecos (recorte T12)", () => {
    const parsed = parsePlaceDetails({
      ...USEFUL_FIXTURE,
      accessibilityOptions: {},
    });
    assert.ok(parsed !== null);
    assert.ok(
      !("accessibility" in (parsed as unknown as Record<string, unknown>)),
    );
  });
});

describe("reviews-t10: estrellas globales visuales (RF-4, RNF-7)", () => {
  const SECTION = "common/components/ui/location/ReviewsSection.tsx";

  it("la sección muestra 5 estrellas globales con etiqueta accesible junto al literal intacto", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      source.includes("view.ratingValue"),
      "usa el valor numérico para las estrellas globales",
    );
    assert.ok(
      source.includes("view.ratingText"),
      "el literal de valoración queda intacto junto a las estrellas",
    );
    // Estrellas solo visuales: ocultas a lectores salvo la etiqueta global.
    const globalStars = source.indexOf("view.ratingValue");
    const imgRoles = [...source.matchAll(/role="img"/g)].map((m) => m.index);
    assert.ok(
      imgRoles.some((i) => i !== undefined && i > globalStars - 2000),
      "las estrellas globales tienen role img con etiqueta accesible",
    );
    assert.ok(source.includes("aria-hidden"));
  });

  it("las estrellas globales mantienen contraste ≥ 4,5:1 (texto claro sobre fondo oscuro)", () => {
    const source = readFileSync(SECTION, "utf8");
    assert.ok(
      source.includes("text-white") || source.includes("text-zinc-100"),
      "estrellas en tono claro sobre fondo oscuro",
    );
    assert.ok(
      !source.includes("text-zinc-400") ||
        source.includes("text-white"),
      "el bloque de valoración usa tono de alto contraste",
    );
  });
});

describe("reviews-t10: bloque de contraste recortado (RF-5, recorte T11+T12)", () => {
  it("la sección lista dirección, teléfono y editorial bajo «Datos de Google» con ajuste de línea", () => {
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
    for (const banned of [
      "view.weeklyHours",
      "view.contrastHours",
      "view.readableCoords",
      "view.priceLevel",
      "view.website",
      "view.services",
      "view.accessibility",
    ]) {
      assert.ok(!source.includes(banned), `la sección no muestra ${banned}`);
    }
    // Condicionales por campo: lo ausente se omite sin huecos.
    assert.ok(source.includes("view.contactPhone !== null"));
    // Sin desbordamiento a 320: ajuste de línea, sin nowrap ni anchos fijos.
    assert.ok(source.includes("break-words"));
    assert.ok(!source.includes("whitespace-nowrap"));
  });

  it("la foto sigue limitada a una sola portada", () => {
    const source = readFileSync(
      "common/components/ui/location/ReviewsSection.tsx",
      "utf8",
    );
    assert.ok(source.includes("view.coverPhotoUrl"));
    assert.ok(!source.includes(".slice(0, 2)"));
    assert.ok(!source.includes("carousel"));
    assert.ok(!source.includes("Carousel"));
  });
});

describe("reviews-t10: FieldMask recortada (servidor, RF-5, recorte T11+T12)", () => {
  it("la máscara pide solo los campos del recorte de Places API New", () => {
    const source = readFileSync(
      "service/ReviewsEnrichmentService.ts",
      "utf8",
    );
    for (const field of [
      "internationalPhoneNumber",
      "editorialSummary",
      "displayName",
      "formattedAddress",
      "reviews",
    ]) {
      assert.ok(source.includes(field), `FieldMask incluye ${field}`);
    }
    for (const banned of [
      "regularOpeningHours",
      "currentOpeningHours",
      "location",
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
    // Sin BACKEND_URL ni prefijo público (RNF-2/RNF-3 intactos).
    assert.ok(!source.includes("BACKEND_URL"));
    assert.ok(!source.includes("NEXT_PUBLIC"));
  });
});

// Guarda de tipos: ParsedPlace recortado con los campos de RF-5 (T12).
export function __t10Types(parsed: ParsedPlace): void {
  void parsed.phone;
  void parsed.editorialSummary;
}
