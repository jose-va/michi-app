import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { ReservationService } from "../service/ReservationService";
import { UserService } from "../service/UserService";
import * as reservationDay from "../common/utils/reservation-day";

// /feature fecha-reserva: la fecha se formatea en cliente como `yyyy-MM-dd`
// con los componentes locales del Date; el servidor (UTC en Vercel) ya no
// formatea un Date y, por tanto, no desplaza el día.
const { toReservationDateKey, isReservationDateKey } = reservationDay as unknown as {
  toReservationDateKey: (date: Date) => string;
  isReservationDateKey: (value: unknown) => value is string;
};

test("toReservationDateKey usa el día local del calendario", () => {
  assert.equal(typeof toReservationDateKey, "function");
  assert.equal(toReservationDateKey(new Date(2026, 11, 12)), "2026-12-12");
});

test("toReservationDateKey en límites de mes y año", () => {
  assert.equal(toReservationDateKey(new Date(2026, 10, 30)), "2026-11-30");
  assert.equal(toReservationDateKey(new Date(2026, 1, 28)), "2026-02-28");
  assert.equal(toReservationDateKey(new Date(2026, 11, 31)), "2026-12-31");
  assert.equal(toReservationDateKey(new Date(2027, 0, 1)), "2027-01-01");
});

test("toReservationDateKey en días de cambio de hora", () => {
  assert.equal(toReservationDateKey(new Date(2026, 2, 29)), "2026-03-29");
  assert.equal(toReservationDateKey(new Date(2026, 9, 25)), "2026-10-25");
});

test("isReservationDateKey acepta solo yyyy-MM-dd en string", () => {
  assert.equal(typeof isReservationDateKey, "function");
  assert.equal(isReservationDateKey("2026-12-12"), true);
  for (const value of [
    "",
    "2026-1-5",
    "12/12/2026",
    "2026-12-12T00:00:00Z",
    new Date(2026, 11, 12),
    undefined,
    null,
    20261212,
  ]) {
    assert.equal(isReservationDateKey(value), false, `debe rechazar ${String(value)}`);
  }
});

async function loadActions() {
  return import("../lib/server-actions");
}

const baseValues = {
  guests: "2",
  location: "INSIDE" as const,
  startTime: "21:00",
  name: "Cliente Prueba",
  phone: "600123123",
  email: "",
  observations: "",
};

test("createReservation no re-formatea la fecha en el servidor", () => {
  const source = readFileSync(
    new URL("../lib/server-actions.ts", import.meta.url),
    "utf8",
  );
  const start = source.indexOf("export async function createReservation(");
  const end = source.indexOf("export async function", start + 1);
  const body = source.slice(start, end);
  assert.ok(start >= 0, "debe existir createReservation");
  assert.ok(
    !body.includes("format(data.date"),
    "no debe formatear un Date en el servidor (UTC desplaza el día)",
  );
  assert.ok(body.includes("isReservationDateKey(data.date)"));
});

test("createReservation envía la fecha recibida tal cual al backend", async () => {
  const { createReservation } = await loadActions();
  const create = mock.method(
    ReservationService,
    "createReservation",
    async () => ({ ok: false as const, error: "NO_TABLES" as const }),
  );
  const getProfile = mock.method(UserService, "getProfile", async () => null);
  try {
    await createReservation({ ...baseValues, date: "2026-12-12" });
    assert.equal(create.mock.callCount(), 1);
    const payload = create.mock.calls[0].arguments[0] as { date: unknown };
    assert.equal(payload.date, "2026-12-12");
    assert.ok(JSON.stringify(payload).includes('"date":"2026-12-12"'));
  } finally {
    create.mock.restore();
    getProfile.mock.restore();
  }
});

test("createReservation con fecha inválida no llama al backend", async () => {
  const { createReservation } = await loadActions();
  const create = mock.method(
    ReservationService,
    "createReservation",
    async () => ({ ok: false as const, error: "NO_TABLES" as const }),
  );
  const getProfile = mock.method(UserService, "getProfile", async () => null);
  try {
    for (const date of ["", "12/12/2026", new Date(2026, 11, 12)]) {
      const result = await createReservation({
        ...baseValues,
        date: date as unknown as string,
      });
      assert.deepEqual(result, { ok: false, error: "UNKNOWN" });
    }
    assert.equal(create.mock.callCount(), 0);
  } finally {
    create.mock.restore();
    getProfile.mock.restore();
  }
});
