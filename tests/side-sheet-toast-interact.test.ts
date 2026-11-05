import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Experimento: con Sheet modal=true Radix monta DismissableLayer con
// disableOutsidePointerEvents=true, que pone body { pointer-events: none }
// inline y re-activa blur + focus trap originales. El toast de sonner vive
// fuera del diálogo (hijo de body), así que hereda el none y el clic en
// "Abrir Whatsapp" nunca le llega. Hipótesis: basta una regla CSS mínima
// [data-sonner-toaster]{pointer-events:auto;} (hijo explícito gana a la
// herencia) + la exención onInteractOutside con preventDefault para que el
// primer clic abra wa.me sin cerrar el Sheet.
// NOTA: lo verificable por código se comprueba aquí; la validación real
// (ratón/teclado/táctil/lector) es manual en navegador con el Sheet abierto
// y el toast visible.
const source = readFileSync(
  new URL(
    "../common/components/layout/user/SideSheet.tsx",
    import.meta.url,
  ),
  "utf8",
);
const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

test("SideSheet usa Sheet modal (recupera blur + focus trap originales)", () => {
  assert.ok(
    !source.includes("modal={false}"),
    "SideSheet no debe usar <Sheet modal={false}>",
  );
});

test("SheetContent exime el toast de sonner del cierre por clic fuera", () => {
  assert.ok(
    source.includes("onInteractOutside"),
    "SheetContent debe gestionar onInteractOutside",
  );
  assert.ok(
    source.includes("[data-sonner-toast]"),
    "debe eximir el toast de sonner ([data-sonner-toast])",
  );
  assert.ok(
    source.includes("preventDefault"),
    "debe evitar el cierre con preventDefault al pulsar el toast",
  );
});

test("la exención solo aplica al toast, no bloquea el cierre normal", () => {
  const handlerIndex = source.indexOf("onInteractOutside={");
  assert.ok(handlerIndex >= 0, "debe existir el manejador onInteractOutside");
  const handlerBlock = source.slice(handlerIndex, handlerIndex + 800);
  assert.ok(
    handlerBlock.includes("closest"),
    "la exención debe comprobar el objetivo del clic con closest",
  );
  assert.ok(
    handlerBlock.includes("[data-sonner-toast]"),
    "la condición debe referirse al toast de sonner",
  );
  // Sin preventDefault incondicional: el clic fuera normal debe seguir
  // cerrando el Sheet.
  assert.ok(
    !/onInteractOutside=\{\([^)]*\)\s*=>\s*\w+\.preventDefault\(\)\s*\}/.test(
      source,
    ),
    "no debe bloquear preventDefault de forma incondicional",
  );
  assert.ok(
    !source.includes("onEscapeKeyDown"),
    "Escape debe seguir cerrando (sin interceptarlo)",
  );
  assert.ok(
    !source.includes("onPointerDownOutside") &&
      !source.includes("onFocusOutside"),
    "sin onPointerDownOutside/onFocusOutside redundantes (onInteractOutside ya cubre ambos)",
  );
});

test("sin overlay visual propio (modal=true ya renderiza el suyo con blur)", () => {
  assert.ok(
    !source.includes("pointer-events-none"),
    "no debe mantener overlay visual propio con pointer-events-none",
  );
});

test("globals.css re-activa pointer-events en el toaster de sonner", () => {
  assert.ok(
    css.includes("[data-sonner-toaster]") && css.includes("pointer-events"),
    "globals.css debe re-activar pointer-events en [data-sonner-toaster]",
  );
});
