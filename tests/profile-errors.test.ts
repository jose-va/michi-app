import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const userTabs = readFileSync(
  new URL(
    "../common/components/layout/user/UserProfileTabs.tsx",
    import.meta.url,
  ),
  "utf8",
);

const adminTabs = readFileSync(
  new URL(
    "../common/components/layout/user/AdminProfileTabs.tsx",
    import.meta.url,
  ),
  "utf8",
);

const productService = readFileSync(
  new URL("../service/ProductService.ts", import.meta.url),
  "utf8",
);

const reservationPure = readFileSync(
  new URL("../common/utils/profile-reservations.ts", import.meta.url),
  "utf8",
);

test("Mi reserva distingue error (null) de vacío", () => {
  assert.ok(
    userTabs.includes("reservations === null"),
    "El error de carga debe detectarse con reservations === null",
  );
  assert.ok(
    userTabs.includes("No se ha podido cargar la información"),
    "Ante un error debe mostrar el mensaje exacto",
  );
  assert.ok(
    userTabs.indexOf("No se ha podido cargar la información") <
      userTabs.indexOf("Todavía no has realizado ninguna reserva"),
    "La rama de error debe ir antes que la de vacío",
  );
});

test("Reservas de hoy distingue error (null) de vacío", () => {
  assert.ok(
    adminTabs.includes("reservations === null"),
    "El error de carga debe detectarse con reservations === null",
  );
  assert.ok(
    adminTabs.includes("No se ha podido cargar la información"),
    "Ante un error debe mostrar el mensaje exacto",
  );
  assert.ok(
    adminTabs.indexOf("No se ha podido cargar la información") <
      adminTabs.indexOf("Todavía no hay reservas"),
    "La rama de error debe ir antes que la de vacío",
  );
});

test("Favoritos sin rama de error: siempre Sin favoritos (RF-11)", () => {
  assert.ok(
    productService.includes("return [];"),
    "ProductService.all devuelve [] en el catch: el fallo del backend es lista vacía",
  );
  assert.ok(
    !userTabs.includes("products === null") &&
      !userTabs.includes("favorites === null"),
    "Favoritos no debe tener rama de error: ni products ni favorites se comparan con null",
  );
  const occurrences =
    userTabs.match(/No se ha podido cargar la información/g) ?? [];
  assert.strictEqual(
    occurrences.length,
    1,
    "El mensaje de error debe aparecer solo una vez (Mi reserva), no en Favoritos",
  );
  assert.ok(
    userTabs.includes("No tienes productos favoritos"),
    "En vacío o fallo del listado debe mostrar el mensaje exacto de vacío",
  );
});

test("email, observations y location nulos se omiten sin huecos", () => {
  for (const [label, source] of [
    ["usuario", userTabs],
    ["administrador", adminTabs],
  ] as const) {
    for (const field of [
      "reservation.email",
      "reservation.observations",
      "reservation.location",
    ]) {
      assert.match(
        source,
        new RegExp(
          `${field.replace(".", "\\.")} \\?[\\s\\S]*?: null`,
        ),
        `En la pestaña del ${label}, ${field} nulo no debe dejar hueco`,
      );
    }
  }
});

test("el detalle de reserva no inventa textos para los nulos", () => {
  for (const [label, source] of [
    ["usuario", userTabs],
    ["administrador", adminTabs],
  ] as const) {
    for (const invented of [
      "Sin correo",
      "Sin email",
      "Sin observaciones",
      "Sin ubicación",
      "No disponible",
      "desconocid",
      "N/A",
    ]) {
      assert.ok(
        !source.includes(invented),
        `En la pestaña del ${label} no debe aparecer «${invented}»`,
      );
    }
    assert.ok(
      !source.includes("reservation.user"),
      `En la pestaña del ${label} el id interno user nunca se muestra`,
    );
  }
});

test("user nulo no se selecciona ni rompe el filtro", () => {
  assert.ok(
    reservationPure.includes("reservation.user === userId"),
    "El filtro estricto por id excluye los user nulos",
  );
});
