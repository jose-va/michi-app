// Conversión de la clave pública VAPID (RF-9, CL-19).
// Lógica pura fuera de la UI (constitución, punto 3): la clave viaja en
// formato base64 URL-safe y `pushManager.subscribe` la exige como
// `Uint8Array`. Devuelve `null` si está ausente o malformada para que el
// alta informe en español sin ofrecer activar (CL-19). Nunca registra la
// clave (RF-24, RNF-2).
export function publicKeyToUint8Array(
  base64Url: string | null | undefined,
): Uint8Array | null {
  if (typeof base64Url !== "string") return null;
  const normalized = base64Url.trim();
  if (normalized.length === 0) return null;
  if (!/^[A-Za-z0-9\-_]+={0,2}$/.test(normalized)) return null;
  try {
    const base64 = normalized.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoder =
      typeof globalThis.atob === "function"
        ? globalThis.atob.bind(globalThis)
        : (input: string) => Buffer.from(input, "base64").toString("binary");
    const binary = decoder(padded);
    if (binary.length === 0) return null;
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

// Exporta una clave del dispositivo (`getKey("p256dh" | "auth")`) a base64
// estándar para su envío autenticado al backend (RF-9). Solo transforma
// bytes; nunca registra el contenido (RF-24).
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof globalThis.btoa === "function") return globalThis.btoa(binary);
  return Buffer.from(binary, "binary").toString("base64");
}
