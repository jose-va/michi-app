// Spec 004 — Lógica pura de contenido de reseñas (sin UI ni red).
// T1: parseo, formato y recorte (RF-4, RF-14, RNF-1, RNF-8).
// T2: visibilidad e identidad (RF-10, RF-12, RF-5).
// T3: frescura de caché (RF-8) con isCacheFresh + CACHE_TTL_MS.
export const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export const MAX_REVIEW_CHARS = 300;

export const CONTRAST_LABEL = "Datos de Google";

const ELLIPSIS = "…";

export type ParsedReview = {
  author: string;
  authorAvatarUrl: string | null;
  stars: number;
  relativeTime: string;
  text: string;
  reviewPhotos: PhotoRef[];
};

export type PhotoRef = {
  url: string;
  attribution: string | null;
};

// Vista interna de servidor: puede contener identificadores que la
// vista pública debe eliminar (RF-2/RF-14: nunca salen al cliente).
// Recorte T12 (RF-5): solo dirección, teléfono, editorial y nombre si
// difiere; sin horario, sin coordenadas, sin precio, sin web, sin
// servicios y sin accesibilidad. Cada ausente es null para omisión
// sin huecos.
export type ParsedPlace = {
  rating: number | null;
  reviewCount: number | null;
  summary: string | null;
  summaryAttribution: string | null;
  reviews: ParsedReview[];
  address: string | null;
  placeName: string | null;
  photos: PhotoRef[];
  placeUrl: string | null;
  googleMapsUri: string | null;
  placeId: string | null;
  resourceName: string | null;
  phone: string | null;
  editorialSummary: string | null;
};

export type ReviewView = {
  author: string;
  authorAvatarUrl: string | null;
  stars: number;
  relativeTime: string;
  text: string;
  reviewPhotos: PhotoRef[];
};

