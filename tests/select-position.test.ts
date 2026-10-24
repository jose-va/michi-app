import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const selectSource = readFileSync(
  new URL("../shadcn/components/select.tsx", import.meta.url),
  "utf8",
);

test("SelectContent defaults to popper positioning", () => {
  assert.ok(
    /position\s*=\s*"popper"/.test(selectSource),
    "el valor por defecto de position debe ser popper",
  );
  assert.ok(
    !/position\s*=\s*"item-aligned"/.test(selectSource),
    "item-aligned no debe ser el valor por defecto",
  );
});

test("no SelectContent usage relies on item-aligned positioning", () => {
  const roots = ["common", "app"];
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue;
        walk(full);
      } else if (/\.tsx$/.test(entry.name)) {
        const source = readFileSync(full, "utf8");
        if (
          source.includes("SelectContent") &&
          source.includes('"item-aligned"')
        ) {
          offenders.push(full);
        }
      }
    }
  };
  for (const root of roots) walk(join(process.cwd(), root));
  assert.deepEqual(offenders, [], "ningún uso debe depender de item-aligned");
});
