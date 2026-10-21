export type LatLng = { lat: number; lng: number };

export const MICHI_LOCATION: LatLng = {
  lat: 37.19753975627692,
  lng: -3.6019811043498033,
};

export const MICHI_ADDRESS =
  "C/ Gutierre Tibón, Santiago Lozano, 8, Local 2, 18011 Granada";

export function getDirectionsUrl(location: LatLng = MICHI_LOCATION): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
}

export function getPlaceUrl(location: LatLng = MICHI_LOCATION): string {
  return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
}

export function getEmbedUrl(location: LatLng = MICHI_LOCATION): string {
  return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&hl=es&output=embed`;
}
