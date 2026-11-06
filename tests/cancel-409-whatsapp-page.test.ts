import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildCancelWhatsappUrl } from "../common/utils/whatsapp-contact";
import { getCancelErrorMessage } from "../common/utils/cancel-error";

// /feature cancelar-409-whatsapp-pagina: el 409 de /cancelar (menos de 2h)
// deriva a WhatsApp con mensaje generico, titulo fijo y sin telefono.
const pageSource = readFileSync(
  new URL(
    "../common/components/pages/reservation/CancelReservationPage.tsx",
    import.meta.url,
  ),
  "utf8",
);
const utilSource = readFileSync(
  new URL("../common/utils/cancel-error.ts", import.meta.url),
  "utf8",
);

test("el mensaje generico de cancelar sigue siendo el aprobado", () => {
  const text = decodeURIComponent(
    new URL(buildCancelWhatsappUrl("", undefined)).searchParams.get("text") ??
      "",
  );
  assert.equal(
    text,
    "Hola, necesito cancelar una reserva con menos de 2 horas de antelación. ¿Pueden ayudarme?",
  );
});

test("la pagina deriva el 409 a WhatsApp con titulo fijo", () => {
  assert.ok(
    pageSource.includes("result.status === 409"),
    "solo el 409 (menos de 2 horas) lleva WhatsApp",
  );
  assert.ok(
    pageSource.includes("buildCancelWhatsappUrl("),
    "debe componer la URL con el builder existente",
  );
  assert.ok(
    pageSource.includes("No se ha podido cancelar su reserva"),
    "titulo fijo en español, como en ReservationCancel",
  );
  assert.ok(
    pageSource.includes("Contáctenos por WhatsApp"),
    "debe mantener la descripción existente",
  );
  assert.ok(
    pageSource.includes("Abrir Whatsapp"),
    "misma etiqueta que los toasts",
  );
  assert.ok(
    pageSource.includes('target="_blank"'),
    "el enlace debe abrir en pestaña nueva",
  );
  assert.ok(
    pageSource.includes("noopener"),
    "el enlace debe llevar noopener",
  );
});

test("la pagina y el fallback 409 ya no muestran el telefono", () => {
  assert.ok(
    !pageSource.includes("Llámenos al"),
    "la pagina ya no muestra el teléfono",
  );
  assert.ok(
    !utilSource.includes("Llámenos al"),
    "el fallback 409 ya no muestra el teléfono",
  );
});

test("el resto de errores mantiene el mensaje plano", () => {
  assert.ok(
    pageSource.includes("toast.error(getCancelErrorMessage(result))") ||
      pageSource.includes("getCancelErrorMessage(result)"),
    "403/404/500 mantienen el mensaje plano",
  );
  assert.equal(
    getCancelErrorMessage({ ok: false, status: 404 }),
    "No encontramos la reserva",
  );
});
