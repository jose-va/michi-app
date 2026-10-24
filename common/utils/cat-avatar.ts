export const CAT_AVATAR_BASE_URL = "https://cataas.com/cat";
export const CAT_AVATAR_COUNT = 8;

export function getCatAvatarIndex(seed: string | number): number {
  const text = String(seed);
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % CAT_AVATAR_COUNT;
}

export function getCatAvatarUrl(seed: string | number): string {
  // Cataas sirve un gatito aleatorio por petición; la semilla determinista
  // genera una URL distinta por reserva para que cada tarjeta muestre su gato.
  return `${CAT_AVATAR_BASE_URL}?width=200&height=200&seed=${getCatAvatarIndex(seed)}`;
}
