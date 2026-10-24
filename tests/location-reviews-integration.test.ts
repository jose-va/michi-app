// Spec 004 T7 — Integración en página sin bloquear la 003 (RF-3, RF-11, RNF-6).
// Verificación estática de la composición: la 003 queda intacta, la sección
// va solo debajo del bloque mapa + panel, el enriquecimiento se resuelve en
// servidor dentro de un Suspense hermano (sin bloquear la 003) y la omisión
// es silenciosa. Navegador real (320/375/1280) y bundle van en T8.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const PAGE_PATH = "common/components/pages/location/LocationPage.tsx";
const PAGE = readFileSync(PAGE_PATH, "utf8");
const ROUTE_PATH = "app/location/page.tsx";
const ROUTE = readFileSync(ROUTE_PATH, "utf8");

describe("T7: LocationPage mantiene la 003 intacta (RF-3, RF-13)", () => {
  it("cabecera, mapa y panel 003 intactos", () => {
    for (const literal of [
      "Michi Sushi Bar",
      "Estamos en Granada",
      "lg:grid-cols-[2fr_1fr]",
      "<GoogleMaps",
      "<aside",
      "Cómo llegar",
      "Reserva ahora",
    ]) {
      assert.ok(PAGE.includes(literal), `la 003 debe conservar ${literal}`);
    }
  });

  it("la ranura de reseñas va después del bloque mapa + panel, nunca dentro", () => {
    assert.ok(
      PAGE.includes("reviewsSlot"),
      "LocationPage debe exponer la ranura reviewsSlot"
    );
    assert.ok(
      PAGE.indexOf("{reviewsSlot}") > PAGE.indexOf("</aside>"),
      "la ranura debe ir después del panel (nunca dentro del bloque mapa + panel)"
    );
    assert.ok(
      PAGE.indexOf("{reviewsSlot}") > PAGE.indexOf("</section>"),
      "la ranura debe ir después de la sección 003 (sección última)"
    );
  });

  it("LocationPage no resuelve red ni secretos ni internos", () => {
    for (const forbidden of [
      "fetch(",
      "BACKEND_URL",
      "NEXT_PUBLIC",
      "placeId",
      "coordinates",
      "resourceName",
    ]) {
      assert.ok(
        !PAGE.includes(forbidden),
        `LocationPage no debe contener ${forbidden}`
      );
    }
  });
});

describe("T7: ruta /location no bloquea la 003 (RF-11, RNF-6)", () => {
  it("la página es síncrona: la 003 forma el shell estático", () => {
    assert.ok(
      ROUTE.includes("export default function LocationDashboard()"),
      "la página debe ser síncrona (sin await a nivel de página)"
    );
    assert.ok(
      !ROUTE.includes("export default async"),
      "prohibido bloquear la página esperando el enriquecimiento"
    );
  });

  it("Suspense hermano con fallback nulo para la sección (sin desplazar)", () => {
    assert.ok(ROUTE.includes("<Suspense fallback={null}>"));
    assert.ok(
      ROUTE.indexOf("<LocationPage") < ROUTE.indexOf("<Suspense"),
      "la 003 se renderiza antes e independiente del Suspense"
    );
    assert.ok(ROUTE.includes("<ReviewsSlot"));
  });

  it("el hueco resuelve en servidor con omisión silenciosa ante fallo", () => {
    assert.ok(ROUTE.includes("async function ReviewsSlot"));
    assert.ok(
      ROUTE.includes("ReviewsEnrichmentService.getPublicView()"),
      "usa el servicio servidor con la clave de entorno"
    );
    assert.ok(
      ROUTE.includes("catch") && ROUTE.includes("view = null"),
      "cualquier error → ausencia (omisión en silencio)"
    );
    assert.ok(ROUTE.includes("<ReviewsSection view={view}"));
    assert.ok(ROUTE.includes("<LocationPage"));
    assert.ok(
      ROUTE.includes("reviewsSlot={"),
      "la vista resuelta se pasa a la página mediante la ranura"
    );
  });

  it("la ruta no filtra internos ni secretos al cliente", () => {
    assert.ok(!ROUTE.includes('"use client"'));
    assert.ok(!ROUTE.includes("'use client'"));
    for (const forbidden of [
      "NEXT_PUBLIC",
      "placeId",
      "coordinates",
      "resourceName",
      "X-Goog-Api-Key",
    ]) {
      assert.ok(
        !ROUTE.includes(forbidden),
        `la ruta no debe contener ${forbidden}`
      );
    }
  });
});
