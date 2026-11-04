import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { Reservation } from "../common/types/reservation.types";
import { ReservationService } from "../service/ReservationService";
import { UserService } from "../service/UserService";

const reservation: Reservation = {
  id: "r-1",
  date: "2026-11-05",
  guests: 2,
  location: "INSIDE",
  startTime: "21:00",
  name: "Propietaria Original",
  phone: "600123123",
  email: "propietaria@example.com",
  observations: "Sin gluten",
  user: "owner-1",
  state: "CONFIRMED",
};

// Importación diferida: las actions aún no existen (rojo TDD).
async function loadActions() {
  return import("../lib/server-actions");
}

// RF-7: delegación fina al servicio para lectura.
test("getReservationForEdit delega al servicio y devuelve la reserva", async () => {
  const { getReservationForEdit } = await loadActions();
  const getById = mock.method(
    ReservationService,
    "getReservationById",
    async () => ({ ok: true as const, reservation }),
  );
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => ({ id: "owner-1", role: "ROLE_USER" }),
  );
  try {
    const result = await getReservationForEdit("r-1");
    assert.deepEqual(result, { ok: true, reservation });
    assert.equal(getById.mock.callCount(), 1);
    assert.equal(getById.mock.calls[0].arguments[0], "r-1");
  } finally {
    getById.mock.restore();
    getProfile.mock.restore();
  }
});

// Sin id no hay fetch (coherente con el servicio).
test("getReservationForEdit sin id devuelve NOT_FOUND sin llamar al servicio", async () => {
  const { getReservationForEdit } = await loadActions();
  const getById = mock.method(
    ReservationService,
    "getReservationById",
    async () => ({ ok: true as const, reservation }),
  );
  try {
    assert.deepEqual(await getReservationForEdit(""), {
      ok: false,
      kind: "NOT_FOUND",
    });
    assert.equal(getById.mock.callCount(), 0);
  } finally {
    getById.mock.restore();
  }
});

// Sin sesión no hay fetch: identidad por sesión (RF-7/RF-24).
test("getReservationForEdit sin sesión devuelve UNAUTHENTICATED sin llamar al servicio", async () => {
  const { getReservationForEdit } = await loadActions();
  const getById = mock.method(
    ReservationService,
    "getReservationById",
    async () => ({ ok: true as const, reservation }),
  );
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => null,
  );
  try {
    assert.deepEqual(await getReservationForEdit("r-1"), {
      ok: false,
      kind: "UNAUTHENTICATED",
    });
    assert.equal(getById.mock.callCount(), 0);
  } finally {
    getById.mock.restore();
    getProfile.mock.restore();
  }
});

// Mapeo de errores del servicio sin transformarlos.
test("getReservationForEdit propaga NOT_FOUND/FORBIDDEN/NETWORK del servicio", async () => {
  const { getReservationForEdit } = await loadActions();
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => ({ id: "owner-1", role: "ROLE_USER" }),
  );
  try {
    for (const kind of ["NOT_FOUND", "FORBIDDEN", "NETWORK"] as const) {
      const getById = mock.method(
        ReservationService,
        "getReservationById",
        async () => ({ ok: false as const, kind }),
      );
      try {
        assert.deepEqual(await getReservationForEdit("r-1"), {
          ok: false,
          kind,
        });
      } finally {
        getById.mock.restore();
      }
    }
  } finally {
    getProfile.mock.restore();
  }
});

// RF-7 + RF-24: el payload se envía tal cual (datos del propietario intactos).
test("updateReservation delega el payload tal cual y revalida / y /reservation solo tras éxito", async () => {
  const { updateReservation } = await loadActions();
  const revalidated: string[] = [];
  const revalidate = (path: string) => {
    revalidated.push(path);
  };
  const payload: Reservation = { ...reservation, guests: 4 };
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => ({ id: "owner-1", role: "ROLE_USER" }),
  );
  const updateById = mock.method(
    ReservationService,
    "updateReservationById",
    async () => ({ ok: true as const, reservation: payload }),
  );
  try {
    const result = await updateReservation("r-1", payload, {
      revalidate,
    } as never);
    assert.deepEqual(result, { ok: true, reservation: payload });
    assert.equal(updateById.mock.callCount(), 1);
    assert.equal(updateById.mock.calls[0].arguments[0], "r-1");
    assert.deepEqual(updateById.mock.calls[0].arguments[1], payload);
    assert.deepEqual(revalidated.sort(), ["/", "/reservation"]);
  } finally {
    updateById.mock.restore();
    getProfile.mock.restore();
  }
});

// Sin id no hay PUT ni revalidación.
test("updateReservation sin id devuelve 404 sin llamar al servicio ni revalidar", async () => {
  const { updateReservation } = await loadActions();
  const revalidated: string[] = [];
  const updateById = mock.method(
    ReservationService,
    "updateReservationById",
    async () => ({ ok: true as const, reservation }),
  );
  try {
    assert.deepEqual(
      await updateReservation("", reservation, {
        revalidate: (p: string) => {
          revalidated.push(p);
        },
      } as never),
      { ok: false, status: 404, code: null, backendMessage: null },
    );
    assert.equal(updateById.mock.callCount(), 0);
    assert.deepEqual(revalidated, []);
  } finally {
    updateById.mock.restore();
  }
});

// Sin sesión no hay PUT ni revalidación.
test("updateReservation sin sesión devuelve 403 sin llamar al servicio ni revalidar", async () => {
  const { updateReservation } = await loadActions();
  const revalidated: string[] = [];
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => null,
  );
  const updateById = mock.method(
    ReservationService,
    "updateReservationById",
    async () => ({ ok: true as const, reservation }),
  );
  try {
    assert.deepEqual(
      await updateReservation("r-1", reservation, {
        revalidate: (p: string) => {
          revalidated.push(p);
        },
      } as never),
      { ok: false, status: 403, code: null, backendMessage: null },
    );
    assert.equal(updateById.mock.callCount(), 0);
    assert.deepEqual(revalidated, []);
  } finally {
    getProfile.mock.restore();
    updateById.mock.restore();
  }
});

// El fallo conserva estado/código/mensaje y NO revalida.
test("updateReservation fallido conserva el error y no revalida", async () => {
  const { updateReservation } = await loadActions();
  const revalidated: string[] = [];
  const getProfile = mock.method(
    UserService,
    "getProfile",
    async () => ({ id: "owner-1", role: "ROLE_USER" }),
  );
  const failure = {
    ok: false as const,
    status: 409 as const,
    code: "RESERVATION_NOT_MODIFIABLE",
    backendMessage: "La reserva ya no se puede modificar",
  };
  const updateById = mock.method(
    ReservationService,
    "updateReservationById",
    async () => failure,
  );
  try {
    assert.deepEqual(
      await updateReservation("r-1", reservation, {
        revalidate: (p: string) => {
          revalidated.push(p);
        },
      } as never),
      failure,
    );
    assert.deepEqual(revalidated, []);
  } finally {
    updateById.mock.restore();
    getProfile.mock.restore();
  }
});
