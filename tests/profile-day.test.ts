import assert from "node:assert/strict";
import { test } from "node:test";
import { getTodayKey } from "../common/utils/profile-day";

test("devuelve yyyy-MM-dd del día natural en Europe/Madrid", () => {
  const now = new Date("2026-10-23T10:00:00Z");
  assert.equal(getTodayKey(now, "Europe/Madrid"), "2026-10-23");
});

test("a las 00:30 en Madrid sigue siendo el día correcto aunque en UTC sea el anterior", () => {
  const now = new Date("2026-10-22T22:30:00Z");
  assert.equal(getTodayKey(now, "Europe/Madrid"), "2026-10-23");
});

test("a las 23:30 en Madrid sigue siendo el mismo día aunque en UTC sea el siguiente", () => {
  const now = new Date("2026-10-22T21:30:00Z");
  assert.equal(getTodayKey(now, "Europe/Madrid"), "2026-10-22");
});
