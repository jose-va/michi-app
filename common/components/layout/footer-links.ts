import { CONFIRMED_SCHEDULE } from "@/common/utils/home-content";

export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_SECTIONS: FooterLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Carta", href: "/product" },
  { label: "Reservar", href: "/reservation" },
  { label: "Ubicación", href: "/location" },
  { label: "Conócenos", href: "/about" },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Cookies", href: "/cookies" },
];

export interface FooterContactItem {
  label: string;
  href: string;
  display?: string;
  external?: boolean;
}

export const FOOTER_CONTACT_TITLE = "Contacto";

export const FOOTER_CONTACT: FooterContactItem[] = [
  {
    label: "Teléfono",
    href: "tel:+34673821148",
    display: "673 821 148",
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=34673821148",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/michisushigranada",
    external: true,
  },
  {
    label: "Correo",
    href: "mailto:michisushigranada@gmail.com",
    display: "michisushigranada@gmail.com",
  },
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
      days: CONFIRMED_SCHEDULE.monday.days,
      hours: CONFIRMED_SCHEDULE.monday.hours.join(" y "),
    },
    {
      days: CONFIRMED_SCHEDULE.tuesdayToSaturday.days,
      hours: CONFIRMED_SCHEDULE.tuesdayToSaturday.hours.join(" y "),
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
