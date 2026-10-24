// Spec 004 T6 — Portada con fallback (RF-6).
// Client mínimo bajo el Server Component ReviewsSection (ver guía
// `node_modules/next/dist/docs/.../05-server-and-client-components.md`:
// la sección sigue en servidor y la interactividad —useState + onError—
// baja a este hijo con props serializables). Si la foto no existe no se
// renderiza (lo decide la sección con `coverPhotoUrl !== null`); si falla
// su carga, onError devuelve null sin huecos rotos ni cambios de orden.
"use client";

import { useState } from "react";

export default function ReviewsCoverPhoto({
  src,
  attribution,
}: {
  src: string;
  attribution: string | null;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="flex flex-col gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Foto del local en Google Maps"
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-auto w-full rounded-lg"
      />
      {attribution !== null && (
        <figcaption className="text-sm break-words text-zinc-400">
          Foto de {attribution}
        </figcaption>
      )}
    </figure>
  );
}
