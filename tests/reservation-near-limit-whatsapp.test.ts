import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  buildCancelWhatsappUrl,
  buildEditWhatsappUrl,
} from "../common/utils/whatsapp-contact";

// /feature: los toasts de cancelar y modificar con menos de 2 horas deben
// ofrecer contactar por WhatsApp con la misma estructura que ReservationPage
// (description "Contáctenos por WhatsApp" + action "Abrir Whatsapp").
const cancelSource = readFileSync(
  new URL(
    "../common/components/ui/reservation/ReservationCancel.tsx",
    import.meta.url,
  ),
  "utf8",
);
const editSource = readFileSync(
  new URL(
    "../common/components/pages/reservation/EditReservationPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("buildCancelWhatsappUrl compone el mensaje de cancelación con fecha y hora", () => {
  const fecha = format(new Date(2026, 9, 28), "EEEE, d 'de' MMMM", {
    locale: es,
  });
  const text = decodeURIComponent(
    new URL(buildCancelWhatsappUrl(fecha, "13:00")).searchParams.get("text") ??
      "",
  );
  assert.equal(
    text,
    `Hola, quiero cancelar mi reserva del ${fecha} a las 13:00. ¿Pueden ayudarme?`,
  );
});

test("buildEditWhatsappUrl compone el mensaje de modificación con fecha y hora", () => {
  const fecha = format(new Date(2026, 9, 28), "EEEE, d 'de' MMMM", {
    locale: es,
  });
  const text = decodeURIComponent(
    new URL(buildEditWhatsappUrl(fecha, "20:30")).searchParams.get("text") ??
      "",
  );
  assert.equal(
    text,
    `Hola, quiero modificar mi reserva del ${fecha} a las 20:30. ¿Pueden ayudarme?`,
  );
});

test("sin fecha se usa el mensaje genérico de menos de 2 horas", () => {
  for (const vacia of ["", "   "]) {
    const cancelText = decodeURIComponent(
      new URL(buildCancelWhatsappUrl(vacia, "13:00")).searchParams.get(
        "text",
      ) ?? "",
    );
    assert.equal(
      cancelText,
      "Hola, necesito cancelar una reserva con menos de 2 horas de antelación. ¿Pueden ayudarme?",
    );
    const editText = decodeURIComponent(
      new URL(buildEditWhatsappUrl(vacia, "13:00")).searchParams.get("text") ??
        "",
    );
    assert.equal(
      editText,
      "Hola, necesito modificar una reserva con menos de 2 horas de antelación. ¿Pueden ayudarme?",
    );
  }
});

test("sin hora se omite el tramo “a las …”", () => {
  const fecha = format(new Date(2026, 9, 28), "EEEE, d 'de' MMMM", {
    locale: es,
  });
  for (const vacia of ["", "   ", undefined, null]) {
    const cancelText = decodeURIComponent(
      new URL(buildCancelWhatsappUrl(fecha, vacia)).searchParams.get("text") ??
        "",
    );
    assert.ok(!cancelText.includes("a las"));
    assert.ok(cancelText.includes(fecha));
    const editText = decodeURIComponent(
      new URL(buildEditWhatsappUrl(fecha, vacia)).searchParams.get("text") ??
        "",
    );
    assert.ok(!editText.includes("a las"));
    assert.ok(editText.includes(fecha));
  }
});

test("el 409 de cancelar ofrece la acción WhatsApp y el resto mantiene el mensaje plano", () => {
  assert.ok(
    cancelSource.includes("result.status === 409"),
    "solo el 409 (menos de 2 horas) lleva WhatsApp",
  );
  assert.ok(
    cancelSource.includes("No se ha podido cancelar su reserva"),
    "el título no muestra el teléfono, como en ReservationPage",
  );
  assert.ok(
    cancelSource.includes("Contáctenos por WhatsApp"),
    "debe mantener la descripción existente",
  );
  assert.ok(
    cancelSource.includes('label: "Abrir Whatsapp"'),
    "debe usar la misma etiqueta que ReservationPage",
  );
  assert.ok(
    cancelSource.includes(
      'window.open(whatsappUrl, "_blank", "noopener,noreferrer")',
    ),
    "la acción debe abrir la URL dinámica en _blank con noopener,noreferrer",
  );
  assert.ok(
    cancelSource.includes("toast.error(getCancelErrorMessage(result))"),
    "el resto de errores mantiene el mensaje plano",
  );
  assert.ok(
    !cancelSource.includes("Llámenos al"),
    "el toast ya no muestra el teléfono",
  );
});

test("solo CONFLICT_MESSAGE en edición ofrece WhatsApp", () => {
  assert.ok(
    editSource.includes('mapped.kind === "CONFLICT_MESSAGE"'),
    "solo el 409 de cercanía lleva WhatsApp",
  );
  assert.ok(
    editSource.includes("No se ha podido modificar su reserva"),
    "el título no muestra el teléfono, como en ReservationPage",
  );
  assert.ok(
    editSource.includes("Contáctenos por WhatsApp"),
    "debe mantener la descripción existente",
  );
  assert.ok(
    editSource.includes('label: "Abrir Whatsapp"'),
    "debe usar la misma etiqueta que ReservationPage",
  );
  assert.ok(
    editSource.includes(
      'window.open(whatsappUrl, "_blank", "noopener,noreferrer")',
    ),
    "la acción debe abrir la URL dinámica en _blank con noopener,noreferrer",
  );
  assert.ok(
    editSource.includes("toast.error(resolveUpdateErrorMessage(mapped))"),
    "el resto de errores mantiene el mensaje plano",
  );
});

test("la edición compone la URL con fecha en español y hora del formulario", () => {
  assert.ok(
    editSource.includes("buildEditWhatsappUrl("),
    "debe componer la URL con el builder",
  );
  assert.ok(
    editSource.includes(
      'format(data.date, "EEEE, d \'de\' MMMM", { locale: es })',
    ),
    "debe formatear data.date en español",
  );
  assert.ok(
    editSource.includes("data.startTime"),
    "debe partir de la hora del formulario",
  );
});
