import assert from "node:assert/strict";
import { test } from "node:test";
import type { Reservation } from "../common/types/reservation.types";
import { ReservationService } from "../service/ReservationService";

process.env.BACKEND_URL ??= "http://backend-test";

const BASE = "http://backend-test";
const TOKEN = "session-token";
const USER_ID = "user-1";
const ADMIN_ROLE = "ROLE_ADMIN";

const PHONE_MESSAGE =
  "Ya no es posible modificar la reserva con menos de 2 horas de antelación. Llámenos al +34 673 82 11 48";

const reservation: Reservation = {
  id: "r-1",
  date: "2026-11-05",
  guests: 2,
  location: "INSIDE",
  startTime: "21:00",
  name: "Nombre Apellido",
  phone: "600123123",
  email: "nombre@example.com",
  observations: null,
  user: USER_ID,
  state: "CONFIRMED",
};

type CapturedCall = { url: string; init: RequestInit };

function stubFetcher(
  responder: (call: CapturedCall) => Promise<Response> | Response,
): { fetcher: typeof fetch; calls: CapturedCall[] } {
  const calls: CapturedCall[] = [];
  const fetcher = (async (url: unknown, init?: RequestInit) => {
    const call = { url: String(url), init: init ?? {} };
    calls.push(call);
    return responder(call);
  }) as typeof fetch;
  return { fetcher, calls };
}

function headersOf(call: CapturedCall): Record<string, string> {
  return { ...(call.init.headers as Record<string, string>) };
}

