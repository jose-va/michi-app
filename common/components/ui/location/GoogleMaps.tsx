"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

setOptions({
  key: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  v: "quarterly",
  language: "es",
  region: "ES",
});

export default function GoogleMaps() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const location = {
        lat: 37.19753975627692,
        lng: -3.6019811043498033,
      };

      const options: google.maps.MapOptions = {
        center: location,
        zoom: 14,
        mapId: "DEMO_MAP_ID",
      };

      if (mapRef.current) {
        const map = new Map(mapRef.current, options);

        new AdvancedMarkerElement({
          position: location,
          map: map,
          title: "Michi Sushi Granada"
        });
      }
    };

    initMap();
  }, []);

  return (
    <div
      ref={mapRef}
      className="h-full w-full transition-all duration-500 hover:scale-105"
    />
  );
}
