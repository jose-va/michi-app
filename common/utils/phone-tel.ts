export function buildTelHref(phone: string | null | undefined): string {
  const raw = typeof phone === "string" ? phone : "";
  const sanitized = raw.replace(/[^+\d]/g, "");
  return `tel:${sanitized}`;
}