// RF-1: GET /reservations/{id} obtiene la reserva existente.
test("GET existente devuelve la reserva", async () => {
  const { fetcher, calls } = stubFetcher(async () =>
    Response.json(reservation),
  );

  const result = await ReservationService.getReservationById("r-1", {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  assert.deepEqual(result, { ok: true, reservation });
  assert.equal(calls.length, 1);
});

// RF-14: la consulta se permite aunque la reserva esté cancelada.
test("GET permite obtener una reserva cancelada", async () => {
  const cancelled = { ...reservation, state: "CANCELLED" };
  const { fetcher } = stubFetcher(async () => Response.json(cancelled));

  const result = await ReservationService.getReservationById("r-1", {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  assert.deepEqual(result, { ok: true, reservation: cancelled });
});

// RF-12: 404 → NOT_FOUND.
test("GET inexistente mapea 404 a NOT_FOUND", async () => {
  const { fetcher, calls } = stubFetcher(
    async () => new Response(null, { status: 404 }),
  );

  const result = await ReservationService.getReservationById("no-existe", {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  assert.deepEqual(result, { ok: false, kind: "NOT_FOUND" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${BASE}/reservations/no-existe`);
});

// RF-13: 403 → FORBIDDEN (ajena o anónima no admin).
test("GET sin permiso mapea 403 a FORBIDDEN", async () => {
  const { fetcher } = stubFetcher(
    async () => new Response(null, { status: 403 }),
  );

  const result = await ReservationService.getReservationById("ajena", {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  assert.deepEqual(result, { ok: false, kind: "FORBIDDEN" });
});

// RF-9: fallo de red o 500 → NETWORK.
test("GET con fallo de red o 500 mapea a NETWORK", async () => {
  const network = stubFetcher(async () => {
    throw new TypeError("fetch failed");
  });
  assert.deepEqual(
    await ReservationService.getReservationById("r-1", {
      token: TOKEN,
      userId: USER_ID,
      fetcher: network.fetcher,
    }),
    { ok: false, kind: "NETWORK" },
  );

  const server = stubFetcher(
    async () => new Response(null, { status: 500 }),
  );
  assert.deepEqual(
    await ReservationService.getReservationById("r-1", {
      token: TOKEN,
      userId: USER_ID,
      fetcher: server.fetcher,
    }),
    { ok: false, kind: "NETWORK" },
  );
});

// RF-1/RF-13/RNF-4: el admin reenvía User-Id, User-Role y token, sin endpoints nuevos.
test("GET del admin reenvía User-Id, User-Role y token al mismo endpoint", async () => {
  const { fetcher, calls } = stubFetcher(async () =>
    Response.json(reservation),
  );

  await ReservationService.getReservationById("r-1", {
    token: TOKEN,
    userId: "admin-1",
    userRole: ADMIN_ROLE,
    fetcher,
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${BASE}/reservations/r-1`);
  assert.equal(calls[0].init.method ?? "GET", "GET");
  const headers = headersOf(calls[0]);
  assert.equal(headers["User-Id"], "admin-1");
  assert.equal(headers["User-Role"], ADMIN_ROLE);
  assert.equal(headers.Cookie, `token=${TOKEN}`);
});

// El no-admin envía User-Id y token, pero no User-Role.
test("GET no-admin envía User-Id y token sin User-Role", async () => {
  const { fetcher, calls } = stubFetcher(async () =>
    Response.json(reservation),
  );

  await ReservationService.getReservationById("r-1", {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  const headers = headersOf(calls[0]);
  assert.equal(headers["User-Id"], USER_ID);
  assert.ok(!("User-Role" in headers));
  assert.equal(headers.Cookie, `token=${TOKEN}`);
});

// RF-7: PUT /reservations/{id} actualiza y reenvía identidad.
test("PUT válido actualiza por id con el mismo endpoint", async () => {
  const updated = { ...reservation, guests: 4 };
  const { fetcher, calls } = stubFetcher(async () => Response.json(updated));
  const payload = { ...reservation, guests: 4 };

  const result = await ReservationService.updateReservationById("r-1", payload, {
    token: TOKEN,
    userId: USER_ID,
    fetcher,
  });

  assert.deepEqual(result, { ok: true, reservation: updated });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${BASE}/reservations/r-1`);
  assert.equal(calls[0].init.method, "PUT");
  const headers = headersOf(calls[0]);
  assert.equal(headers["Content-Type"], "application/json");
  assert.equal(headers["User-Id"], USER_ID);
  assert.equal(headers.Cookie, `token=${TOKEN}`);
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), payload);
});

// RF-25: PUT 403/404 conserva el estado correspondiente.
test("PUT 403 y 404 devuelven su estado sin códigos ni mensajes inventados", async () => {
  const forbidden = stubFetcher(
    async () => new Response(null, { status: 403 }),
  );
  assert.deepEqual(
    await ReservationService.updateReservationById("ajena", reservation, {
      token: TOKEN,
      userId: USER_ID,
      fetcher: forbidden.fetcher,
    }),
    { ok: false, status: 403, code: null, backendMessage: null },
  );

  const missing = stubFetcher(async () => new Response(null, { status: 404 }));
  assert.deepEqual(
    await ReservationService.updateReservationById("no-existe", reservation, {
      token: TOKEN,
      userId: USER_ID,
      fetcher: missing.fetcher,
    }),
    { ok: false, status: 404, code: null, backendMessage: null },
  );
});

// RF-15/RF-25 + RNF-5: 409 RESERVATION_NOT_MODIFIABLE queda como código interno.
test("PUT 409 NOT_MODIFIABLE conserva el código en inglés sin traducir", async () => {
  const { fetcher } = stubFetcher(
    async () =>
      new Response(
        JSON.stringify({
          message: "La reserva ya no se puede modificar",
          code: "RESERVATION_NOT_MODIFIABLE",
        }),
        { status: 409 },
      ),
  );

  const result = await ReservationService.updateReservationById(
    "r-1",
    reservation,
    { token: TOKEN, userId: USER_ID, fetcher },
  );

  assert.equal(result.ok, false);
  assert.equal(
    (result as { ok: false; code: string | null }).code,
    "RESERVATION_NOT_MODIFIABLE",
  );
});

// RF-16/RF-26: 409 con mensaje de teléfono → literal del backend, sin código.
test("PUT 409 por cercanía conserva literalmente el mensaje con el teléfono", async () => {
  const { fetcher } = stubFetcher(
    async () => new Response(JSON.stringify({ message: PHONE_MESSAGE }), {
      status: 409,
    }),
  );

  const result = await ReservationService.updateReservationById(
    "r-1",
    reservation,
    { token: TOKEN, userId: USER_ID, fetcher },
  );

  assert.deepEqual(result, {
    ok: false,
    status: 409,
    code: null,
    backendMessage: PHONE_MESSAGE,
  });
});

// RF-18 + RNF-5: validaciones de creación con códigos intactos.
test("PUT con validaciones fallidas conserva los códigos en inglés", async () => {
  for (const code of [
    "INVALID_TIME",
    "RESERVATION_ALREADY_EXISTS",
    "NO_TABLES_AVAILABLE",
  ]) {
    const status = code === "INVALID_TIME" ? 400 : 409;
    const { fetcher } = stubFetcher(
      async () =>
        new Response(JSON.stringify({ message: `Fallo ${code}`, code }), {
          status,
        }),
    );
    const result = await ReservationService.updateReservationById(
      "r-1",
      reservation,
      { token: TOKEN, userId: USER_ID, fetcher },
    );
    assert.deepEqual(result, {
      ok: false,
      status,
      code,
      backendMessage: `Fallo ${code}`,
    });
  }
});

// RNF-6: el servicio no devuelve textos para la UI, solo código + mensaje internos.
test("PUT fallido solo expone código y mensaje internos, sin textos de UI", async () => {
  const { fetcher } = stubFetcher(
    async () => new Response(JSON.stringify({ message: PHONE_MESSAGE }), {
      status: 409,
    }),
  );

  const result = (await ReservationService.updateReservationById(
    "r-1",
    reservation,
    { token: TOKEN, userId: USER_ID, fetcher },
  )) as unknown as Record<string, unknown>;

  assert.deepEqual(Object.keys(result).sort(), [
    "backendMessage",
    "code",
    "ok",
    "status",
  ]);
});

// Fallo de envío → 500 interno sin filtrar detalles.
test("PUT con fallo de red o 500 devuelve 500 sin códigos ni mensajes", async () => {
  const network = stubFetcher(async () => {
    throw new TypeError("fetch failed");
  });
  assert.deepEqual(
    await ReservationService.updateReservationById("r-1", reservation, {
      token: TOKEN,
      userId: USER_ID,
      fetcher: network.fetcher,
    }),
    { ok: false, status: 500, code: null, backendMessage: null },
  );

  const server = stubFetcher(
    async () => new Response("explosión interna", { status: 500 }),
  );
  assert.deepEqual(
    await ReservationService.updateReservationById("r-1", reservation, {
      token: TOKEN,
      userId: USER_ID,
      fetcher: server.fetcher,
    }),
    { ok: false, status: 500, code: null, backendMessage: null },
  );
});

// Sin id no hay fetch: se evita pedir /reservations/ vacío.
test("GET y PUT sin id no llaman al backend", async () => {
  const getStub = stubFetcher(async () => Response.json(reservation));
  assert.deepEqual(
    await ReservationService.getReservationById("", {
      token: TOKEN,
      userId: USER_ID,
      fetcher: getStub.fetcher,
    }),
    { ok: false, kind: "NOT_FOUND" },
  );
  assert.equal(getStub.calls.length, 0);

  const putStub = stubFetcher(async () => Response.json(reservation));
  assert.deepEqual(
    await ReservationService.updateReservationById("", reservation, {
      token: TOKEN,
      userId: USER_ID,
      fetcher: putStub.fetcher,
    }),
    { ok: false, status: 404, code: null, backendMessage: null },
  );
  assert.equal(putStub.calls.length, 0);
});
