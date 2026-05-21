const categoryInfo = new Map<string, { title: string; description: string }>([
  ["HOT_STARTERS", { title: "Entrantes calientes", description: "Para empezar, algo calentito." }],
  ["FRESH_STARTERS", { title: "Entrantes fríos", description: "Ensaladas y entrantes fríos." }],
  ["HOT_DISHES", { title: "Platos calientes", description: "Nuestras raciones de fideos y de arroz." }],
  ["SOGIZUKURI", { title: "Sogizukuri", description: "Cortes de pescado estilo nigiri, realza la textura y suavidad del pescado." }],
  ["NIGIRI_SUSHI", { title: "Nigiri sushi", description: "Bolita de arroz coronada con cortes de pescado." }],
  ["GUNKAN_SUSHI", { title: "Gunkan sushi", description: "Bolita de arroz envuelta en alga nori con toppings variados." }],
  ["ZUKE_DON", { title: "Zuke don", description: "Bol de arroz con cortes de pescado marinado en salsa especial." }],
  ["TEMAKI", { title: "Temaki", description: "Cono de alga nori relleno de arroz y cortes de pescado." }],
  ["HOSOMAKI", { title: "Hosomaki", description: "Rollo de sushi elaborado de arroz, envuelto en alga nori y un solo ingrediente en el interior." }],
  ["KATSUMAKI", { title: "Katsumaki", description: "Versión rebozada en panko y frita del hosomaki tradicional." }],
  ["URAMAKI", { title: "Uramaki", description: "Rollo de sushi con el arroz por fuera y rellenos de toppings variados." }],
  ["FUTOMAKI", { title: "Futomaki", description: "Versión más generosa del sushi tradicional con piezas de mayor tamaño y toppings variados en su interior." }],
  ["HOT_MAKI", { title: "Maki caliente", description: "Selección de rollos de sushi rebozados en panko y fritos." }],
  ["SPECIAL_MAKI", { title: "Maki especial", description: "Rollos de sushi nacidos de la creatividad del chef, algunos con esencia nipona y corazón venezolano." }],
  ["COMBOS", { title: "Combinados", description: "Una selección de nuestras piezas más representativas, pensada para compartir, descubrir y disfrutar sin complicaciones." }],
  ["DESSERTS", { title: "Postres", description: "Nuestra selección de postres." }],
]);

export function getCategoryTitle(category: string): string {
  return categoryInfo.get(category)?.title ?? category;
}

export function getCategoryDescription(category: string): string {
  return categoryInfo.get(category)?.description ?? "";
}

export const categories = [...categoryInfo.keys()];