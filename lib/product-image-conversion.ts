/** Solo servidor. No importar desde componentes de cliente. */
import { needsHeicConversion } from "@/common/utils/product-image";

export async function convertToWebpBuffer(
  input: Buffer,
  fileName: string,
): Promise<Buffer> {
  const { default: sharp } = await import("sharp");

  if (needsHeicConversion(fileName)) {
    // heic-decode también en dinámico: así no se carga si no hace falta
    // @ts-expect-error heic-decode no incluye tipos propios
    const { default: decode } = await import("heic-decode");
    const { width, height, data } = await decode({ buffer: input });
    return sharp(Buffer.from(data), {
      raw: { width, height, channels: 4 },
    })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  }

  return sharp(input).webp({ quality: 80, effort: 4 }).toBuffer();
}
