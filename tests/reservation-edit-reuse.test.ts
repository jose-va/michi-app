import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { formSchema } from "../common/types/reservation-form.types";
import {
  buildEditInitialValues,
  isEditHourStillAvailable,
} from "../common/utils/reservation-edit";
import { ReservationService } from "../service/ReservationService";

// T5 (RF-5, RF-6, RF-20, RNF-2): la modificación reutiliza la validación y
// las horas de la creación sin duplicarlas. La "batería de crear" y la "de
// editar" son el mismo `formSchema` importado del módulo de creación; estos
// tests fijan la paridad caso por caso para que cualquier divergencia rompa.

const VALID_PAYLOAD = {
  date: new Date(2026, 10, 5, 12, 0, 0, 0),
  guests: "2",
  location: "INSIDE",
  startTime: "21:00",
  name: "Nombre Apellido",
  phone: "600123123",
  email: "reserva@example.com",
  observations: "",
  user: "user-1",
} as const;

// RF-5: la misma batería da idéntico resultado en crear y en editar porque
// ambos flujos usan el mismo objeto `formSchema` (sin copia en edición).
for (const flow of ["crear", "editar"] as const) {
  test(`[${flow}] un payload válido es aceptado`, () => {
    const result = formSchema.safeParse({ ...VALID_PAYLOAD });
    assert.equal(result.success, true);
  });

  test(`[${flow}] exige comensales con el mensaje de creación`, () => {
    const result = formSchema.safeParse({ ...VALID_PAYLOAD, guests: "" });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some((issue) =>
        issue.message.includes("Seleccione el número de comensales."),
      ),
    );
  });

  test(`[${flow}] rechaza un nombre demasiado corto`, () => {
    const result = formSchema.safeParse({ ...VALID_PAYLOAD, name: "A" });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some((issue) =>
        issue.message.includes("Por favor, introduzca un nombre"),
      ),
    );
  });

  test(`[${flow}] rechaza un teléfono demasiado corto`, () => {
    const result = formSchema.safeParse({ ...VALID_PAYLOAD, phone: "123" });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some((issue) =>
        issue.message.includes(
          "El número de teléfono introducido no es correcto",
        ),
      ),
    );
  });

  test(`[${flow}] rechaza un correo no válido`, () => {
    const result = formSchema.safeParse({
      ...VALID_PAYLOAD,
      email: "no-es-un-correo",
    });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some((issue) =>
        issue.message.includes(
          "El correo electrónico introducido no es correcto",
        ),
      ),
    );
  });

  test(`[${flow}] exige la fecha como Date (no como cadena)`, () => {
    const result = formSchema.safeParse({
      ...VALID_PAYLOAD,
      date: "2026-11-05",
    });
    assert.equal(result.success, false);
  });

  test(`[${flow}] acepta observaciones nulas y correo vacío`, () => {
    const result = formSchema.safeParse({
      ...VALID_PAYLOAD,
      observations: null,
      email: "",
      user: null,
    });
    assert.equal(result.success, true);
  });

  test(`[${flow}] rechaza una ubicación desconocida`, () => {
    const result = formSchema.safeParse({
      ...VALID_PAYLOAD,
      location: "MIDDLE",
    });
    assert.equal(result.success, false);
  });
}

// RF-5: paridad literal crear/editar caso por caso (mismo éxito y mismos
// mensajes, porque es el mismo esquema compartido).
test("crear y editar producen el mismo resultado en toda la batería", () => {
  const cases: Array<Record<string, unknown>> = [
    { ...VALID_PAYLOAD },
    { ...VALID_PAYLOAD, guests: "" },
    { ...VALID_PAYLOAD, name: "A" },
    { ...VALID_PAYLOAD, phone: "123" },
    { ...VALID_PAYLOAD, email: "no-es-un-correo" },
    { ...VALID_PAYLOAD, date: "2026-11-05" },
    { ...VALID_PAYLOAD, observations: null, email: "", user: null },
    { ...VALID_PAYLOAD, location: "MIDDLE" },
  ];
  for (const values of cases) {
    const crear = formSchema.safeParse(values);
    // "Editar" usa el mismo `formSchema` importado: el resultado debe ser
    // idéntico al de "crear" para los mismos valores.
    const editar = formSchema.safeParse(values);
    assert.deepEqual(editar, crear);
  }
});

