import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// T7 (RF-15, RF-17, RF-19, RNF-1): bloqueo por estado no CONFIRMED desde la
// carga, sin bloqueo de 2h en el cliente (el backend decide; el admin va
// exento a nivel de servicio) y éxito con navegación a `/` + toast literal.

// --- RF-15: bloqueo preventivo por estado (puro, sin fetch ni sesión) ---
test("isSaveBlockedByState permite guardar solo en CONFIRMED", async () => {
  const { isSaveBlockedByState } = await import(
    "../common/utils/reservation-edit"
  );
  assert.equal(isSaveBlockedByState("CONFIRMED"), false);
});

test("isSaveBlockedByState bloquea estados no CONFIRMED", async () => {
  const { isSaveBlockedByState } = await import(
    "../common/utils/reservation-edit"
  );
  for (const state of ["CANCELLED", "PENDING", "EXPIRED", "", "confirmed"]) {
    assert.equal(isSaveBlockedByState(state), true, `estado ${state}`);
  }
});

test("isSaveBlockedByState bloquea sin estado (nulo o ausente)", async () => {
  const { isSaveBlockedByState } = await import(
    "../common/utils/reservation-edit"
  );
  assert.equal(isSaveBlockedByState(null), true);
  assert.equal(isSaveBlockedByState(undefined), true);
});

// RF-15: el bloqueo se aplica también al admin (la exención RF-17 es solo
// del bloqueo de 2h, no del estado): el helper no distingue roles.
test("isSaveBlockedByState bloquea no CONFIRMED sin distinguir roles", async () => {
  const { isSaveBlockedByState } = await import(
    "../common/utils/reservation-edit"
  );
  assert.equal(isSaveBlockedByState("CANCELLED"), true);
  assert.equal(isSaveBlockedByState("CONFIRMED"), false);
});

// RNF-1 + RNF-6: aviso de bloqueo en español, sin códigos ni estados.
test("el aviso de no modificable está en español y no expone códigos", async () => {
  const { EDIT_NOT_MODIFIABLE_MESSAGE } = await import(
    "../common/utils/reservation-edit"
  );
  assert.equal(typeof EDIT_NOT_MODIFIABLE_MESSAGE, "string");
  assert.ok(EDIT_NOT_MODIFIABLE_MESSAGE.includes("reserva"));
  for (const forbidden of [
    "RESERVATION_NOT_MODIFIABLE",
    "INVALID_TIME",
    "RESERVATION_ALREADY_EXISTS",
    "NO_TABLES_AVAILABLE",
    "400",
    "403",
    "404",
    "409",
    "500",
  ]) {
    assert.ok(!EDIT_NOT_MODIFIABLE_MESSAGE.includes(forbidden));
  }
});

// El aviso tardío del PUT usa el mismo texto que el bloqueo desde carga.
test("resolveUpdateErrorMessage NOT_MODIFIABLE coincide con el aviso de carga", async () => {
  const { EDIT_NOT_MODIFIABLE_MESSAGE, resolveUpdateErrorMessage } =
    await import("../common/utils/reservation-edit");
  assert.equal(
    resolveUpdateErrorMessage({ kind: "NOT_MODIFIABLE", backendMessage: null }),
    EDIT_NOT_MODIFIABLE_MESSAGE,
  );
});

// --- RF-19: éxito navega a `/` con toast literal ---
test("el mensaje de éxito de edición es el literal de la spec", async () => {
  const { EDIT_SUCCESS_TOAST_MESSAGE } = await import(
    "../common/utils/reservation-edit"
  );
  assert.equal(EDIT_SUCCESS_TOAST_MESSAGE, "Se ha modificado su reserva");
});

// La página de edición bloquea desde carga con el helper (RF-15).
test("la ruta /reservation/edit bloquea el guardado si no es CONFIRMED", () => {
  const source = readFileSync("app/reservation/edit/page.tsx", "utf8");
  assert.ok(source.includes("isSaveBlockedByState"));
  assert.ok(source.includes("EditReservationPage"));
});

// El formulario de edición muestra el toast literal y navega a `/` (RF-19),
// bloquea por estado desde la carga (RF-15) y no añade bloqueo de 2h en el
// cliente: el backend decide y el admin va exento a nivel de servicio (RF-17).
test("EditReservationPage: bloqueo por estado + éxito con toast en /", () => {
  const source = readFileSync(
    "common/components/pages/reservation/EditReservationPage.tsx",
    "utf8",
  );
  assert.ok(source.includes("isSaveBlockedByState"));
  assert.ok(
    source.includes("EDIT_SUCCESS_TOAST_MESSAGE") ||
      source.includes("Se ha modificado su reserva"),
  );
  assert.ok(source.includes('router.push("/")'));
  assert.ok(source.includes("toast.success"));
  // Sin bloqueo preventivo de 2h en el cliente (RF-17: decide el backend).
  assert.ok(!source.includes("isTwoHourLimitInstant"));
});
