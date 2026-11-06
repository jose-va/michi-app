import { getCompactScheduleRows } from "@/common/utils/home-content";

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
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Cookies", href: "/cookies" },
];

export interface FooterContactItem {
  label: string;
  href: string;
  display?: string;
  external?: boolean;
  icon: "phone" | "whatsapp" | "instagram" | "mail";
}

export const FOOTER_CONTACT_TITLE = "Contacto";

export const FOOTER_CONTACT: FooterContactItem[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/michisushigranada",
    external: true,
    icon: "instagram",
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=34673821148",
    external: true,
    icon: "whatsapp",
  },
  {
    label: "Teléfono",
    href: "tel:+34673821148",
    display: "673 821 148",
    icon: "phone",
  },
  {
    label: "Correo",
    href: "mailto:michisushigranada@gmail.com",
    display: "michisushigranada@gmail.com",
    icon: "mail",
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
  rows: getCompactScheduleRows(),
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
