import type { Reservation } from "@/common/types/reservation.types";

export { getTodayKey } from "@/common/utils/profile-day";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDateKeyParts(dateKey: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const match = DATE_KEY_PATTERN.exec(dateKey);
  if (match === null) {
    return null;
  }
  const year = Number(dateKey.slice(0, 4));
  const month = Number(dateKey.slice(5, 7));
  const day = Number(dateKey.slice(8, 10));
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function isValidDateKey(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const parts = parseDateKeyParts(value);
  if (parts === null) {
    return false;
  }
  const { year, month, day } = parts;
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > daysInMonth(year, month)) {
    return false;
  }
  return true;
}

export function resolveSelectedDateKey(raw: unknown, todayKey: string): string {
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first !== "string" || !isValidDateKey(first)) {
    return todayKey;
  }
  if (first < todayKey) {
    return todayKey;
  }
  return first;
}

export function dateToDateKey(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${padTwoDigits(month)}-${padTwoDigits(day)}`;
}

export function dateKeyToDate(key: string): Date {
  if (!isValidDateKey(key)) {
    throw new Error(`Clave de fecha no válida: ${key}`);
  }
  const parts = parseDateKeyParts(key);
  if (parts === null) {
    throw new Error(`Clave de fecha no válida: ${key}`);
  }
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
}

export function isPastKey(key: string, todayKey: string): boolean {
  return key < todayKey;
}

export function isSundayKey(key: string): boolean {
  const noonUtc = dateKeyToDate(key);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
  }).format(noonUtc);
  return weekday === "Sun";
}

export function nextOpenKey(key: string): string {
  const next = shiftDateKey(key, 1);
  if (isSundayKey(next)) {
    return shiftDateKey(next, 1);
  }
  return next;
}

export function prevOpenKey(key: string): string {
  const prev = shiftDateKey(key, -1);
  if (isSundayKey(prev)) {
    return shiftDateKey(prev, -1);
  }
  return prev;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const parts = parseDateKeyParts(dateKey);
  if (parts === null) {
    throw new Error(`Clave de fecha no válida: ${dateKey}`);
  }
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${String(year).padStart(4, "0")}-${padTwoDigits(month)}-${padTwoDigits(day)}`;
}

function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDayLabel(dateKey: string): string {
  const parts = parseDateKeyParts(dateKey);
  if (parts === null) {
    throw new Error(`Clave de fecha no válida: ${dateKey}`);
  }
  const noonUtc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  const formatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedParts = formatter.formatToParts(noonUtc);
  const get = (type: string): string =>
    formattedParts.find((part) => part.type === type)?.value ?? "";
  const weekday = capitalizeFirstLetter(get("weekday"));
  const day = get("day");
  const month = get("month");
  return `${weekday}, ${day} de ${month}`;
}

export function sortReservationsByTimeAndName(items: Reservation[]): Reservation[] {
  return [...items].sort((a, b) => {
    const aCancelled = a.state === "CANCELLED" ? 1 : 0;
    const bCancelled = b.state === "CANCELLED" ? 1 : 0;
    if (aCancelled !== bCancelled) {
      return aCancelled - bCancelled;
    }
    if (a.startTime !== b.startTime) {
      return a.startTime < b.startTime ? -1 : 1;
    }
    if (a.name !== b.name) {
      return a.name < b.name ? -1 : 1;
    }
    return 0;
  });
}

export function groupReservationsByShift(items: Reservation[]): {
  lunch: Reservation[];
  dinner: Reservation[];
} {
  const lunch: Reservation[] = [];
  const dinner: Reservation[] = [];
  for (const item of items) {
    if (item.startTime < "18:00") {
      lunch.push(item);
    } else {
      dinner.push(item);
    }
  }
  return { lunch, dinner };
}
