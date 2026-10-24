import assert from "node:assert/strict";
import { test } from "node:test";
import type { Reservation } from "../common/types/reservation.types";
import { selectActiveReservation } from "../common/utils/profile-reservations";

function makeReservation(
  overrides: Partial<Reservation> = {},
): Reservation {
  return {
    date: "2026-10-23",
    guests: 2,
    location: "INSIDE",
    startTime: "20:00",
    name: "Titular",
    phone: "600123123",
    email: "titular@example.com",
    observations: null,
    user: "user-1",
    ...overrides,
  };
}

test("filtra por user igual al id del usuario", () => {
  const mine = makeReservation({ startTime: "20:00", user: "user-1" });
  const other = makeReservation({ startTime: "22:00", user: "user-2" });
  assert.equal(selectActiveReservation([other, mine], "user-1"), mine);
});

test("con varias reservas elige la de startTime más tardía", () => {
  const early = makeReservation({ startTime: "19:00" });
  const late = makeReservation({ startTime: "21:30" });
  assert.equal(selectActiveReservation([early, late], "user-1"), late);
});

test("a igualdad de fecha y hora elige la primera del filtrado", () => {
  const first = makeReservation({ startTime: "20:00", name: "Primera" });
  const second = makeReservation({ startTime: "20:00", name: "Segunda" });
  assert.equal(selectActiveReservation([first, second], "user-1"), first);
});

test("sin reserva del usuario devuelve null", () => {
  const other = makeReservation({ user: "user-2" });
  assert.equal(selectActiveReservation([other], "user-1"), null);
  assert.equal(selectActiveReservation([], "user-1"), null);
});

test("reservas con email u observations nulos no rompen la selección", () => {
  const withNulls = makeReservation({
    startTime: "21:00",
    email: null,
    observations: null,
  });
  const plain = makeReservation({ startTime: "20:00" });
  assert.equal(
    selectActiveReservation([plain, withNulls], "user-1"),
    withNulls,
  );
});

test("user nulo o vacío nunca coincide, ni con userId vacío", () => {
  const nullUser = makeReservation({ user: null });
  assert.equal(selectActiveReservation([nullUser], "user-1"), null);
  const emptyUser = makeReservation({
    user: "" as unknown as Reservation["user"],
  });
  assert.equal(selectActiveReservation([emptyUser], "user-1"), null);
  assert.equal(selectActiveReservation([emptyUser], ""), null);
  const mine = makeReservation({ startTime: "20:00", user: "user-1" });
  assert.equal(selectActiveReservation([mine], ""), null);
});
