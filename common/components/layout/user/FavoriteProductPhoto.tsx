// Spec 007 T4 (vuelta 1) — Foto de favorito con alternativo condicional.
// Client mínimo bajo el Server Component UserProfileTabs (ver guía
// `01-app/01-getting-started/05-server-and-client-components.md`:
// el servidor obtiene los datos y la interactividad —useState + onError—
// baja a este hijo con props serializables). Mismo comportamiento que
// ProductCard: si la foto no carga, se muestra el bloque neutro EN LUGAR
// de la imagen, sin inventar ninguna imagen.
"use client";

import Image from "next/image";
import { useState } from "react";
import { getProductImageSrc } from "@/common/utils/product-image";

export default function FavoriteProductPhoto({ name }: { name: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  return imageFailed ? (
    <div className="h-14 w-14 shrink-0 rounded-md bg-black/60" aria-hidden="true" />
  ) : (
    <Image
      src={getProductImageSrc(name)}
      alt={`Fotografía de ${name}`}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0 rounded-md object-cover"
      onError={() => setImageFailed(true)}
    />
  );
}
