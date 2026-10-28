import type { PublicView } from "@/common/utils/reviews-content";
import ReviewsCoverPhoto from "@/common/components/ui/location/ReviewsCoverPhoto";
import {
  ReviewsAuthorAvatar,
  ReviewsReviewPhotos,
} from "@/common/components/ui/location/ReviewsReviewMedia";

// Spec 004 T5 — Sección presentacional pura (RF-4, RF-6, RF-7, RF-13, RNF-7).
// Recibe la vista pública ya saneada o null (omisión limpia, RF-10).
// Sin red, sin secretos, sin h1: la marca 003 queda intacta (RF-13).
// Contraste: texto blanco/zinc sobre fondo oscuro (≥4,5:1, RNF-7).
// Spec 004 T10 (RF-4): junto al literal intacto de valoración, 5 estrellas
// globales solo visuales (ocultas a lectores salvo la etiqueta con la
// puntuación) en tono claro sobre fondo oscuro (≥4,5:1, RNF-7), intactas
// sin mover ni cambiar color.
// Spec 004 T11 (RF-4, RF-5 recortado): cada reseña muestra además el avatar
// del autor y sus fotos adjuntas cuando Google los devuelve, con textos
// alternativos accesibles y omisión limpia si ausentan o fallan (sin huecos
// ni cambios de orden, sin desbordamiento a 320 px); el bloque
// «Datos de Google» solo lista dirección, teléfono y editorial
// disponibles, más nombre solo si difiere.
// Spec 004 T13 (RF-15): el fondo completo de la sección usa el mismo
// degradado de la cabecera de ubicación; las tarjetas internas quedan
// intactas. El objetivo de contraste se mantiene en 4,5:1; si la medición
// real en la cola transparente queda por debajo, se declara como riesgo
// sin recortar contenido (RNF-7).
export default function ReviewsSection({
  view,
}: {
  view: PublicView | null;
}) {
  if (view === null) return null;

  return (
    <section
      aria-labelledby="reviews-heading"
      className="mx-auto mb-6 flex w-full max-w-6xl flex-col gap-5 rounded-lg border border-white/10 border-b-0 bg-gradient-to-b from-black/60 via-black/40 via-80% to-transparent px-4 py-8 backdrop-blur-md md:mb-8 md:px-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="reviews-heading"
          className="text-2xl font-bold text-white md:text-3xl"
        >
          Opiniones de Google
        </h2>
        {view.ratingText !== "" && (
          <p className="flex flex-wrap items-center gap-2 text-lg font-semibold text-white">
            <span>{view.ratingText}</span>
            {view.ratingValue !== null && (
              <span
                role="img"
                aria-label={`Valoración: ${view.ratingValue} de 5 estrellas`}
              >
                <span aria-hidden="true">
                  {"⭐".repeat(
                    Math.min(5, Math.max(0, Math.round(view.ratingValue))),
                  )}
                  {"☆".repeat(
                    Math.max(
                      0,
                      5 - Math.min(5, Math.max(0, Math.round(view.ratingValue))),
                    ),
                  )}
                </span>
              </span>
            )}
          </p>
        )}
      </div>

      {view.summary !== null && (
        <figure className="flex flex-col gap-1">
          <blockquote className="text-base text-zinc-200">
            {view.summary}
          </blockquote>
          {view.summaryAttribution !== null && (
            <figcaption className="text-sm break-words text-zinc-400">
              Resumen de {view.summaryAttribution}
            </figcaption>
          )}
        </figure>
      )}

      <ul className="flex flex-col gap-4">
        {view.reviews.slice(0, 5).map((review, index) => (
          <li
            key={`${review.author}-${index}`}
            className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/40 p-4"
          >
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold break-words text-white">
              {review.authorAvatarUrl !== null && (
                <ReviewsAuthorAvatar
                  src={review.authorAvatarUrl}
                  authorName={review.author}
                />
              )}
              <span>{review.author !== "" ? review.author : "Autor de Google"}</span>
            </p>
            <p className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <span role="img" aria-label={`${review.stars} de 5 estrellas`}>
                <span aria-hidden="true">
                  {"★".repeat(review.stars)}
                  {"☆".repeat(Math.max(0, 5 - review.stars))}
                </span>
              </span>
              {review.relativeTime !== "" && <span>{review.relativeTime}</span>}
            </p>
            {review.text !== "" && (
              <p className="text-sm break-words text-zinc-200">{review.text}</p>
            )}
            {review.reviewPhotos.length > 0 && (
              <ReviewsReviewPhotos
                photos={review.reviewPhotos}
                authorName={review.author}
              />
            )}
          </li>
        ))}
      </ul>

      {(view.contrastAddress !== null ||
        view.contrastName !== null ||
        view.contactPhone !== null ||
        view.editorialSummary !== null) && (
        <div className="flex flex-col gap-1">
          
          {view.contrastName !== null && (
            <p className="text-sm break-words text-zinc-300">
              {view.contrastName}
            </p>
          )}
  
          {view.contactPhone !== null && (
            <p className="text-sm break-words text-zinc-300">
              Teléfono: {view.contactPhone}
            </p>
          )}
          {view.editorialSummary !== null && (
            <p className="text-sm break-words text-zinc-300">
              {view.editorialSummary}
            </p>
          )}
        </div>
      )}

      {view.coverPhotoUrl !== null && (
        <ReviewsCoverPhoto
          src={view.coverPhotoUrl}
          attribution={view.coverPhotoAttribution}
        />
      )}

      <a
        href={view.reviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-semibold text-white underline underline-offset-4 hover:text-zinc-200 focus-visible:text-zinc-200 focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Ver reseñas en Google Maps
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </section>
  );
}
