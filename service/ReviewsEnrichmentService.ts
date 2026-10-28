// Spec 004 T4 — Servicio servidor de enriquecimiento con timeout y saneado.
// SOLO SERVIDOR: usa la clave de servidor (variable de entorno sin prefijo
// público, nunca en logs ni en el cliente) en llamadas directas a Google
// (nunca vía la URL del backend propio). Resuelve identidad (seam donde
// se conecta Maps Grounding Lite), pide el detalle de lugar con timeout de
// 3 s, aplica caché en memoria de 12 h por Place ID, sanea internos con
// sanitizeForClient y devuelve solo la vista pública o ausencia.
// Contrato verificado contra Places API (New) vigente:
// GET https://places.googleapis.com/v1/places/{placeId} con cabeceras
// X-Goog-Api-Key y X-Goog-FieldMask obligatoria; campos reales del recurso
// Place (id, displayName, rating, userRatingCount, reviews con
// authorAttribution/photoUri, relativePublishTimeDescription, text y
// fotos, formattedAddress,
// photos, googleMapsUri,
// googleMapsLinks, generativeSummary.overview, editorialSummary,
// internationalPhoneNumber, name).
import {
  CACHE_TTL_MS,
  isCacheFresh,
  isIdentityUsable,
  parsePlaceDetails,
  sanitizeForClient,
  shouldShowSection,
  type PublicView,
} from "@/common/utils/reviews-content";

// Tiempo máximo por petición de enriquecimiento (RF-9): 3 segundos.
export const REVIEWS_TIMEOUT_MS = 3000;

// Clave de servidor configurada por el propietario (variable de entorno de
// servidor, nunca con prefijo público, nunca en logs ni en el cliente).
const SERVER_KEY_ENV = "GOOGLE_PLACES_SERVER_KEY";
// Identidad del local configurada (seam de Maps Grounding Lite: la
// resolución real —nombres/URLs a entidad con confianza— se conecta aquí).
const PLACE_ID_ENV = "GOOGLE_PLACE_ID";

// Detalle de lugar (Places API New). Máscara con campos reales del recurso
// Place necesarios para la vista pública acotada (RF-4, RF-5 recortado,
// RF-6, RF-14). Recorte T12 (RF-5): sin horario (ni actual ni semanal),
// sin coordenadas, sin precio, sin web, sin servicios y sin
// accesibilidad; `reviews` trae
// autor, avatar, estrellas, tiempo, texto y fotos adjuntas de la reseña,
// más dirección, teléfono, editorial, nombre y foto.
const PLACES_FIELD_MASK = [
  "id",
  "displayName",
  "rating",
  "userRatingCount",
  "reviews",
  "formattedAddress",
  "photos",
  "googleMapsUri",
  "googleMapsLinks",
  "generativeSummary",
  "editorialSummary",
  "internationalPhoneNumber",
  "name",
].join(",");

export type ResolvedIdentity = {
  candidateCount: number;
  confidence: string;
  placeId: string | null;
};

export type ReviewsEnrichmentDeps = {
  fetchImpl?: typeof fetch;
  resolveIdentity?: () => Promise<ResolvedIdentity>;
  apiKey?: string;
  placeId?: string;
  timeoutMs?: number;
  nowMs?: () => number;
};

type CacheEntry = { view: PublicView; cachedAtMs: number };

// Caché en memoria de servidor, 12 h por Place ID (RF-8). Solo guarda
// vistas públicas ya saneadas; los fallos nunca se cachean (RF-9).
const cacheByPlaceId = new Map<string, CacheEntry>();

function defaultIdentity(placeId: string | undefined): ResolvedIdentity {
  if (placeId === undefined || placeId === "") {
    return { candidateCount: 0, confidence: "", placeId: null };
  }
  return { candidateCount: 1, confidence: "high", placeId };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

function placeUrlFor(placeId: string): string {
  const resource = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
  // RF-1/RNF-1: pedir el detalle con idioma español para recibir el
  // contenido original en español del local, sin traducir en nuestro código.
  return `https://places.googleapis.com/v1/${resource}?languageCode=es`;
}

export class ReviewsEnrichmentService {
  static clearCache(): void {
    cacheByPlaceId.clear();
  }

  static async getPublicView(
    deps: ReviewsEnrichmentDeps = {},
  ): Promise<PublicView | null> {
    const apiKey = deps.apiKey ?? process.env[SERVER_KEY_ENV] ?? "";
    if (apiKey === "") return null;

    const timeoutMs = deps.timeoutMs ?? REVIEWS_TIMEOUT_MS;
    const nowMs = deps.nowMs ?? Date.now;
    const fetchImpl = deps.fetchImpl ?? fetch;
    const resolveIdentity =
      deps.resolveIdentity ??
      (async () =>
        defaultIdentity(deps.placeId ?? process.env[PLACE_ID_ENV]));

    let identity: ResolvedIdentity;
    try {
      identity = await withTimeout(resolveIdentity(), timeoutMs);
    } catch {
      return null;
    }
    if (
      identity.placeId === null ||
      identity.placeId === "" ||
      !isIdentityUsable(identity.candidateCount, identity.confidence)
    ) {
      return null;
    }
    const placeId = identity.placeId;
    const now = nowMs();
    const cached = cacheByPlaceId.get(placeId);
    if (cached !== undefined && isCacheFresh(cached.cachedAtMs, now, CACHE_TTL_MS)) {
      return cached.view;
    }

    let response: Response;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        response = await withTimeout(
          fetchImpl(placeUrlFor(placeId), {
            headers: {
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": PLACES_FIELD_MASK,
            },
            signal: controller.signal,
          }),
          timeoutMs,
        );
      } finally {
        clearTimeout(timer);
      }
    } catch {
      return null;
    }
    // 429, 403, 5xx o cualquier error HTTP → ausencia, sin cachear (RF-9).
    if (!response.ok) {
      console.error(
        `No se pudo obtener la valoración de Google (estado ${response.status})`,
      );
      return null;
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      return null;
    }
    const parsed = parsePlaceDetails(raw);
    if (!shouldShowSection(parsed)) return null;
    if (parsed === null) return null;
    const view = sanitizeForClient(parsed);
    if (view === null) return null;
    cacheByPlaceId.set(placeId, { view, cachedAtMs: now });
    return view;
  }
}
