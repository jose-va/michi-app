import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEditInitialValues } from "../common/utils/reservation-edit";
import type { Reservation } from "../common/types/reservation.types";

const HOY = new Date(2026, 9, 28, 12, 0, 0, 0);

const profile = {
  id: "user-1",
  name: "Actual Usuario",
  email: "actual@example.com",
};

function reservationFixture(
  overrides: Partial<Reservation> = {},
): Reservation {
  return {
    id: "r-1",
    date: "2026-11-05",
    guests: 2,
    location: "INSIDE",
    startTime: "21:00",
    name: "Antiguo Nombre",
    phone: "600123123",
    email: "antiguo@example.com",
    observations: "Trona para el peque",
    user: "user-1",
    state: "CONFIRMED",
    ...overrides,
  };
}

// RF-2: día y comensales de la reserva ya seleccionados.
test("precarga el día y los comensales de la reserva", () => {
  const values = buildEditInitialValues(
    reservationFixture(),
    profile,
    HOY,
  );
  assert.deepEqual(values.date, new Date(2026, 10, 5, 12, 0, 0, 0));
  assert.equal(values.guests, "2");
});

// RF-2: día nulo → sin preselección y el resto con normalidad.
test("día nulo deja la fecha sin preselección y carga el resto", () => {
  const values = buildEditInitialValues(
    reservationFixture({ date: null as never }),
    profile,
    HOY,
  );
  assert.equal(values.date, null);
  assert.equal(values.guests, "2");
  assert.equal(values.phone, "600123123");
  assert.equal(values.observations, "Trona para el peque");
  assert.equal(values.name, "Actual Usuario");
  assert.equal(values.email, "actual@example.com");
});

// RF-2: día no válido → sin preselección.
test("día no válido deja la fecha sin preselección", () => {
  for (const date of ["hola", "", "2026-02-30", "2026-13-01", "05/11/2026"]) {
    const values = buildEditInitialValues(
      reservationFixture({ date: date as string }),
      profile,
      HOY,
    );
    assert.equal(values.date, null, `fecha «${date}» sin preselección`);
  }
});

// RF-2: comensales nulos o no válidos → sin preselección y resto normal.
test("comensales nulos o no válidos dejan el campo sin preselección", () => {
  for (const guests of [null, 0, -1, 13, 2.5]) {
    const values = buildEditInitialValues(
      reservationFixture({ guests: guests as never }),
      profile,
      HOY,
    );
    assert.equal(values.guests, "", `comensales «${guests}» sin preselección`);
    assert.deepEqual(values.date, new Date(2026, 10, 5, 12, 0, 0, 0));
  }
});

// RF-2: límites válidos de comensales (1 y 12) se preseleccionan.
test("comensales en los límites válidos se preseleccionan", () => {
  assert.equal(
    buildEditInitialValues(reservationFixture({ guests: 1 }), profile, HOY)
      .guests,
    "1",
  );
  assert.equal(
    buildEditInitialValues(reservationFixture({ guests: 12 }), profile, HOY)
      .guests,
    "12",
  );
});

// RF-2 + RF-14: una fecha pasada válida se precarga igual (sin bloqueo).
test("una fecha pasada válida se precarga sin bloquear", () => {
  const values = buildEditInitialValues(
    reservationFixture({ date: "2020-05-06" }),
    profile,
    HOY,
  );
  assert.deepEqual(values.date, new Date(2020, 4, 6, 12, 0, 0, 0));
  assert.equal(values.guests, "2");
});

// RF-3: el teléfono se muestra desde la reserva.
test("muestra el teléfono guardado en la reserva", () => {
  const values = buildEditInitialValues(
    reservationFixture({ phone: "611222333" }),
    profile,
    HOY,
  );
  assert.equal(values.phone, "611222333");
});

// RF-3: sin teléfono (nulo o vacío) → campo vacío y editable.
test("sin teléfono presenta el campo vacío", () => {
  for (const phone of [null, "", "   "]) {
    const values = buildEditInitialValues(
      reservationFixture({ phone: phone as never }),
      profile,
      HOY,
    );
    assert.equal(values.phone, "", `teléfono «${phone}» → vacío`);
  }
});

// RF-21: las observaciones se muestran desde la reserva.
test("muestra las observaciones guardadas en la reserva", () => {
  const values = buildEditInitialValues(
    reservationFixture({ observations: "Sin gluten" }),
    profile,
    HOY,
  );
  assert.equal(values.observations, "Sin gluten");
});

// RF-21: sin observaciones → vacío y editable.
test("sin observaciones presenta el campo vacío", () => {
  const values = buildEditInitialValues(
    reservationFixture({ observations: null }),
    profile,
    HOY,
  );
  assert.equal(values.observations, "");
});

// RF-4: el resto de datos personales sale del usuario actual,
// aunque la reserva guarde otros (prevalece la información actual).
test("autorrellena nombre y correo desde el usuario actual", () => {
  const values = buildEditInitialValues(
    reservationFixture({
      name: "Antiguo Nombre",
      email: "antiguo@example.com",
    }),
    profile,
    HOY,
  );
  assert.equal(values.name, "Actual Usuario");
  assert.equal(values.email, "actual@example.com");
});

// RF-4: sin perfil → nombre y correo vacíos.
test("sin perfil deja nombre y correo vacíos", () => {
  const values = buildEditInitialValues(
    reservationFixture(),
    null,
    HOY,
  );
  assert.equal(values.name, "");
  assert.equal(values.email, "");
});

// RF-24: un admin que edita una reserva ajena ve los datos del propietario.
test("un admin ve los datos del propietario en una reserva ajena", () => {
  const admin = { id: "admin-9", name: "Admin", email: "admin@example.com" };
  const values = buildEditInitialValues(
    reservationFixture({
      user: "user-1",
      name: "Propietaria Original",
      email: "propietaria@example.com",
    }),
    admin,
    HOY,
    true,
  );
  assert.equal(values.name, "Propietaria Original");
  assert.equal(values.email, "propietaria@example.com");
  assert.equal(values.phone, "600123123");
  assert.equal(values.observations, "Trona para el peque");
});

// RF-24: un admin que edita una reserva anónima ve los datos guardados.
test("un admin ve los datos guardados en una reserva anónima", () => {
  const admin = { id: "admin-9", name: "Admin", email: "admin@example.com" };
  const values = buildEditInitialValues(
    reservationFixture({ user: null }),
    admin,
    HOY,
    true,
  );
  assert.equal(values.name, "Antiguo Nombre");
  assert.equal(values.email, "antiguo@example.com");
});

// RF-4: un admin que edita su propia reserva ve sus datos actuales.
test("un admin en su propia reserva ve sus datos actuales", () => {
  const admin = { id: "admin-9", name: "Admin", email: "admin@example.com" };
  const values = buildEditInitialValues(
    reservationFixture({
      user: "admin-9",
      name: "Nombre Viejo",
      email: "viejo@example.com",
    }),
    admin,
    HOY,
    true,
  );
  assert.equal(values.name, "Admin");
  assert.equal(values.email, "admin@example.com");
});

// Sin reserva no hay nada que precargar: campos vacíos y datos del perfil.
test("sin reserva devuelve campos vacíos y datos del perfil", () => {
  const values = buildEditInitialValues(null, profile, HOY);
  assert.equal(values.date, null);
  assert.equal(values.guests, "");
  assert.equal(values.phone, "");
  assert.equal(values.observations, "");
  assert.equal(values.name, "Actual Usuario");
  assert.equal(values.email, "actual@example.com");
});
