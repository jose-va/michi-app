import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CAT_AVATAR_BASE_URL,
  CAT_AVATAR_COUNT,
  getCatAvatarIndex,
  getCatAvatarUrl,
} from "../common/utils/cat-avatar";

test("usa el servicio externo ligero de gatitos sin dependencias nuevas", () => {
  assert.equal(CAT_AVATAR_BASE_URL, "https://cataas.com/cat");
});

test("la misma reserva siempre obtiene el mismo gatito (determinista)", () => {
  assert.equal(getCatAvatarUrl("Milo-0"), getCatAvatarUrl("Milo-0"));
  assert.equal(getCatAvatarIndex("Milo-0"), getCatAvatarIndex("Milo-0"));
});

test("el índice del gatito está dentro del rango válido", () => {
  for (const seed of ["Milo-0", "Luna-1", 0, 7, ""]) {
    const index = getCatAvatarIndex(seed);
    assert.ok(
      Number.isInteger(index) && index >= 0 && index < CAT_AVATAR_COUNT,
      `Índice ${index} fuera de rango para semilla ${String(seed)}`
    );
    assert.ok(
      getCatAvatarUrl(seed).startsWith(`${CAT_AVATAR_BASE_URL}?`),
      "La URL debe partir de la base de cataas"
    );
  }
});

test("reparte los gatitos entre reservas distintas", () => {
  const indices = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(getCatAvatarIndex));
  assert.equal(indices.size, CAT_AVATAR_COUNT);
});
