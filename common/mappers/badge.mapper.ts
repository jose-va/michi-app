const categoryBadges = new Map<string, string>([
  ["HOT_STARTERS", "bg-red-950 text-red-300"],
  ["FRESH_STARTERS", "bg-emerald-950 text-emerald-300"],
  ["HOT_DISHES", "bg-orange-950 text-orange-300"],
  ["SOGIZUKURI", "bg-blue-950 text-blue-300"],
  ["NIGIRI_SUSHI", "bg-violet-950 text-violet-300"],
  ["GUNKAN_SUSHI", "bg-amber-950 text-amber-300"],
  ["ZUKE_DON", "bg-sky-950 text-sky-300"],
  ["TEMAKI", "bg-orange-900 text-orange-200"],
  ["HOSOMAKI", "bg-lime-950 text-lime-300"],
  ["KATSUMAKI", "bg-yellow-900 text-yellow-200"],
  ["URAMAKI", "bg-pink-800 text-pink-100"],
  ["FUTOMAKI", "bg-teal-950 text-teal-300"],
  ["HOT_MAKI", "bg-rose-950 text-rose-300"],
  ["SPECIAL_MAKI", "bg-purple-950 text-purple-300"],
  ["COMBOS", "bg-cyan-800 text-cyan-100"],
  ["DESSERTS", "bg-fuchsia-950 text-fuchsia-300"],
]);

export function getCategoryBadge(category: string): string {
  return categoryBadges.get(category) ?? "dark:bg-white dark:text-black";
}
