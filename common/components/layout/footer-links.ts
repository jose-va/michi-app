import { CONFIRMED_SCHEDULE } from "@/common/utils/home-content";

export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_SECTIONS: FooterLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/about" },
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicación", href: "/location" },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de cookies", href: "/cookies" },
];

export interface FooterScheduleRow {
  days: string;
  hours: string;
}

export interface FooterSchedule {
  title: string;
  rows: FooterScheduleRow[];
}

export const FOOTER_SCHEDULE: FooterSchedule = {
  title: "Horario de Apertura",
  rows: [
    {
      days: CONFIRMED_SCHEDULE.weekdays.days,
      hours: CONFIRMED_SCHEDULE.weekdays.hours.join(" y "),
    },
    {
      days: CONFIRMED_SCHEDULE.sunday.days,
      hours: CONFIRMED_SCHEDULE.sunday.status,
    },
  ],
};

export const FOOTER_SCHEDULE_EMPTY_TEXT =
  "Horario pendiente de confirmación";

export function getFooterYear(now: Date = new Date()): number {
  return now.getFullYear();
}

function normalizeFooterPath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function isCurrentFooterLink(href: string, pathname: string): boolean {
  return normalizeFooterPath(href) === normalizeFooterPath(pathname);
}
