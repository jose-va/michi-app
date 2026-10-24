// Spec 004 T4 — Servicio servidor con timeout y saneado (RF-1, RF-2, RF-9).
// Red primero: este fichero debe FALLAR hasta implementar
// service/ReviewsEnrichmentService.ts. Dobles de red inyectados, sin
// llamadas reales a Google.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it, beforeEach } from "node:test";
import {
  CACHE_TTL_MS,
  type PublicView,
} from "@/common/utils/reviews-content";
import {
  REVIEWS_TIMEOUT_MS,
  ReviewsEnrichmentService,
} from "@/service/ReviewsEnrichmentService";

const FAKE_KEY = "test-server-key-abc123";
const FAKE_PLACE_ID = "ChIJ-test-place-id-1234";

// Fixture con forma de Places API (New): campos reales verificados en
// docs vigentes (id, displayName, rating, userRatingCount, reviews con
// authorAttribution/relativePublishTimeDescription/text, formattedAddress,
// generativeSummary.overview, photos, googleMapsUri, googleMapsLinks,
// location, internationalPhoneNumber, name como recurso places/...).
const DETAIL_FIXTURE = {
  name: "places/ChIJ-test-place-id-1234",
  id: "ChIJ-test-place-id-1234",
  rating: 4.6,
  userRatingCount: 123,
  generativeSummary: {
    overview: { text: "Los clientes destacan el sushi fresco y el trato." },
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
      text: { text: "Calidad-precio excelente." },
    },
  ],
  formattedAddress: "C/ Gutierre Tibón 8, 18011 Granada",
  photos: [{ url: "https://example.com/foto-portada.jpg" }],
  googleMapsLinks: { placeUrl: "https://maps.google.com/?cid=12345" },
  googleMapsUri: "https://maps.google.com/?cid=12345",
  location: { latitude: 37.1975, longitude: -3.6019 },
  internationalPhoneNumber: "+34 600 111 222",
};

type CapturedCall = { url: string; init: RequestInit | undefined };

function okResponse(payload: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => payload,
  } as unknown as Response;
}

function errorResponse(status: number): Response {
  return {
    ok: false,
    status,
    json: async () => ({}),
  } as unknown as Response;
}

function usableIdentity(placeId: string = FAKE_PLACE_ID) {
  return async () => ({ candidateCount: 1, confidence: "high", placeId });
}

beforeEach(() => {
  ReviewsEnrichmentService.clearCache();
});

describe("reviews-service: timeout por defecto (RF-9)", () => {
  it("REVIEWS_TIMEOUT_MS es 3000 ms", () => {
    assert.equal(REVIEWS_TIMEOUT_MS, 3000);
  });
});

