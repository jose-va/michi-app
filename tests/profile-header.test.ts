import assert from "node:assert/strict";
import { test } from "node:test";
import { getProfileInitial } from "../common/utils/profile-header";

test("devuelve la inicial del nombre en mayúscula", () => {
  assert.equal(getProfileInitial("Ana"), "A");
  assert.equal(getProfileInitial("milo"), "M");
});

test("ignora los espacios al inicio del nombre", () => {
  assert.equal(getProfileInitial("  ana"), "A");
});

test("nombre vacío sin inicial inventada", () => {
  assert.equal(getProfileInitial(""), "");
  assert.equal(getProfileInitial("   "), "");
});
