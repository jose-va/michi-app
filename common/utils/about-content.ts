export const ABOUT_TITLE = "BIENVENIDOS A MICHI";

export const ABOUT_KANJI = "道";

export const ABOUT_PARAGRAPHS: readonly string[] = [
  'En japonés, "Michi" significa camino.',
  "Aunque mis inicios estuvieron ligados al dibujo y las artes, la vida me guió hacia la gastronomía japonesa, donde descubrí que el lienzo puede ser un plato y el pincel, un cuchillo.",
  "Tras emigrar de Venezuela y continuar mi crecimiento profesional en Europa, este restaurante nace como un espacio de libertad absoluta, sin restricciones creativas.",
  "Michi es el resultado de ese recorrido, una propuesta honesta donde plasmo los sabores que me han marcado en ambos lados del atlántico. La técnica tradicional se fusiona con mi propia visión, movida siempre por la pasión a lo que hago.",
  "Gracias por acompañarme en este tramo del camino. Disfruta la experiencia.",
];

export const ABOUT_SIGNATURE = "Milo Márquez / Chef y creador de Michi.";

export const ABOUT_IMAGE_SRC = "/images/Foto Milo.webp";

export const ABOUT_SIGNATURE_IMAGE_SRC = "/images/firma-milo.webp";

export const ABOUT_SIGNATURE_IMAGE_ALT = ABOUT_SIGNATURE;

export const ABOUT_SIGNATURE_IMAGE_WIDTH = 1264;

export const ABOUT_SIGNATURE_IMAGE_HEIGHT = 385;

export function buildAboutImageUrl(rawSrc: string = ABOUT_IMAGE_SRC): string {
  const decoded = rawSrc.includes("%20")
    ? rawSrc.replaceAll("%20", " ")
    : rawSrc;
  return encodeURI(decoded);
}

export function buildAboutSignatureUrl(
  rawSrc: string = ABOUT_SIGNATURE_IMAGE_SRC,
): string {
  const decoded = rawSrc.includes("%20")
    ? rawSrc.replaceAll("%20", " ")
    : rawSrc;
  return encodeURI(decoded);
}

export function getAboutParagraphs(): string[] {
  return [...ABOUT_PARAGRAPHS];
}
