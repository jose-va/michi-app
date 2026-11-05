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

export const NO_SHOW_GRACE_MINUTES = 30;

export const NO_SHOW_CANCEL_BATCH_SIZE = 5;

const START_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const NO_SHOW_TIME_ZONE = "Europe/Madrid";

function madridWallToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): number | null {
  const wallMs = Date.UTC(year, month - 1, day, hour, minute);
  if (Number.isNaN(wallMs)) {
    return null;
  }
  let guess = wallMs;
  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: NO_SHOW_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(guess));
    const get = (type: string): string =>
      parts.find((part) => part.type === type)?.value ?? "";
    const wallOfGuess = Date.UTC(
      Number(get("year")),
      Number(get("month")) - 1,
      Number(get("day")),
      Number(get("hour")) % 24,
      Number(get("minute")),
    );
    if (Number.isNaN(wallOfGuess)) {
      return null;
    }
    const next = guess + (wallMs - wallOfGuess);
    if (next === guess) {
      return guess;
    }
    guess = next;
  }
  return guess;
}

export function isNoShowExpired(
  date: string,
  startTime: string,
  now: Date = new Date(),
): boolean {
  const parts = parseDateKeyParts(date);
  const time = START_TIME_PATTERN.exec(startTime);
  if (parts === null || time === null) {
    return false;
  }
  const startUtcMs = madridWallToUtcMs(
    parts.year,
    parts.month,
    parts.day,
    Number(time[1]),
    Number(time[2]),
  );
  if (startUtcMs === null) {
    return false;
  }
  return (
    now.getTime() - startUtcMs >= NO_SHOW_GRACE_MINUTES * 60 * 1000
  );
}

export type AutoCancelNoShowsResult = {
  reservations: Reservation[];
  attempted: number;
  cancelled: number;
  failed: number;
};

export async function autoCancelNoShows(
  reservations: Reservation[],
  cancel: (id: string) => Promise<unknown>,
  now: Date = new Date(),
  batchSize: number = NO_SHOW_CANCEL_BATCH_SIZE,
): Promise<AutoCancelNoShowsResult> {
  const candidateIndexes: number[] = [];
  reservations.forEach((reservation, index) => {
    if (
      reservation.state !== "CANCELLED" &&
      typeof reservation.id === "string" &&
      reservation.id.length > 0 &&
      isNoShowExpired(reservation.date, reservation.startTime, now)
    ) {
      candidateIndexes.push(index);
    }
  });
  const attempted = candidateIndexes.length;
  if (attempted === 0) {
    return { reservations, attempted: 0, cancelled: 0, failed: 0 };
  }
  const size =
    Number.isInteger(batchSize) && batchSize > 0
      ? batchSize
      : NO_SHOW_CANCEL_BATCH_SIZE;
  const cancelledIds = new Set<string>();
  for (let i = 0; i < candidateIndexes.length; i += size) {
    const batch = candidateIndexes.slice(i, i + size);
    const results = await Promise.allSettled(
      batch.map((index) => {
        const id = reservations[index]?.id;
        return cancel(id as string);
      }),
    );
    results.forEach((result, position) => {
      if (result.status === "fulfilled" && result.value !== false) {
        const id = reservations[batch[position] as number]?.id;
        if (typeof id === "string") {
          cancelledIds.add(id);
        }
      }
    });
  }
  const cancelled = cancelledIds.size;
  const failed = attempted - cancelled;
  if (cancelled === 0) {
    return { reservations, attempted, cancelled: 0, failed };
  }
  const updated = reservations.map((reservation) =>
    typeof reservation.id === "string" && cancelledIds.has(reservation.id)
      ? { ...reservation, state: "CANCELLED" }
      : reservation,
  );
  return { reservations: updated, attempted, cancelled, failed };
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
