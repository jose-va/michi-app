import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EDIT_INVALID_ID_MESSAGE,
  parseEditId,
} from "../common/utils/reservation-edit";

// RF-22: id ausente → bloquea sin fetch (función pura, sin red).
test("parseEditId rechaza el id ausente", () => {
  assert.deepEqual(parseEditId(undefined), { ok: false });
  assert.deepEqual(parseEditId(null), { ok: false });
});

// RF-22: id vacío o solo con espacios → bloquea sin fetch.
test("parseEditId rechaza el id vacío o solo con espacios", () => {
  assert.deepEqual(parseEditId(""), { ok: false });
  assert.deepEqual(parseEditId("   "), { ok: false });
});

// RF-22: varios valores `id` en la consulta (incluido repetido) → bloquea.
test("parseEditId rechaza valores repetidos de id", () => {
  assert.deepEqual(parseEditId(["a", "b"]), { ok: false });
  assert.deepEqual(parseEditId(["a", "a"]), { ok: false });
  assert.deepEqual(parseEditId(["a"]), { ok: false });
});

// RF-22: valor no válido (no es una cadena aprovechable) → bloquea.
test("parseEditId rechaza valores de id no válidos", () => {
  assert.deepEqual(parseEditId(123 as never), { ok: false });
  assert.deepEqual(parseEditId({} as never), { ok: false });
});

// RF-1: id válido → se permite pedir la reserva al backend.
test("parseEditId acepta un id válido y recorta espacios", () => {
  assert.deepEqual(parseEditId("r-1"), { ok: true, id: "r-1" });
  assert.deepEqual(parseEditId("  r-1  "), { ok: true, id: "r-1" });
});

// RNF-1 + RNF-6: aviso en español, sin códigos ni estados.
test("el aviso de id no válido está en español y no expone códigos", () => {
  assert.equal(typeof EDIT_INVALID_ID_MESSAGE, "string");
  assert.ok(EDIT_INVALID_ID_MESSAGE.length > 0);
  assert.ok(EDIT_INVALID_ID_MESSAGE.includes("modificaci"));
  for (const forbidden of ["404", "403", "500", "RESERVATION", "INVALID"]) {
    assert.ok(
      !EDIT_INVALID_ID_MESSAGE.includes(forbidden),
      `el aviso no debe contener «${forbidden}»`,
    );
  }
});
