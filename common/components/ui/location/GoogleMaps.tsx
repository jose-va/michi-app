"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

import { getEmbedUrl, MICHI_LOCATION } from "@/common/utils/location";

const API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;

// `setOptions` toca `window`: solo se invoca en cliente (dentro del efecto) y una vez.
let optionsConfigured = false;

export default function GoogleMaps({ zoom = 16 }: { zoom?: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(!API_KEY);

  useEffect(() => {
    if (!API_KEY) return;

    if (!optionsConfigured) {
      setOptions({ key: API_KEY, v: "quarterly", language: "es", region: "ES" });
      optionsConfigured = true;
    }

    // Google invoca esta función global si la clave, la facturación o las restricciones fallan.
    const handleAuthFailure = () => setUseFallback(true);
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure =
      handleAuthFailure;

    let cancelled = false;

    const initMap = async () => {
      try {
        const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        if (cancelled || !mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: MICHI_LOCATION,
          zoom,
          mapId: "DEMO_MAP_ID",
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });

        new AdvancedMarkerElement({
          position: MICHI_LOCATION,
          map,
          title: "Michi Sushi Granada",
        });
      } catch {
        if (!cancelled) setUseFallback(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      const w = window as unknown as { gm_authFailure?: () => void };
      if (w.gm_authFailure === handleAuthFailure) {
        delete w.gm_authFailure;
      }
    };
  }, [zoom]);

  if (useFallback) {
    return (
      <iframe
        title="Mapa de la ubicación de Michi Sushi Granada"
        src={getEmbedUrl(MICHI_LOCATION)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div
      ref={mapRef}
      role="region"
      aria-label="Mapa de la ubicación de Michi Sushi Granada"
      className="h-full w-full"
    />
  );
}
