import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mapEditLoadError,
  mapUpdateError,
  resolveUpdateErrorMessage,
} from "../common/utils/reservation-edit";

const BACKEND_CODES = [
  "RESERVATION_NOT_MODIFIABLE",
  "INVALID_TIME",
  "RESERVATION_ALREADY_EXISTS",
  "NO_TABLES_AVAILABLE",
];
const STATUS_CODES = ["400", "401", "403", "404", "409", "500"];

// RF-12: reserva inexistente (backend 404) → aviso en español.
test("mapEditLoadError traduce NOT_FOUND a español", () => {
  const message = mapEditLoadError("NOT_FOUND");
  assert.equal(typeof message, "string");
  assert.ok(message.length > 0);
  assert.ok(message.includes("reserva"));
});

// RF-13: reserva ajena o anónima no admin (backend 403) → aviso en español.
test("mapEditLoadError traduce FORBIDDEN a español", () => {
  const message = mapEditLoadError("FORBIDDEN");
  assert.equal(typeof message, "string");
  assert.ok(message.length > 0);
  assert.ok(message.includes("reserva"));
});

// RF-9: fallo de red o del backend sin respuesta aprovechable → aviso en español.
test("mapEditLoadError traduce NETWORK a español", () => {
  const message = mapEditLoadError("NETWORK");
  assert.equal(typeof message, "string");
  assert.ok(message.length > 0);
  assert.ok(message.includes("reserva"));
});

// RF-23: sin sesión → aviso en español.
test("mapEditLoadError traduce UNAUTHENTICATED a español", () => {
  const message = mapEditLoadError("UNAUTHENTICATED");
  assert.equal(typeof message, "string");
  assert.ok(message.length > 0);
  assert.ok(message.includes("reserva"));
});

// RNF-1 + RNF-6: todos los avisos en español, sin códigos de estado ni del backend.
test("ningún aviso de carga expone códigos (RNF-6)", () => {
  const kinds = ["NOT_FOUND", "FORBIDDEN", "NETWORK", "UNAUTHENTICATED"] as const;
  for (const kind of kinds) {
    const message = mapEditLoadError(kind);
    for (const forbidden of [...BACKEND_CODES, ...STATUS_CODES]) {
      assert.ok(
        !message.includes(forbidden),
        `${kind}: el aviso no debe contener «${forbidden}»`,
      );
    }
  }
});

// --- T6: guardado PUT + conserva datos + carrera GET→PUT ---
// RF-7: el PUT válido por id ya está cubierto en
// `tests/reservation-edit-service.test.ts` («PUT válido actualiza por id»).

const PHONE_MESSAGE =
  "Ya no es posible modificar online con menos de 2 horas de antelación. Llámenos al +34 673 82 11 48";

// RF-16 + RF-26: 409 con mensaje en español (teléfono) y sin código →
// CONFLICT_MESSAGE con el literal del backend, sin traducir ni recortar.
test("mapUpdateError: 409 con mensaje de teléfono conserva el literal", () => {
  const body = JSON.stringify({ message: PHONE_MESSAGE });
  assert.deepEqual(mapUpdateError(409, body), {
    kind: "CONFLICT_MESSAGE",
    backendMessage: PHONE_MESSAGE,
  });
  const plain = mapUpdateError(409, PHONE_MESSAGE);
  assert.equal(plain.kind, "CONFLICT_MESSAGE");
  assert.equal(plain.backendMessage, PHONE_MESSAGE);
});

// RF-26 (prioridad backend → literal): el aviso mostrado es exactamente el
// mensaje del backend, sin prefijos ni códigos.
test("resolveUpdateErrorMessage: CONFLICT_MESSAGE muestra el literal exacto", () => {
  assert.equal(
    resolveUpdateErrorMessage({
      kind: "CONFLICT_MESSAGE",
      backendMessage: PHONE_MESSAGE,
    }),
    PHONE_MESSAGE,
  );
});