describe("reviews-service: sin clave → ausencia sin red (RF-1, RF-9)", () => {
  it("sin clave no llama a la red y devuelve ausencia", async () => {
    let calls = 0;
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: "",
      resolveIdentity: usableIdentity(),
      fetchImpl: (async () => {
        calls += 1;
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.equal(view, null);
    assert.equal(calls, 0);
  });
});

describe("reviews-service: identidad no usable → ausencia sin detalle (RF-9)", () => {
  it("múltiples candidatos → ausencia sin pedir detalle", async () => {
    let calls = 0;
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: async () => ({
        candidateCount: 2,
        confidence: "high",
        placeId: FAKE_PLACE_ID,
      }),
      fetchImpl: (async () => {
        calls += 1;
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.equal(view, null);
    assert.equal(calls, 0);
  });

  it("confianza no alta → ausencia sin pedir detalle", async () => {
    let calls = 0;
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: async () => ({
        candidateCount: 1,
        confidence: "media",
        placeId: FAKE_PLACE_ID,
      }),
      fetchImpl: (async () => {
        calls += 1;
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.equal(view, null);
    assert.equal(calls, 0);
  });
});

describe("reviews-service: éxito con llamada directa y vista saneada (RF-1, RF-2)", () => {
  it("pide detalle directo a Google y devuelve vista pública sin internos", async () => {
    const captured: CapturedCall[] = [];
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async (url: string, init?: RequestInit) => {
        captured.push({ url, init });
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.ok(view !== null);
    const publicView = view as PublicView;
    assert.equal(publicView.ratingText, "4,6 (123 reseñas)");
    assert.equal(publicView.reviews.length, 3);
    assert.deepEqual(
      publicView.reviews.map((r) => r.author),
      ["Ana G.", "Bruno M.", "Carla R."],
    );

    // Llamada directa a Google, sin BACKEND_URL (RF-1, RNF-3).
    assert.equal(captured.length, 1);
    assert.ok(captured[0].url.startsWith("https://places.googleapis.com/"));
    assert.ok(captured[0].url.includes(FAKE_PLACE_ID));
    assert.ok(!captured[0].url.includes("BACKEND_URL"));
    const backendUrl = process.env.BACKEND_URL ?? "";
    assert.ok(!(backendUrl !== "" && captured[0].url.includes(backendUrl)));
    // Clave por cabecera solo-servidor, nunca en la URL (RNF-2).
    assert.ok(!captured[0].url.includes(FAKE_KEY));

    // Sin internos no mostrables en la respuesta al cliente (RF-2, RF-14):
    // Place ID, recurso, clave, coordenadas, horario, precio, web y
    // servicios nunca salen; el teléfono sí viaja visible como parte de
    // RF-5 recortado (T11).
    const serialized = JSON.stringify(publicView);
    assert.ok(!serialized.includes("ChIJ-test-place-id-1234"));
    assert.ok(!serialized.includes("places/"));
    assert.ok(!serialized.includes(FAKE_KEY));
    assert.ok(
      (publicView.contactPhone ?? "").includes("600 111 222"),
      "teléfono visible como parte de RF-5",
    );
    assert.ok(
      !serialized.includes("37.1975"),
      "coordenadas fuera de la vista (recorte T11)",
    );
  });

  it("envía la petición con señal de aborto (timeout cableado)", async () => {
    const captured: CapturedCall[] = [];
    await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async (url: string, init?: RequestInit) => {
        captured.push({ url, init });
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.equal(captured.length, 1);
    assert.ok(captured[0].init?.signal instanceof AbortSignal);
  });
});

describe("reviews-service: timeout simulado → ausencia (RF-9)", () => {
  it("petición colgada con timeout inyectado → ausencia", async () => {
    let calls = 0;
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      timeoutMs: 50,
      fetchImpl: ((() =>
        new Promise<Response>(() => {
          calls += 1;
        })) as unknown) as typeof fetch,
    });
    assert.equal(view, null);
    assert.equal(calls, 1);
  });

  it("rechazo por aborto → ausencia", async () => {
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      timeoutMs: 50,
      fetchImpl: (async () => {
        throw new DOMException("Aborted", "AbortError");
      }) as typeof fetch,
    });
    assert.equal(view, null);
  });
});

describe("reviews-service: 429/403/5xx → ausencia sin cachear ni reintentar (RF-9)", () => {
  for (const status of [429, 403, 500]) {
    it(`status ${status} → ausencia`, async () => {
      const view = await ReviewsEnrichmentService.getPublicView({
        apiKey: FAKE_KEY,
        resolveIdentity: usableIdentity(),
        fetchImpl: (async () => errorResponse(status)) as typeof fetch,
      });
      assert.equal(view, null);
    });
  }

  it("una petición fallida hace exactamente una llamada (sin reintento)", async () => {
    let calls = 0;
    await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async () => {
        calls += 1;
        return errorResponse(500);
      }) as typeof fetch,
    });
    assert.equal(calls, 1);
  });

  it("el fallo no se cachea: la siguiente petición reintenta la red", async () => {
    let calls = 0;
    const deps = {
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async () => {
        calls += 1;
        return errorResponse(503);
      }) as typeof fetch,
    };
    assert.equal(await ReviewsEnrichmentService.getPublicView(deps), null);
    assert.equal(await ReviewsEnrichmentService.getPublicView(deps), null);
    assert.equal(calls, 2);
  });
});

describe("reviews-service: caché 12 h por Place ID (RF-8)", () => {
  it("el éxito se reutiliza sin repetir la red", async () => {
    let calls = 0;
    const now = 1_000_000;
    const deps = {
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      nowMs: () => now,
      fetchImpl: (async () => {
        calls += 1;
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    };
    const first = await ReviewsEnrichmentService.getPublicView(deps);
    const second = await ReviewsEnrichmentService.getPublicView(deps);
    assert.ok(first !== null && second !== null);
    assert.deepEqual(second, first);
    assert.equal(calls, 1);
  });

  it("expirada + fallo de revalidación → omisión sin obsoletos", async () => {
    let now = 1_000_000;
    let calls = 0;
    let fail = false;
    const deps = {
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      nowMs: () => now,
      fetchImpl: (async () => {
        calls += 1;
        return fail ? errorResponse(500) : okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    };
    assert.ok((await ReviewsEnrichmentService.getPublicView(deps)) !== null);
    assert.equal(calls, 1);
    now += CACHE_TTL_MS + 1;
    fail = true;
    assert.equal(await ReviewsEnrichmentService.getPublicView(deps), null);
    assert.equal(calls, 2);
  });

  it("expirada + éxito → muestra los datos nuevos", async () => {
    let now = 1_000_000;
    let payload: unknown = DETAIL_FIXTURE;
    const deps = {
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      nowMs: () => now,
      fetchImpl: (async () => okResponse(payload)) as typeof fetch,
    };
    const first = await ReviewsEnrichmentService.getPublicView(deps);
    assert.ok(first !== null);
    now += CACHE_TTL_MS + 1;
    payload = { ...DETAIL_FIXTURE, rating: 4.8, userRatingCount: 200 };
    const second = await ReviewsEnrichmentService.getPublicView(deps);
    assert.ok(second !== null);
    assert.equal((second as PublicView).ratingText, "4,8 (200 reseñas)");
  });
});

describe("reviews-service: respuestas sin datos → ausencia (RF-9, RF-10)", () => {
  it("cero reseñas → ausencia aunque haya valoración", async () => {
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async () =>
        okResponse({
          rating: 4.6,
          userRatingCount: 123,
          reviews: [],
          googleMapsUri: "https://maps.google.com/?cid=12345",
        })) as typeof fetch,
    });
    assert.equal(view, null);
  });

  it("cuerpo no JSON / vacío → ausencia", async () => {
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: ((async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("bad json");
        },
      })) as unknown) as typeof fetch,
    });
    assert.equal(view, null);
  });
});

