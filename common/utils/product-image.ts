export const PRODUCT_IMAGE_DIR = "/images";

export function getProductImageSrc(name: string): string {
  return `${PRODUCT_IMAGE_DIR}/${name}.webp`;
}