// Vista pública ya saneada: sin Place ID, recurso ni clave (RF-2/RF-14).
// Recorte T12 (RF-5): solo dirección, teléfono y editorial visibles,
// más nombre solo si difiere; cada ausente es nulo y se omite sin huecos
// ni cambios de orden.
export type PublicView = {
  ratingText: string;
  ratingValue: number | null;
  summary: string | null;
  summaryAttribution: string | null;
  reviews: ReviewView[];
  contrastLabel: typeof CONTRAST_LABEL;
  contrastAddress: string | null;
  contrastName: string | null;
  contactPhone: string | null;
  editorialSummary: string | null;
  coverPhotoUrl: string | null;
  coverPhotoAttribution: string | null;
  reviewsUrl: string;
  attribution: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function textOf(value: unknown): string | null {
  const direct = asString(value);
  if (direct !== null) return direct;
  const record = asRecord(value);
  if (record === null) return null;
  return asString(record.text) ?? asString(record.overview) ?? null;
}

function firstAttribution(value: unknown): string | null {
  const record = asRecord(value);
  if (record === null) return null;
  const list = record.attributions;
  if (Array.isArray(list)) {
    for (const item of list) {
      const name =
        asString(asRecord(item)?.displayName) ??
        asString(asRecord(item)?.name);
      if (name !== null) return name;
    }
  }
  return (
    asString(record.attribution) ??
    asString(asRecord(record.authorAttribution)?.displayName)
  );
}

function parseReview(item: unknown): ParsedReview | null {
  const record = asRecord(item);
  if (record === null) return null;
  const attribution = asRecord(record.authorAttribution);
  const author =
    asString(attribution?.displayName) ??
    asString(record.author_name) ??
    asString(record.author) ??
    "";
  // T11 (RF-4): avatar del autor cuando Google lo devuelve (photoUri de
  // authorAttribution en Places API New); ausente es null (omisión limpia).
  const authorAvatarUrl =
    asString(attribution?.photoUri) ??
    asString(attribution?.photo_uri) ??
    null;
  const stars =
    asNumber(record.rating) ?? asNumber(record.stars) ?? 0;
  const relativeTime =
    asString(record.relativePublishTimeDescription) ??
    asString(record.relative_time_description) ??
    "";
  const textValue = record.text;
  const text =
    asString(textValue) ?? asString(asRecord(textValue)?.text) ?? "";
  // T11 (RF-4): fotos adjuntas a la reseña cuando Google las devuelve
  // (lista `photos` de la reseña); ausentes son lista vacía.
  const reviewPhotos: PhotoRef[] = [];
  if (Array.isArray(record.photos)) {
    for (const photo of record.photos) {
      const parsed = parsePhoto(photo);
      if (parsed !== null) reviewPhotos.push(parsed);
    }
  }
  if (author === "" && text === "" && stars === 0 && relativeTime === "") {
    return null;
  }
  return { author, authorAvatarUrl, stars, relativeTime, text, reviewPhotos };
}

function parsePhoto(item: unknown): PhotoRef | null {
  const record = asRecord(item);
  if (record === null) return null;
  const url =
    asString(record.url) ??
    asString(record.photoUri) ??
    asString(record.photo_uri);
  if (url === null) return null;
  const attribution =
    firstAttribution(record) ??
    asString(asRecord(record.authorAttribution)?.displayName);
  return { url, attribution };
}

// T12 (RF-5): recorte aprobado — sin horario, sin coordenadas, sin
// precio, sin web, sin servicios y sin accesibilidad: no se extraen esos
// campos del detalle.

// Valida y extrae lo aprovechable de la respuesta de detalle tal cual
// la devuelve Google; null si no hay nada aprovechable. Conserva el
// orden de reseñas recibido, sin reordenar (RF-4).
export function parsePlaceDetails(raw: unknown): ParsedPlace | null {
  const record = asRecord(raw);
  if (record === null) return null;

  const rating = asNumber(record.rating);
  const reviewCount =
    asNumber(record.userRatingCount) ??
    asNumber(record.user_ratings_total);
  const summarySource =
    asRecord(record.generativeSummary) ??
    asRecord(record.reviewSummary) ??
    asRecord(record.editorialSummary);
  const summary =
    textOf(asRecord(summarySource)?.overview) ??
    textOf(summarySource) ??
    asString(record.summary);
  const summaryAttribution =
    (summarySource !== null ? firstAttribution(summarySource) : null) ??
    asString(record.summaryAttribution);

  const reviews: ParsedReview[] = [];
  if (Array.isArray(record.reviews)) {
    for (const item of record.reviews) {
      const review = parseReview(item);
      if (review !== null) reviews.push(review);
    }
  }

  const address =
    asString(record.formattedAddress) ??
    asString(record.formatted_address);

  const resourceName = asString(record.name);
  const placeName =
    textOf(asRecord(record.displayName)) ??
    (resourceName !== null && resourceName.startsWith("places/")
      ? null
      : resourceName);

  const photos: PhotoRef[] = [];
  if (Array.isArray(record.photos)) {
    for (const item of record.photos) {
      const photo = parsePhoto(item);
      if (photo !== null) photos.push(photo);
    }
  }

  const placeUrl =
    asString(asRecord(record.googleMapsLinks)?.placeUrl) ??
    asString(record.placeUrl);
  const googleMapsUri =
    asString(record.googleMapsUri) ?? asString(record.url);
  const placeId =
    asString(record.id) ?? asString(record.place_id);
  const phone =
    asString(record.internationalPhoneNumber) ??
    asString(record.formatted_phone_number);
  const editorialSummary = textOf(asRecord(record.editorialSummary));

  const usable =
    rating !== null ||
    reviewCount !== null ||
    summary !== null ||
    reviews.length > 0 ||
    address !== null ||
    photos.length > 0 ||
    placeUrl !== null ||
    googleMapsUri !== null;
  if (!usable) return null;

  return {
    rating,
    reviewCount,
    summary,
    summaryAttribution,
    reviews,
    address,
    placeName,
    photos,
    placeUrl,
    googleMapsUri,
    placeId,
    resourceName: resourceName?.startsWith("places/") ? resourceName : null,
    phone,
    editorialSummary,
  };
}

// Formato literal «4,6 (123 reseñas)» con coma decimal (RF-4).
export function formatRating(rating: number, count: number): string {
  const withComma = rating.toFixed(1).replace(".", ",");
  return `${withComma} (${count} reseñas)`;
}

// Recorta a 300 caracteres con puntos suspensivos, sin expandible
// (RNF-8). Los textos de terceros se muestran tal cual (RNF-1).
export function trimReviewText(
  text: string,
  maxChars: number = MAX_REVIEW_CHARS,
): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}${ELLIPSIS}`;
}

// Únicamente la primera foto devuelta como portada, o null (RF-6).
export function pickCoverPhoto(photos: PhotoRef[]): PhotoRef | null {
  return photos.length > 0 ? photos[0] : null;
}

// Visibilidad de la nueva sección (RF-10, RF-12): false si nulo, si
// cero reseñas o si faltan `placeUrl` y `googleMapsUri`; true en otro
// caso. Con al menos una reseña lo ausente se omite sin huecos (RF-10).
export function shouldShowSection(parsed: ParsedPlace | null): boolean {
  if (parsed === null) return false;
  if (parsed.reviews.length === 0) return false;
  if (parsed.placeUrl === null && parsed.googleMapsUri === null) return false;
  return true;
}

// Identidad usable (RF-12): true solo con un único candidato de
// confianza alta; en otro caso se trata como ausencia de datos.
// Acepta «alta»/«high» (es/en) insensible a caja y espacios.
export function isIdentityUsable(
  candidateCount: number,
  confidence: string,
): boolean {
  if (candidateCount !== 1) return false;
  const normalized = confidence.trim().toLowerCase();
  return normalized === "alta" || normalized === "high";
}

// Frescura de caché de 12 h con reloj inyectado (RF-8, T3): pura,
// sin Date.now ni red. Vigente si 0 <= ahora - guardado < ttl; el
// borde exacto de 12 h ya cuenta como expirada. Una caché expirada
// cuya revalidación falla debe omitirse sin reutilizar obsoletos
// (lo aplica el servicio de T4 con este predicado).
export function isCacheFresh(
  cachedAtMs: number,
  nowMs: number,
  ttlMs: number = CACHE_TTL_MS,
): boolean {
  const ageMs = nowMs - cachedAtMs;
  return ageMs >= 0 && ageMs < ttlMs;
}

// Saneado recortado T12 (RF-2, RF-5, RF-14): elimina siempre Place ID,
// recurso, clave y todo campo fuera del recorte (horario, coordenadas,
// precio, web, servicios y accesibilidad); conserva como visibles
// dirección, teléfono y editorial, más nombre solo si difiere. Hasta 5 reseñas
// en el orden de Google con texto ya recortado, avatar y fotos cuando
// Google los devuelve (RF-4, RNF-8).
export function sanitizeForClient(parsed: ParsedPlace): PublicView | null {
  const cover = pickCoverPhoto(parsed.photos);
  return {
    ratingText:
      parsed.rating !== null && parsed.reviewCount !== null
        ? formatRating(parsed.rating, parsed.reviewCount)
        : "",
    ratingValue: parsed.rating,
    summary: parsed.summary,
    summaryAttribution: parsed.summaryAttribution,
    reviews: parsed.reviews.slice(0, 5).map((review) => ({
      author: review.author,
      authorAvatarUrl: review.authorAvatarUrl,
      stars: review.stars,
      relativeTime: review.relativeTime,
      text: trimReviewText(review.text),
      reviewPhotos: review.reviewPhotos,
    })),
    contrastLabel: CONTRAST_LABEL,
    contrastAddress: parsed.address,
    contrastName: parsed.placeName,
    contactPhone: parsed.phone,
    editorialSummary: parsed.editorialSummary,
    coverPhotoUrl: cover?.url ?? null,
    coverPhotoAttribution: cover?.attribution ?? null,
    reviewsUrl: parsed.placeUrl ?? parsed.googleMapsUri ?? "",
    attribution: "Google Maps",
  };
}
