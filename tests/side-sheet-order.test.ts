import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const sideSheet = readFileSync(
  new URL("../common/components/layout/user/SideSheet.tsx", import.meta.url),
  "utf8",
);
const profileAuth = readFileSync(
  new URL("../common/components/layout/user/ProfileAuth.tsx", import.meta.url),
  "utf8",
);
const pageMenu = readFileSync(
  new URL("../common/components/layout/PageMenu.tsx", import.meta.url),
  "utf8",
);
const rootLayout = readFileSync(
  new URL("../app/layout.tsx", import.meta.url),
  "utf8",
);
const userMenu = readFileSync(
  new URL("../common/components/layout/user/UserMenu.tsx", import.meta.url),
  "utf8",
);
const adminTabs = readFileSync(
  new URL("../common/components/layout/user/AdminProfileTabs.tsx", import.meta.url),
  "utf8",
);

test("orden perfil > pestañas > enlaces en rol usuario; admin lleva opciones en pestañas (RF-8)", () => {
  assert.ok(
    sideSheet.includes("<ProfileHeader user={user}"),
    "SideSheet debe mostrar el perfil compartido con los datos del usuario",
  );
  assert.ok(
    sideSheet.includes("{profileTabs}"),
    "SideSheet debe mostrar las pestañas recibidas como ranura",
  );
  const userMenuExpression =
    '{user.role === "ROLE_USER" ? (<div><UserMenu /></div>) : null}';
  assert.ok(
    sideSheet.includes(userMenuExpression),
    "SideSheet debe mostrar enlaces solo en rol usuario",
  );
  const profileIndex = sideSheet.indexOf("<ProfileHeader user={user}");
  const tabsIndex = sideSheet.indexOf("{profileTabs}");
  const menuIndex = sideSheet.indexOf(userMenuExpression);
  assert.ok(
    profileIndex !== -1 && tabsIndex !== -1 && menuIndex !== -1,
    "Perfil, pestañas y enlaces deben existir en SideSheet",
  );
  assert.ok(
    profileIndex < tabsIndex && tabsIndex < menuIndex,
    "El orden debe ser perfil > pestañas > enlaces",
  );
});

test("títulos exactos por rol (RF-8)", () => {
  assert.ok(
    sideSheet.includes('"¡Bienvenido!"'),
    'El título de usuario debe ser exactamente "¡Bienvenido!"',
  );
  assert.ok(
    !sideSheet.includes("Bienvenido,"),
    "El título de usuario no debe incluir el nombre",
  );
  assert.ok(
    sideSheet.includes('"Panel de administrador"'),
    "El título de administrador debe conservarse",
  );
});

test("menú de usuario solo Nueva reserva y opciones de admin en pestañas (RF-13, RF-14)", () => {
  assert.ok(
    sideSheet.includes("<UserMenu />") && !sideSheet.includes("<AdminMenu />"),
    "SideSheet debe usar UserMenu y no AdminMenu",
  );
  assert.ok(
    !sideSheet.includes("next/link") && !sideSheet.includes('href='),
    "SideSheet no debe añadir ni cambiar destinos de enlaces",
  );
  assert.ok(
    userMenu.includes('href="/reservation/preview"') &&
      userMenu.includes("Nueva reserva"),
    'UserMenu debe mostrar solo el enlace "Nueva reserva"',
  );
  assert.ok(
    !userMenu.includes("/product/favorite") &&
      !userMenu.includes("Productos favoritos"),
    "UserMenu no debe tener ningún enlace ni resto a /product/favorite",
  );
  assert.ok(
    adminTabs.includes('href="/reservation/preview"') &&
      adminTabs.includes("Reservas"),
    "Opciones debe mantener el enlace Reservas",
  );
  assert.ok(
    adminTabs.includes('href="/product/create"') &&
      adminTabs.includes("Crear producto"),
    "Opciones debe mantener el enlace Crear producto",
  );
});

test("pestañas servidoras como ranura desde padre servidor", () => {
  assert.ok(
    sideSheet.startsWith('"use client"'),
    "SideSheet sigue siendo cliente (disparador y cierre de sesión)",
  );
  assert.ok(
    sideSheet.includes("profileTabs"),
    "SideSheet debe aceptar la ranura de pestañas",
  );
  assert.ok(
    sideSheet.includes("ReactNode") || sideSheet.includes("React.ReactNode"),
    "La ranura debe tiparse como nodo React",
  );
  assert.ok(
    !sideSheet.includes("UserProfileTabs") &&
      !sideSheet.includes("AdminProfileTabs") &&
      !sideSheet.includes("ReservationService") &&
      !sideSheet.includes("ProductService"),
    "SideSheet no debe importar pestañas ni servicios (solo servidor)",
  );
  assert.ok(
    !pageMenu.includes('"use client"'),
    "PageMenu debe seguir siendo servidor para crear la ranura",
  );
  assert.ok(
    pageMenu.includes("<UserProfileTabs user={user} />") &&
      pageMenu.includes("<AdminProfileTabs user={user} />"),
    "PageMenu debe crear la pestaña según el rol",
  );
  assert.ok(
    profileAuth.includes("profileTabs") &&
      profileAuth.includes("<SideSheet user={user} profileTabs={profileTabs}"),
    "ProfileAuth debe pasar la ranura a SideSheet",
  );
  assert.ok(
    rootLayout.includes("<PageMenu user={user}>"),
    "RootLayout debe dar a PageMenu el usuario ya cargado",
  );
});

test("ruta /product/favorite eliminada con redirect permanente a /product (RF-13)", async () => {
  const { existsSync } = await import("node:fs");
  assert.ok(
    !existsSync(
      new URL("../app/product/favorite/page.tsx", import.meta.url),
    ),
    "La ruta app/product/favorite no debe existir",
  );
  const nextConfig = readFileSync(
    new URL("../next.config.ts", import.meta.url),
    "utf8",
  );
  assert.ok(
    nextConfig.includes("redirects") &&
      nextConfig.includes('"/product/favorite"') &&
      nextConfig.includes('"/product"') &&
      nextConfig.includes("permanent: true"),
    "/product/favorite debe redirigir de forma permanente a /product en next.config",
  );
});