// RF-18: 400 INVALID_TIME y 409 con códigos de validación → VALIDATION; el
// aviso es en español y los datos se conservan (la función solo devuelve el
// mensaje: no toca el estado del formulario).
test("mapUpdateError: validaciones de creación mapean a VALIDATION", () => {
  for (const [status, code] of [
    [400, "INVALID_TIME"],
    [409, "RESERVATION_ALREADY_EXISTS"],
    [409, "NO_TABLES_AVAILABLE"],
  ] as const) {
    const mapped = mapUpdateError(
      status,
      JSON.stringify({ message: `Fallo ${code}`, code }),
    );
    assert.equal(mapped.kind, "VALIDATION", code);
  }
  const message = resolveUpdateErrorMessage({
    kind: "VALIDATION",
    backendMessage: "Fallo INVALID_TIME",
  });
  assert.ok(message.includes("reserva"));
});

// RF-25 (carrera GET→PUT): un 403 tardío mapea a FORBIDDEN con su aviso.
test("mapUpdateError: 403 tardío mapea a FORBIDDEN", () => {
  assert.deepEqual(mapUpdateError(403, ""), {
    kind: "FORBIDDEN",
    backendMessage: null,
  });
  assert.ok(
    resolveUpdateErrorMessage({ kind: "FORBIDDEN", backendMessage: null })
      .includes("reserva"),
  );
});

// RF-25 + RF-15: un 409 tardío con RESERVATION_NOT_MODIFIABLE mapea a su aviso.
test("mapUpdateError: 409 NOT_MODIFIABLE tardío mapea a NOT_MODIFIABLE", () => {
  const mapped = mapUpdateError(
    409,
    JSON.stringify({
      message: "La reserva ya no se puede modificar",
      code: "RESERVATION_NOT_MODIFIABLE",
    }),
  );
  assert.equal(mapped.kind, "NOT_MODIFIABLE");
  const message = resolveUpdateErrorMessage(mapped);
  assert.ok(message.includes("reserva"));
});

// RF-10: fallo de envío (404/500 o cuerpo vacío) → GENERIC en español.
test("mapUpdateError: 404/500 o cuerpo vacío mapean a GENERIC", () => {
  assert.deepEqual(mapUpdateError(404, ""), {
    kind: "GENERIC",
    backendMessage: null,
  });
  assert.deepEqual(mapUpdateError(500, "explosión interna"), {
    kind: "GENERIC",
    backendMessage: null,
  });
  assert.deepEqual(mapUpdateError(409, ""), {
    kind: "GENERIC",
    backendMessage: null,
  });
  assert.ok(
    resolveUpdateErrorMessage({ kind: "GENERIC", backendMessage: null })
      .includes("reserva"),
  );
});

// RNF-5 + RNF-6: los códigos del backend quedan en inglés solo para la
// lógica; ningún aviso de guardado los muestra ni muestra estados numéricos.
test("ningún aviso de guardado expone códigos (RNF-6)", () => {
  const samples = [
    { kind: "FORBIDDEN", backendMessage: null },
    { kind: "NOT_MODIFIABLE", backendMessage: "La reserva ya no se puede modificar" },
    { kind: "VALIDATION", backendMessage: "Fallo INVALID_TIME" },
    { kind: "CONFLICT_MESSAGE", backendMessage: PHONE_MESSAGE },
    { kind: "GENERIC", backendMessage: null },
  ] as const;
  for (const sample of samples) {
    const message = resolveUpdateErrorMessage(sample);
    assert.ok(message.length > 0);
    for (const forbidden of [...BACKEND_CODES, ...STATUS_CODES]) {
      // El literal del backend (RF-16) se muestra tal cual: solo se exige
      // ausencia de códigos fuera de ese caso.
      if (sample.kind === "CONFLICT_MESSAGE") continue;
      assert.ok(
        !message.includes(forbidden),
        `${sample.kind}: el aviso no debe contener «${forbidden}»`,
      );
    }
  }
});
