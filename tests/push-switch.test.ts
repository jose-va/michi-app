import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
function src(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

// Control de avisos con Switch shadcn (spec 010 solo-push, RNF-4):
// el interruptor sustituye a los botones «Activar/Desactivar avisos»
// manteniendo los flujos activate/deactivate, sin Badge (basta el switch
// apagado) y con el Alert destructivo debajo a ancho completo (RF-1/4/6/7/10).
// Sin botón de prueba: no hay «Probar aviso», ni probe, ni Button, con label
// asociado (a11y). El switch se deshabilita en busy, blocked y unsupported.
describe("PushSettings con Switch shadcn", () => {
  it("usa Switch y Label de shadcn con label asociado (RNF-4, a11y)", () => {
    const settings = src("common/components/admin/PushSettings.tsx");
    assert.ok(settings.includes("@/shadcn/components/switch"));
    assert.ok(settings.includes("@/shadcn/components/label"));
    assert.ok(settings.includes('htmlFor="push-avisos-switch"'));
    assert.ok(settings.includes('id="push-avisos-switch"'));
    assert.ok(settings.includes("Activar avisos"));
  });

  it("checked refleja el estado activo y el cambio conserva los flujos (RF-1/4/6/7/10)", () => {
    const settings = src("common/components/admin/PushSettings.tsx");
    assert.ok(settings.includes('checked={status === "active"}'));
    assert.ok(settings.includes("onCheckedChange"));
    assert.ok(settings.includes("next ? activate() : deactivate()"));
    // Deshabilitado en busy y en bloqueado/no soportado (no solo en busy).
    assert.ok(settings.includes('status === "blocked"'));
    assert.ok(settings.includes('status === "unsupported"'));
    assert.ok(settings.includes("disabled={switchDisabled}"));
    assert.ok(!settings.includes("Desactivar avisos"));
  });

  it("sin «Probar aviso» ni probe ni Button; sin Badge y Alert destructivo debajo a ancho completo", () => {
    const settings = src("common/components/admin/PushSettings.tsx");
    assert.ok(!settings.includes("Probar aviso"));
    assert.ok(!settings.includes("probe"));
    assert.ok(!settings.includes("requestPushTest"));
    assert.ok(!settings.includes("requestTest"));
    assert.ok(!settings.includes("@/shadcn/components/button"));
    assert.ok(!settings.includes("<Button"));
    assert.ok(!settings.includes("push-test"));
    assert.ok(!settings.includes("/api/push/test"));
    assert.ok(!settings.includes("<Badge"));
    assert.ok(!settings.includes("@/shadcn/components/badge"));
    assert.ok(!settings.includes("pushStatusText"));
    assert.ok(settings.includes("<Alert"));
    assert.ok(settings.includes('variant="destructive"'));
    assert.ok(settings.includes("w-full"));
    assert.ok(settings.includes("<AlertDescription>{message}</AlertDescription>"));
    // Orden final: la fila del switch va antes que el Alert condicional.
    const switchPos = settings.indexOf('id="push-avisos-switch"');
    const alertPos = settings.indexOf("<Alert");
    assert.ok(switchPos !== -1 && alertPos !== -1 && switchPos < alertPos);
  });
});
