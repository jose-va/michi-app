import assert from "node:assert/strict";
import { test } from "node:test";
import { isNoShowExpired } from "../common/utils/reservation-day";

function madridWallToUtc(year: number, month: number, day: number, hour: number, minute: number): Date {
  const wallMs = Date.UTC(year, month - 1, day, hour, minute);
  let guess = wallMs;
  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Madrid",
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
    guess += wallMs - wallOfGuess;
  }
  return new Date(guess);
}

test("isNoShowExpired: 29 minutos no expira, 30 y 31 sí", () => {
  const start = madridWallToUtc(2026, 11, 5, 13, 0);
  const at29 = new Date(start.getTime() + 29 * 60 * 1000);
  const at30 = new Date(start.getTime() + 30 * 60 * 1000);
  const at31 = new Date(start.getTime() + 31 * 60 * 1000);
  assert.equal(isNoShowExpired("2026-11-05", "13:00", at29), false);
  assert.equal(isNoShowExpired("2026-11-05", "13:00", at30), true);
  assert.equal(isNoShowExpired("2026-11-05", "13:00", at31), true);
});

test("isNoShowExpired: fecha futura no expira", () => {
  const now = madridWallToUtc(2026, 11, 5, 13, 0);
  assert.equal(isNoShowExpired("2026-11-06", "13:00", now), false);
  assert.equal(isNoShowExpired("2026-11-05", "20:00", now), false);
});

test("isNoShowExpired: fecha pasada expira", () => {
  const now = madridWallToUtc(2026, 11, 5, 13, 0);
  assert.equal(isNoShowExpired("2026-11-04", "20:00", now), true);
});

test("isNoShowExpired: formato inválido no expira", () => {
  const now = madridWallToUtc(2026, 11, 5, 13, 0);
  assert.equal(isNoShowExpired("2026-13-40", "13:00", now), false);
  assert.equal(isNoShowExpired("2026-11-05", "25:99", now), false);
  assert.equal(isNoShowExpired("2026-11-05", "", now), false);
});
