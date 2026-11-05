import assert from "node:assert/strict";
import { test } from "node:test";
import type { Reservation } from "../common/types/reservation.types";
import {
  NO_SHOW_CANCEL_BATCH_SIZE,
  autoCancelNoShows,
} from "../common/utils/reservation-day";

function madridWallToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
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

const NOW = madridWallToUtc(2026, 11, 5, 14, 0);

function makeReservation(overrides: Partial<Reservation> = {}): Reservation {
  return {
    date: "2026-11-05",
    guests: 2,
    location: "INSIDE",
    startTime: "13:00",
    name: "Cliente",
    phone: "600123456",
    email: null,
    observations: null,
    user: null,
    ...overrides,
  };
}

test("solo cancela las caducadas con state distinto de CANCELLED (CONFIRMED y null)", async () => {
  const past1 = makeReservation({ id: "a", state: "CONFIRMED" });
  const past2 = makeReservation({ id: "b", state: null });
  const reservations = [past1, past2];
  const called: string[] = [];
  const result = await autoCancelNoShows(
    reservations,
    async (id) => {
      called.push(id);
      return true;
    },
    NOW,
  );
  assert.deepEqual(called.sort(), ["a", "b"]);
  assert.equal(result.attempted, 2);
  assert.equal(result.cancelled, 2);
  assert.equal(result.failed, 0);
  assert.equal(result.reservations[0]?.state, "CANCELLED");
  assert.equal(result.reservations[1]?.state, "CANCELLED");
});

test("ignora futuras y ya CANCELLED", async () => {
  const future = makeReservation({
    id: "f",
    state: "CONFIRMED",
    startTime: "20:00",
  });
  const cancelled = makeReservation({ id: "c", state: "CANCELLED" });
  const reservations = [future, cancelled];
  let calls = 0;
  const result = await autoCancelNoShows(
    reservations,
    async () => {
      calls += 1;
      return true;
    },
    NOW,
  );
  assert.equal(calls, 0);
  assert.equal(result.attempted, 0);
  assert.equal(result.cancelled, 0);
  assert.equal(result.failed, 0);
  assert.equal(result.reservations[0]?.state, "CONFIRMED");
  assert.equal(result.reservations[1]?.state, "CANCELLED");
});

test("excluye reservas sin id", async () => {
  const noId = makeReservation({ state: "CONFIRMED" });
  delete noId.id;
  const emptyId = makeReservation({ id: "", state: "CONFIRMED" });
  const reservations = [noId, emptyId];
  let calls = 0;
  const result = await autoCancelNoShows(
    reservations,
    async () => {
      calls += 1;
      return true;
    },
    NOW,
  );
  assert.equal(calls, 0);
  assert.equal(result.attempted, 0);
  assert.ok(!("state" in result.reservations[0]) || result.reservations[0]?.state !== "CANCELLED");
});

test("un fallo (excepción o false) no detiene al resto ni marca la reserva", async () => {
  const ok1 = makeReservation({ id: "ok1", state: "CONFIRMED" });
  const boom = makeReservation({ id: "boom", state: "CONFIRMED" });
  const nope = makeReservation({ id: "nope", state: "CONFIRMED" });
  const ok2 = makeReservation({ id: "ok2", state: "CONFIRMED" });
  const reservations = [ok1, boom, nope, ok2];
  const result = await autoCancelNoShows(
    reservations,
    async (id) => {
      if (id === "boom") throw new Error("red caída");
      if (id === "nope") return false;
      return true;
    },
    NOW,
  );
  assert.equal(result.attempted, 4);
  assert.equal(result.cancelled, 2);
  assert.equal(result.failed, 2);
  assert.equal(result.reservations[0]?.state, "CANCELLED");
  assert.equal(result.reservations[1]?.state, "CONFIRMED");
  assert.equal(result.reservations[2]?.state, "CONFIRMED");
  assert.equal(result.reservations[3]?.state, "CANCELLED");
});

test("lotes: máximo NO_SHOW_CANCEL_BATCH_SIZE cancelaciones en vuelo", async () => {
  assert.equal(NO_SHOW_CANCEL_BATCH_SIZE, 5);
  const reservations = Array.from({ length: 12 }, (_, i) =>
    makeReservation({ id: `r${i}`, name: `Cliente ${i}`, state: "CONFIRMED" }),
  );
  let inFlight = 0;
  let maxInFlight = 0;
  const result = await autoCancelNoShows(
    reservations,
    async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight -= 1;
      return true;
    },
    NOW,
  );
  assert.ok(maxInFlight <= NO_SHOW_CANCEL_BATCH_SIZE);
  assert.ok(maxInFlight > 1);
  assert.equal(result.attempted, 12);
  assert.equal(result.cancelled, 12);
  assert.equal(result.failed, 0);
});

test("sin candidatas: no llama a cancel y conserva el orden", async () => {
  const future = makeReservation({
    id: "f",
    name: "Futura",
    state: "CONFIRMED",
    startTime: "20:00",
  });
  const cancelled = makeReservation({
    id: "c",
    name: "Vieja",
    state: "CANCELLED",
  });
  const reservations = [future, cancelled];
  let calls = 0;
  const result = await autoCancelNoShows(
    reservations,
    async () => {
      calls += 1;
      return true;
    },
    NOW,
  );
  assert.equal(calls, 0);
  assert.deepEqual(
    result.reservations.map((r) => r.id),
    ["f", "c"],
  );
  assert.deepEqual(result, {
    reservations: result.reservations,
    attempted: 0,
    cancelled: 0,
    failed: 0,
  });
});