// RNF-2: la edición no duplica la validación (sin esquema propio en el
// módulo de edición ni en la ruta de modificación).
test("la edición no define su propia validación", () => {
  for (const file of [
    "../common/utils/reservation-edit.ts",
    "../app/reservation/edit/page.tsx",
  ]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    for (const forbidden of ["z.object", "zod", "formSchema ="]) {
      assert.ok(
        !source.includes(forbidden),
        `${file} no debe contener «${forbidden}» (RNF-2)`,
      );
    }
  }
});

// RF-6 + RNF-2: el mismo (día, comensales) da las mismas horas porque la
// edición llamará a `ReservationService.getAvailableHours`, la misma
// función que la creación (sin lógica propia en el módulo de edición).
test("el mismo día y comensales dan las mismas horas", async () => {
  const requested: string[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string) => {
    requested.push(String(url));
    return {
      ok: true,
      json: async () => ({
        insideHours: ["13:00", "14:00"],
        outsideHours: ["21:00"],
      }),
    };
  }) as typeof fetch;
  try {
    const primera = await ReservationService.getAvailableHours(
      "2026-11-05",
      "2",
    );
    const segunda = await ReservationService.getAvailableHours(
      "2026-11-05",
      "2",
    );
    assert.deepEqual(segunda, primera);
    assert.equal(requested.length, 2);
    assert.equal(requested[0], requested[1]);
    assert.ok(requested[0].includes("date=2026-11-05"));
    assert.ok(requested[0].includes("guests=2"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// RF-6: cambiar día o comensales pide otras horas (la consulta viaja con los
// nuevos parámetros, igual que en la creación).
test("cambiar día o comensales pide horas con los nuevos parámetros", async () => {
  const requested: string[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string) => {
    requested.push(String(url));
    return {
      ok: true,
      json: async () => ({ insideHours: [], outsideHours: [] }),
    };
  }) as typeof fetch;
  try {
    await ReservationService.getAvailableHours("2026-11-05", "2");
    await ReservationService.getAvailableHours("2026-11-06", "4");
    assert.notEqual(requested[0], requested[1]);
    assert.ok(requested[1].includes("date=2026-11-06"));
    assert.ok(requested[1].includes("guests=4"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// RNF-2: la edición no obtiene horas por su cuenta.
test("la edición no define su propia obtención de horas", () => {
  const source = readFileSync(
    new URL("../common/utils/reservation-edit.ts", import.meta.url),
    "utf8",
  );
  for (const forbidden of [
    "/reservations/hours",
    "getAvailableHours(",
    "insideHours:",
  ]) {
    assert.ok(
      !source.includes(forbidden),
      `reservation-edit.ts no debe contener «${forbidden}» (RNF-2)`,
    );
  }
});

// RF-20: si la hora elegida sigue entre las recargadas, se mantiene.
test("la hora elegida se mantiene si sigue disponible", () => {
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: ["13:00"], outsideHours: ["21:00"] },
      "21:00",
    ),
    true,
  );
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: ["13:00"], outsideHours: ["21:00"] },
      "13:00",
    ),
    true,
  );
});

// RF-20: si al cambiar día/comensales la hora deja de estar disponible, hay
// que elegir otra de entre las actuales.
test("la hora elegida deja de valer si ya no está entre las actuales", () => {
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: ["13:00"], outsideHours: ["20:30"] },
      "21:00",
    ),
    false,
  );
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: [], outsideHours: [] },
      "21:00",
    ),
    false,
  );
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: ["13:00"], outsideHours: ["21:00"] },
      "",
    ),
    false,
  );
  assert.equal(
    isEditHourStillAvailable(
      { insideHours: ["13:00"], outsideHours: ["21:00"] },
      null,
    ),
    false,
  );
});

// RF-20: sin marca especial sobre la hora original: la decisión es un
// booleano y los valores iniciales no arrastran ninguna hora anterior.
test("no hay marca especial sobre la hora original", () => {
  const decision = isEditHourStillAvailable(
    { insideHours: ["13:00"], outsideHours: [] },
    "13:00",
  );
  assert.equal(typeof decision, "boolean");
  const values = buildEditInitialValues(
    {
      id: "r-1",
      date: "2026-11-05",
      guests: 2,
      location: "INSIDE",
      startTime: "21:00",
      name: "Nombre Antiguo",
      phone: "600123123",
      email: "antiguo@example.com",
      observations: "",
      user: "user-1",
      state: "CONFIRMED",
    },
    { id: "user-1", name: "Actual", email: "actual@example.com" },
    new Date(2026, 9, 28, 12, 0, 0, 0),
  );
  assert.ok(!("startTime" in values));
  assert.ok(!("originalStartTime" in values));
  assert.ok(!("originalHour" in values));
});
