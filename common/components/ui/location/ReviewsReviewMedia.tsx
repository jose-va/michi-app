// Spec 004 T11 — Avatar y fotos adjuntas por reseña con fallback (RF-4).
// Clients mínimos bajo el Server Component ReviewsSection (ver guía
// `node_modules/next/dist/docs/.../05-server-and-client-components.md`:
// la sección sigue en servidor y la interactividad —useState + onError—
// baja a estos hijos con props serializables). Si el avatar o las fotos
// no existen no se renderizan (lo decide la sección con condicionales por
// `authorAvatarUrl !== null` y `reviewPhotos.length > 0`); si falla su
// carga, onError devuelve null sin huecos rotos ni cambios de orden.
// Alternativos accesibles en español; avatar en tamaño fijo pequeño
// (40 px) y fotos contenidas al ancho del contenedor (sin romper 320 px).
"use client";

import { useState } from "react";

export function ReviewsAuthorAvatar({
  src,
  authorName,
}: {
  src: string;
  authorName: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={`Foto de ${authorName !== "" ? authorName : "autor de Google"}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full object-cover"
    />
  );
}

export function ReviewsReviewPhotos({
  photos,
  authorName,
}: {
  photos: Array<{ url: string; attribution: string | null }>;
  authorName: string;
}) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const visible = photos.filter((photo) => !failed[photo.url]);
  if (visible.length === 0) return null;
  const label =
    authorName !== "" ? authorName : "autor de Google";

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((photo) => (
        <figure key={photo.url} className="flex max-w-full flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={`Foto adjunta de ${label} en su reseña`}
            loading="lazy"
            onError={() =>
              setFailed((previous) => ({ ...previous, [photo.url]: true }))
            }
            className="h-auto w-full max-w-40 rounded-lg object-cover"
          />
          {photo.attribution !== null && (
            <figcaption className="text-xs break-words text-zinc-400">
              Foto de {photo.attribution}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
