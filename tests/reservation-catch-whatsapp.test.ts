import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { buildReservationWhatsappUrl } from "../common/utils/whatsapp-contact";

// /feature: los toasts de error genérico (default y catch) al crear reserva
// deben abrir WhatsApp con mensaje dinámico que incluya fecha y hora.
const source = readFileSync(
  new URL(
    "../common/components/pages/reservation/ReservationPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("onSubmit compone la URL de WhatsApp con fecha y hora", () => {
  assert.ok(
    source.includes('format(data.date, "EEEE, d \'de\' MMMM", { locale: es })'),
    "debe formatear data.date en español con coma tras el día de semana",
  );
  assert.ok(
    !source.includes("a las ${data.startTime}"),
    "no debe interpolar data.startTime en crudo (puede llegar vacío → “a las .”)",
  );
  assert.ok(
    source.includes("buildReservationWhatsappUrl("),
    "debe componer la URL con el builder con la hora tal cual",
  );
  assert.ok(
    source.includes("data.startTime"),
    "debe partir de la hora del formulario",
  );
  assert.ok(
    source.includes('label: "Contacto"'),
    "el toast debe mantener la etiqueta Contacto",
  );
  assert.ok(
    source.includes('window.open(whatsappUrl, "_blank", "noopener,noreferrer")'),
    "la acción debe abrir la URL dinámica en _blank con noopener,noreferrer",
  );
});

// Caso real observado: miércoles 28 de octubre con hora que antes quedaba
// vacía (`...a las .`). La URL final debe contener la hora.
test("caso real: 28 oct + 13:00 → la URL final contiene la hora", () => {
  const fecha = format(new Date(2026, 9, 28), "EEEE, d 'de' MMMM", {
    locale: es,
  });
  assert.ok(
    fecha.includes("28 de octubre"),
    `fecha esperada en español, recibida: ${fecha}`,
  );
  const url = buildReservationWhatsappUrl(fecha, "13:00");
  const text = decodeURIComponent(new URL(url).searchParams.get("text") ?? "");
  assert.equal(
    text,
    `Hola, no he podido reservar para el ${fecha} a las 13:00.`,
    "el mensaje debe seguir la plantilla aprobada con fecha y hora",
  );
  assert.ok(text.includes("13:00"), "la hora debe aparecer en el mensaje");
  assert.ok(
    !text.includes("a las ."),
    "no debe quedar la hora vacía como en el caso observado",
  );
});

test("sin hora disponible se omite el tramo “a las …” en vez de dejarlo vacío", () => {
  const fecha = format(new Date(2026, 9, 28), "EEEE, d 'de' MMMM", {
    locale: es,
  });
  for (const vacia of ["", "   ", undefined, null]) {
    const text = decodeURIComponent(
      new URL(buildReservationWhatsappUrl(fecha, vacia)).searchParams.get(
        "text",
      ) ?? "",
    );
    assert.ok(
      !text.includes("a las"),
      `sin hora no debe aparecer “a las”: ${text}`,
    );
    assert.ok(
      text.includes(fecha),
      `la fecha debe mantenerse aunque falte la hora: ${text}`,
    );
  }
});

test("el default de crear reserva ofrece la misma acción WhatsApp dinámica", () => {
  const defaultIndex = source.indexOf("default:");
  assert.ok(defaultIndex >= 0, "debe existir el bloque default");
  const defaultBlock = source.slice(defaultIndex, source.indexOf("} catch"));
  assert.ok(
    defaultBlock.includes("No se ha podido crear su reserva"),
    "el default debe mantener el mensaje de error en español",
  );
  assert.ok(
    defaultBlock.includes("Contáctenos por WhatsApp"),
    "el default debe mantener la descripción existente",
  );
  assert.ok(
    defaultBlock.includes('label: "Contacto"'),
    "el toast del default debe mantener la etiqueta Contacto",
  );
  assert.ok(
    defaultBlock.includes('window.open(whatsappUrl, "_blank", "noopener,noreferrer")'),
    "la acción del default debe abrir la URL dinámica en _blank con noopener,noreferrer",
  );
});

test("el catch de crear reserva ofrece acción WhatsApp dinámica", () => {
  const catchIndex = source.indexOf("} catch");
  assert.ok(catchIndex >= 0, "debe existir el bloque catch");
  const catchBlock = source.slice(catchIndex);
  assert.ok(
    catchBlock.includes("No se ha podido crear su reserva"),
    "el catch debe mantener el mensaje de error en español",
  );
  assert.ok(
    catchBlock.includes("Contáctenos por WhatsApp"),
    "el catch debe mantener la descripción existente",
  );
  assert.ok(
    catchBlock.includes('label: "Contacto"'),
    "el toast del catch debe mantener la etiqueta Contacto",
  );
  assert.ok(
    catchBlock.includes('window.open(whatsappUrl, "_blank", "noopener,noreferrer")'),
    "la acción debe abrir la URL dinámica en _blank con noopener,noreferrer",
  );
});

test("no se tocan los casos específicos ni el éxito", () => {
  assert.ok(source.includes('"ALREADY_EXISTS"'), "debe mantener ALREADY_EXISTS");
  assert.ok(source.includes('"NO_TABLES"'), "debe mantener NO_TABLES");
  assert.ok(source.includes('"INVALID_TIME"'), "debe mantener INVALID_TIME");
  assert.ok(
    source.includes('toast.success("¡Se ha creado su reserva!")'),
    "debe mantener el toast de éxito",
  );
});
