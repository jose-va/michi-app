import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  EDIT_INVALID_ID_MESSAGE,
  EDIT_NOT_MODIFIABLE_MESSAGE,
  EDIT_SUCCESS_TOAST_MESSAGE,
  mapEditLoadError,
  resolveUpdateErrorMessage,
} from "../common/utils/reservation-edit";

// T8 (RF-11, RF-8, RNF-1, RNF-3, RNF-6): lápiz del perfil + pulido final.
// El botón lápiz existe en `ReservationEdit.tsx` sin ruta: debe navegar a
// `/reservation/edit?id=<id>` (como los enlaces del perfil con
// `SheetClose` + `Link`); el indicador de carga sigue en español y no
// interactuable; ningún aviso muestra códigos ni datos sensibles.

const editSource = readFileSync(
  new URL(
    "../common/components/ui/reservation/ReservationEdit.tsx",
    import.meta.url,
  ),
  "utf8",
);

const byDaySource = readFileSync(
  new URL(
    "../common/components/layout/user/UserReservationsByDay.tsx",
    import.meta.url,
  ),
  "utf8",
);

const pageSource = readFileSync(
  new URL("../app/reservation/edit/page.tsx", import.meta.url),
  "utf8",
);

const editPageSource = readFileSync(
  new URL(
    "../common/components/pages/reservation/EditReservationPage.tsx",
    import.meta.url,
  ),
  "utf8",
);

// RF-11: el lápiz navega a `/reservation/edit?id=<id>` con el id de la
// reserva como parámetro de consulta `id` (no como segmento de ruta).
test("el lápiz navega a /reservation/edit?id=<id>", () => {
  assert.ok(
    editSource.includes("/reservation/edit"),
    "ReservationEdit debe enlazar a /reservation/edit",
  );
  assert.ok(
    editSource.includes("id=") || editSource.includes("?id="),
    "ReservationEdit debe pasar el id como parámetro de consulta",
  );
  assert.ok(
    editSource.includes("next/link") || editSource.includes("Link"),
    "ReservationEdit debe navegar con Link (sin fetch propio)",
  );
});

// RF-11: el perfil pasa el id de cada reserva al lápiz.
test("el perfil pasa el id de la reserva al lápiz", () => {
  assert.ok(
    byDaySource.includes("ReservationEdit"),
    "UserReservationsByDay debe usar ReservationEdit",
  );
  assert.ok(
    /<ReservationEdit[^>]*\bid=/.test(byDaySource),
    "UserReservationsByDay debe pasar id=<…> a ReservationEdit",
  );
});

// RF-11: el lápiz conserva su etiqueta accesible al navegar.
test("el lápiz conserva su aria-label al navegar", () => {
  assert.ok(
    editSource.includes("Modificar reserva de"),
    "ReservationEdit debe conservar el aria-label «Modificar reserva de …»",
  );
});

// RF-8: indicador de carga en español y no interactuable (sin botones ni
// formulario hasta disponer de la reserva).
test("la carga muestra un indicador en español no interactuable", () => {
  assert.ok(
    pageSource.includes("Cargando los datos de su reserva"),
    "la ruta de edición debe mostrar el indicador en español",
  );
  const loadingBlock = pageSource.slice(
    pageSource.indexOf("EditLoadingNotice"),
  );
  for (const interactive of ["<button", "<form", "<Link", "<a "]) {
    assert.ok(
      !loadingBlock.includes(interactive),
      `el indicador de carga no debe contener «${interactive}»`,
    );
  }
});

// RNF-1 + RNF-6: ningún aviso de la edición muestra códigos del backend ni
// estados numéricos; los textos visibles están en español. El literal del
// backend (RF-16, con el teléfono) se muestra tal cual y queda exento.
test("ningún aviso de la edición muestra códigos (RNF-6)", () => {
  const messages = [
    EDIT_INVALID_ID_MESSAGE,
    EDIT_NOT_MODIFIABLE_MESSAGE,
    EDIT_SUCCESS_TOAST_MESSAGE,
    mapEditLoadError("NOT_FOUND"),
    mapEditLoadError("FORBIDDEN"),
    mapEditLoadError("NETWORK"),
    mapEditLoadError("UNAUTHENTICATED"),
    resolveUpdateErrorMessage({ kind: "FORBIDDEN", backendMessage: null }),
    resolveUpdateErrorMessage({
      kind: "NOT_MODIFIABLE",
      backendMessage: null,
    }),
    resolveUpdateErrorMessage({ kind: "VALIDATION", backendMessage: null }),
    resolveUpdateErrorMessage({ kind: "GENERIC", backendMessage: null }),
  ];
  const forbidden = [
    "RESERVATION_NOT_MODIFIABLE",
    "INVALID_TIME",
    "RESERVATION_ALREADY_EXISTS",
    "NO_TABLES_AVAILABLE",
    "404",
    "403",
    "409",
    "500",
  ];
  for (const message of messages) {
    assert.ok(message.length > 0);
    for (const code of forbidden) {
      assert.ok(
        !message.includes(code),
        `el aviso «${message}» no debe contener «${code}»`,
      );
    }
  }
});

// RNF-6: la ruta y la página de edición no muestran códigos a la persona
// usuaria (los códigos solo dirigen la lógica en `reservation-edit.ts` y en
// la reconstrucción del cuerpo para `mapUpdateError`). Se prohíbe
// interpolarlos como contenido visible o en avisos.
test("la UI de edición no renderiza códigos del backend", () => {
  for (const [file, source] of [
    ["page.tsx", pageSource],
    ["EditReservationPage.tsx", editPageSource],
  ] as const) {
    assert.ok(
      !source.includes("toast.error(result.code") &&
        !source.includes("toast.error(code") &&
        !source.includes(">{result.code}") &&
        !source.includes(">{code}"),
      `${file} no debe mostrar códigos en la UI`,
    );
  }
});

// RNF-1: la página de edición no muestra textos en inglés al usuario.
test("la página de edición no muestra textos en inglés", () => {
  for (const english of ["Loading", "Save changes", "Modify reservation"]) {
    assert.ok(
      !editPageSource.includes(`>${english}<`) &&
        !editPageSource.includes(`"${english}"`),
      `EditReservationPage no debe mostrar «${english}»`,
    );
  }
});

// Vista móvil (pendiente de T7): el formulario de edición apila en móvil y
// ensancha a `md` (botones a ancho completo en pantallas estrechas).
test("el formulario de edición es apilable en móvil", () => {
  assert.ok(
    editPageSource.includes("flex-col"),
    "EditReservationPage debe apilar en móvil",
  );
  assert.ok(
    editPageSource.includes("w-full") && editPageSource.includes("md:w-auto"),
    "los botones deben ocupar todo el ancho en móvil",
  );
});
