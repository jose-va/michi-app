export function formatPriceES(price: number): string | null {
  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }
  return `${price.toFixed(2).replace(".", ",")} €`;
}
