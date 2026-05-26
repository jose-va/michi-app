const allergenInfo = new Map<string, { title: string; icon: string }>([
  ["FISH", { title: "Pescado", icon: "/icons/fish.svg" }],
  ["EGGS", { title: "Huevos", icon: "/icons/eggs.svg" }],
  ["CRUSTACEANS", { title: "Crustáceos", icon: "/icons/crustaceans.svg" }],
  ["GLUTEN", { title: "Glúten", icon: "/icons/gluten.svg" }],
  ["MUSTARD", { title: "Mostaza", icon: "/icons/mustard.svg" }],
  ["MOLLUSCS", { title: "Moluscos", icon: "/icons/molluscs.svg" }],
  ["SESAME_SEEDS", { title: "Sésamo", icon: "/icons/sesame_seeds.svg" }],
  ["LUPINS", { title: "Altramuz", icon: "/icons/lupins.svg" }],
  ["PEANUTS", { title: "Cacahuetes", icon: "/icons/peanuts.svg" }],
  ["MILK", { title: "Lácteos", icon: "/icons/milk.svg" }],
  ["CELERY", { title: "Apio", icon: "/icons/celery.svg" }],
  ["SULPHUR_DIOXIDE", { title: "Sulfitos", icon: "/icons/sulphur_dioxide.svg" }],
  ["SOYBEANS", { title: "Soja", icon: "/icons/soybeans.svg" }],
  ["NUTS", { title: "Frutos cáscara", icon: "/icons/nuts.svg" }],
]);

export function getAllergenIcon(allergen: string): string {
  const info = allergenInfo.get(allergen);
  return info ? info.icon : "";
}

export function getAllergenTitle(allergen: string): string {
  const info = allergenInfo.get(allergen);
  return info ? info.title : allergen;
}

export const allergens = [...allergenInfo.keys()];
