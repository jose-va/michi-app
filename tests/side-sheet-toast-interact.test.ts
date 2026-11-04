import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Causa raíz: con modal=true Radix (DialogContentModal) monta
// DismissableLayer con disableOutsidePointerEvents=true, que pone
// body { pointer-events: none }. El toast de sonner vive fuera del
// diálogo, así que el clic en "Abrir Whatsapp" nunca le llega:
// onInteractOutside + preventDefault solo evitaba el cierre, pero el
// pointerdown/clic seguía sin alcanzar el toast (primer clic muerto).
// Fix: Sheet no modal (modal={false}) solo en SideSheet + overlay
// visual propio que no bloquea (pointer-events-none). El clic fuera
// normal sigue cerrando (DismissableLayer onDismiss), Escape y X
// intactos, y la exención del toast evita que el panel se cierre.
const source = readFileSync(
  new URL(
    "../common/components/layout/user/SideSheet.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("SideSheet usa Sheet no modal para no bloquear el clic en el toast", () => {
  assert.ok(
    source.includes("modal={false}"),
    "SideSheet debe usar <Sheet modal={false}>",
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
});

test("mantiene un overlay visual que no bloquea el clic (modal=false no lo renderiza)", () => {
  assert.ok(
    source.includes("pointer-events-none"),
    "debe mantener un overlay visual con pointer-events-none",
  );
});
