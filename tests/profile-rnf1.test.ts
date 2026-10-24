import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const dir = "../common/components/layout/user/";
const read = (name: string): string =>
  readFileSync(new URL(dir + name, import.meta.url), "utf8");

const userTabs = read("UserProfileTabs.tsx");
const adminTabs = read("AdminProfileTabs.tsx");
const sideSheet = read("SideSheet.tsx");
const profileHeader = read("ProfileHeader.tsx");
const profileAvatar = read("ProfileAvatar.tsx");
const userMenu = read("UserMenu.tsx");
const favoritePhoto = read("FavoriteProductPhoto.tsx");

const panel = [
  userTabs,
  adminTabs,
  sideSheet,
  profileHeader,
  profileAvatar,
  userMenu,
  favoritePhoto,
];

test("T8: el panel usa los literales exactos en español (Opción A)", () => {
  assert.ok(
    userTabs.includes("Todavía no has realizado ninguna reserva"),
    "Mi reserva debe mostrar el vacío exacto RF-10",
  );
  assert.ok(
    userTabs.includes("No tienes productos favoritos"),
    "Favoritos debe mostrar el vacío exacto RF-11",
  );
  assert.ok(
    userTabs.includes("No se ha podido cargar la información"),
    "Mi reserva debe mostrar el error exacto RF-15",
  );
  assert.ok(
    adminTabs.includes("Todavía no hay reservas"),
    "Reservas de hoy debe mostrar el vacío exacto RF-12",
  );
  assert.ok(
    adminTabs.includes("No se ha podido cargar la información"),
    "Reservas de hoy debe mostrar el error exacto RF-15",
  );
});

test("T8: textos de avatar en español, sin identificadores en inglés", () => {
  assert.ok(
    !profileAvatar.includes("michi-user"),
    "El alternativo del avatar no debe usar el identificador en inglés",
  );
  assert.ok(
    profileAvatar.includes("Foto de perfil de"),
    "El alternativo del avatar debe estar en español",
  );
  assert.ok(
    profileHeader.includes("Foto de perfil de"),
    "La cabecera debe mantener su alternativo en español",
  );
});

test("T8: sin anchos fijos ni scroll horizontal a 360 px", () => {
  for (const source of panel) {
    assert.ok(
      !/w-\[\d+px\]/.test(source),
      "El panel no debe usar anchos fijos en píxeles",
    );
    assert.ok(
      !/min-w-\[\d+px\]/.test(source),
      "El panel no debe usar anchos mínimos fijos en píxeles",
    );
    assert.ok(
      !source.includes("overflow-x-"),
      "El panel no debe forzar desplazamiento horizontal",
    );
    assert.ok(
      !source.includes("whitespace-nowrap"),
      "El panel no debe impedir el ajuste de línea",
    );
  }
  assert.ok(
    userTabs.includes("min-w-0") && userTabs.includes("flex-col"),
    "El contenido debe apilarse en columna con ancho flexible",
  );
  assert.ok(
    adminTabs.includes("min-w-0") && adminTabs.includes("flex-col"),
    "El listado de hoy debe apilarse en columna con ancho flexible",
  );
});