describe("reviews-service: detalle en español con languageCode=es (RF-1, RNF-1)", () => {
  it("la URL de detalle incluye languageCode=es", async () => {
    const captured: CapturedCall[] = [];
    await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async (url: string, init?: RequestInit) => {
        captured.push({ url, init });
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    });
    assert.equal(captured.length, 1);
    assert.equal(
      new URL(captured[0].url).searchParams.get("languageCode"),
      "es",
    );
  });

  it("con languageCode=es se conserva el original español sin traducir ni filtrar", async () => {
    // Con languageCode=es Google devuelve en `text` el original español
    // (igual que `originalText`); se muestra tal cual, sin traducir en
    // nuestro código y sin filtrar por idioma (caso límite de la spec).
    const spanishOriginal = "El mejor sushi de Granada, volveremos pronto.";
    const englishReview = "Great sushi and friendly staff.";
    const payload = {
      ...DETAIL_FIXTURE,
      reviews: [
        {
          authorAttribution: { displayName: "Ana G." },
          rating: 5,
          relativePublishTimeDescription: "hace 2 semanas",
          text: { text: spanishOriginal, languageCode: "es" },
          originalText: { text: spanishOriginal, languageCode: "es" },
        },
        {
          authorAttribution: { displayName: "John D." },
          rating: 5,
          relativePublishTimeDescription: "2 weeks ago",
          text: { text: englishReview, languageCode: "en" },
          originalText: { text: englishReview, languageCode: "en" },
        },
      ],
    };
    const captured: CapturedCall[] = [];
    const view = await ReviewsEnrichmentService.getPublicView({
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      fetchImpl: (async (url: string, init?: RequestInit) => {
        captured.push({ url, init });
        return okResponse(payload);
      }) as typeof fetch,
    });
    assert.ok(view !== null);
    const publicView = view as PublicView;
    assert.equal(
      new URL(captured[0].url).searchParams.get("languageCode"),
      "es",
    );
    assert.deepEqual(
      publicView.reviews.map((r) => r.text),
      [spanishOriginal, englishReview],
    );
  });

  it("la caché sigue por Place ID con el detalle en español", async () => {
    let calls = 0;
    const now = 1_000_000;
    const deps = {
      apiKey: FAKE_KEY,
      resolveIdentity: usableIdentity(),
      nowMs: () => now,
      fetchImpl: (async (url: string) => {
        calls += 1;
        assert.equal(new URL(url).searchParams.get("languageCode"), "es");
        return okResponse(DETAIL_FIXTURE);
      }) as typeof fetch,
    };
    const first = await ReviewsEnrichmentService.getPublicView(deps);
    const second = await ReviewsEnrichmentService.getPublicView(deps);
    assert.ok(first !== null && second !== null);
    assert.deepEqual(second, first);
    assert.equal(calls, 1);
  });
});

describe("reviews-service: solo servidor y sin secretos en logs (RNF-2, RNF-3)", () => {
  it("el módulo no usa BACKEND_URL ni clave con prefijo público", () => {
    const source = readFileSync(
      new URL("../service/ReviewsEnrichmentService.ts", import.meta.url),
      "utf8",
    );
    assert.ok(!source.includes("BACKEND_URL"));
    assert.ok(!source.includes("NEXT_PUBLIC"));
    assert.ok(source.includes("sanitizeForClient"));
  });

  it("los fallos no registran la clave en logs", async () => {
    const logged: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      logged.push(args.map(String).join(" "));
    };
    try {
      await ReviewsEnrichmentService.getPublicView({
        apiKey: FAKE_KEY,
        resolveIdentity: usableIdentity(),
        fetchImpl: (async () => errorResponse(500)) as typeof fetch,
      });
    } finally {
      console.error = original;
    }
    assert.ok(!logged.join("\n").includes(FAKE_KEY));
  });
});
