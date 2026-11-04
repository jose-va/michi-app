import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const cases: Array<[string, string]> = [
  ["AvailabilityForm", "common/components/forms/reservation/AvailabilityForm.tsx"],
  ["FormInput", "shadcn/components/form-input.tsx"],
];

for (const [name, path] of cases) {
  test(`«(opcional)» de ${name} va atenuado dentro del FormLabel`, () => {
    const src = read(path);
    const match = src.match(
      /<FormLabel>[\s\S]*?<span className="([^"]*)">\s*\(opcional\)\s*<\/span>[\s\S]*?<\/FormLabel>/,
    );
    assert.ok(match, "span con (opcional) dentro de FormLabel");
    assert.ok(match[1].includes("text-muted-foreground"));
    assert.ok(match[1].includes("font-normal"));
    assert.ok(!match[1].includes("font-extralight"));
  });
}
