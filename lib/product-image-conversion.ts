/** Solo servidor. No importar desde componentes de cliente. */

import sharp from "sharp";
// @ts-expect-error heic-decode no incluye tipos propios
import decode from "heic-decode";

import { needsHeicConversion } from "@/common/utils/product-image";

/**
 * Convierte cualquier imagen admitida a WebP.
 * Lógica verificada de scripts/convert-selected-images.js:
 * HEIC -> heic-decode a RGBA crudo -> sharp a WebP (quality 80).
 * Resto -> sharp directo a WebP (quality 80).
 */
export async function convertToWebpBuffer(
  input: Buffer,
  fileName: string,
): Promise<Buffer> {
  if (needsHeicConversion(fileName)) {
    const { width, height, data } = await decode({ buffer: input });
    return sharp(Buffer.from(data), {
      raw: { width, height, channels: 4 },
    })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  }
  return sharp(input).webp({ quality: 80, effort: 4 }).toBuffer();
}
