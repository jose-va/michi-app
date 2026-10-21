import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MICHI_ADDRESS,
  MICHI_LOCATION,
  getDirectionsUrl,
  getEmbedUrl,
  getPlaceUrl,
} from "@/common/utils/location";

const OTHER = { lat: 40.5, lng: -3.25 };

describe("URLs de ubicación (RF-5, RNF-6)", () => {
  it("getDirectionsUrl con MICHI_LOCATION", () => {
    assert.equal(
      getDirectionsUrl(MICHI_LOCATION),
      "https://www.google.com/maps/dir/?api=1&destination=37.19753975627692,-3.6019811043498033"
    );
  });

  it("getPlaceUrl con MICHI_LOCATION", () => {
    assert.equal(
      getPlaceUrl(MICHI_LOCATION),
      "https://www.google.com/maps/search/?api=1&query=37.19753975627692,-3.6019811043498033"
    );
  });

  it("getEmbedUrl con MICHI_LOCATION", () => {
    assert.equal(
      getEmbedUrl(MICHI_LOCATION),
      "https://maps.google.com/maps?q=37.19753975627692,-3.6019811043498033&z=16&hl=es&output=embed"
    );
  });

  it("las URLs usan el parámetro location", () => {
    assert.equal(
      getDirectionsUrl(OTHER),
      "https://www.google.com/maps/dir/?api=1&destination=40.5,-3.25"
    );
    assert.equal(
      getPlaceUrl(OTHER),
      "https://www.google.com/maps/search/?api=1&query=40.5,-3.25"
    );
    assert.equal(
      getEmbedUrl(OTHER),
      "https://maps.google.com/maps?q=40.5,-3.25&z=16&hl=es&output=embed"
    );
  });
});

describe("MICHI_ADDRESS (RF-7)", () => {
  it("es la dirección literal", () => {
    assert.equal(
      MICHI_ADDRESS,
      "C/ Gutierre Tibón, Santiago Lozano, 8, Local 2, 18011 Granada"
    );
  });
});
