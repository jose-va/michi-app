export const PRODUCT_IMAGE_DIR = "/images";

export function getProductImageSrc(name: string): string {
  return `${PRODUCT_IMAGE_DIR}/${name}.webp`;
}

export const PRODUCT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export const PRODUCT_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
] as const;

export type ProductImageExtension = (typeof PRODUCT_IMAGE_EXTENSIONS)[number];

export function getProductImageExtension(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function needsHeicConversion(fileName: string): boolean {
  const ext = getProductImageExtension(fileName);
  return ext === "heic" || ext === "heif";
}

export function sanitizeProductImageName(name: string): string {
  return name
    .trim()
    .replace(/[\\/]/g, "")
    .replace(/\.\.+/g, "");
}

export function buildProductImageFileName(productName: string): string {
  const safe = sanitizeProductImageName(productName);
  if (!safe) throw new Error("El nombre del producto es obligatorio");
  return `${safe}.webp`;
}

export type ProductImageValidation =
  | { ok: true }
  | { ok: false; error: string };

export function validateProductImageFile(
  fileName: string,
  fileSize: number,
): ProductImageValidation {
  const ext = getProductImageExtension(fileName);
  if (
    !(PRODUCT_IMAGE_EXTENSIONS as readonly string[]).includes(ext) ||
    !ext
  ) {
    return {
      ok: false,
      error: "Formato no admitido. Usa JPG, PNG, WebP o HEIC.",
    };
  }
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return { ok: false, error: "No se ha podido leer la imagen." };
  }
  if (fileSize > PRODUCT_IMAGE_MAX_BYTES) {
    return {
      ok: false,
      error: "La imagen supera los 10 MB. Elige una más pequeña.",
    };
  }
  return { ok: true };
}
