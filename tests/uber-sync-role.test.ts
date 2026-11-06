import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { UBER_EATS_URL } from "../common/utils/home-content";

// /feature uber-sync-rol: componente cliente válido.
// Admin (ROLE_ADMIN) → llama a uberSync() con los toasts actuales.
// No-admin / sin sesión → enlace a la página de Michi en Uber Eats
// (misma URL que el home "Pide a domicilio"), en pestaña nueva.
const source = readFileSync(
  new URL("../common/components/layout/product/UberSync.tsx", import.meta.url),
  "utf8",
);
const layoutSource = readFileSync(
  new URL("../app/product/(with-layout)/layout.tsx", import.meta.url),
  "utf8",
);

test("es un componente cliente válido sin async ni fetch propio", () => {
  assert.ok(
    source.includes('"use client"'),
    "debe ser un Client Component",
  );
  assert.ok(
    !source.includes("async function UberSync") &&
      !source.includes("async UberSync"),
    "el componente no debe ser async",
  );
  assert.ok(
    !source.includes("UserService") && !source.includes("getProfile"),
    "no debe hacer fetch propio: el rol llega por hook/props",
  );
  assert.ok(
    source.includes("useUser") && source.includes("UserProvider"),
    "debe obtener el perfil con el hook useUser del UserProvider existente",
  );
});

test("admin (ROLE_ADMIN) conserva la sincronización con sus toasts", () => {
  assert.ok(
    source.includes('ROLE_ADMIN'),
    "debe comparar el rol con ROLE_ADMIN",
  );
  assert.ok(
    source.includes("uberSync()"),
    "el admin debe llamar a uberSync()",
  );
  assert.ok(
    source.includes("Se han sincronizado todos los productos"),
    "debe mantener el toast de éxito en español",
  );
  assert.ok(
    source.includes("No se han podido sincronizar los productos"),
    "debe mantener el toast de error en español",
  );
});

test("no-admin enlaza a UBER_EATS_URL en pestaña nueva con aria-label", () => {
  assert.ok(
    source.includes("UBER_EATS_URL") &&
      source.includes("home-content"),
    "debe importar UBER_EATS_URL de common/utils/home-content",
  );
  assert.ok(
    !source.includes("ubereats.com/store"),
    "no debe duplicar la URL: usa la constante exportada",
  );
  assert.ok(
    source.includes("href={UBER_EATS_URL}") ||
      source.includes("href: UBER_EATS_URL"),
    "el enlace no-admin debe apuntar a UBER_EATS_URL",
  );
  assert.ok(
    source.includes('target="_blank"'),
    "debe abrir en pestaña nueva",
  );
  assert.ok(
    source.includes("noopener"),
    "el enlace debe llevar noopener",
  );
  assert.ok(
    source.includes("aria-label="),
    "debe llevar aria-label en español",
  );
  assert.ok(
    UBER_EATS_URL.includes("michi-sushi"),
    "la constante UBER_EATS_URL debe seguir apuntando a la tienda de Michi",
  );
});

test("el layout muestra UberSync también a no-admin (reutiliza su rol)", () => {
  assert.ok(
    layoutSource.includes("<UberSync />"),
    "el layout debe montar UberSync",
  );
  assert.ok(
    !layoutSource.includes('user?.role === "ROLE_ADMIN" && ('),
    "UberSync ya no debe quedar oculto tras el gate solo-admin",
  );
});
