import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  planProductImageOperation,
  shouldDeleteOldProductImage,
} from "../common/utils/product-image";
import { moveImageFile } from "../lib/product-image-files";

const read = (p: string) =>
  readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const plan = (
  oldName: string,
  newName: string,
  hasNewPhoto = false,
  removeExisting = false,
) =>
  planProductImageOperation({ oldName, newName, hasNewPhoto, removeExisting });

test("plan: nombre igual sin cambios → none", () => {
  assert.equal(plan("Maki", "Maki"), "none");
});

test("plan: nombre cambiado sin foto → rename", () => {
  assert.equal(plan("Maki", "Nigiri"), "rename");
});

test("plan: nombre cambiado con foto nueva → replace", () => {
  assert.equal(plan("Maki", "Nigiri", true), "replace");
});

test("plan: espacios y barras equivalentes → none", () => {
  assert.equal(plan("Maki", "  Maki  "), "none");
  assert.equal(plan("Maki Roll", "Maki/ Roll"), "none");
});

test("plan: removeExisting sin foto → delete", () => {
  assert.equal(plan("Maki", "Maki", false, true), "delete");
  assert.equal(plan("Maki", "Nigiri", false, true), "delete");
});

test("plan: removeExisting + foto nueva → replace", () => {
  assert.equal(plan("Maki", "Maki", true, true), "replace");
});

test("plan: foto nueva con mismo nombre → replace", () => {
  assert.equal(plan("Maki", "Maki", true), "replace");
});

test("plan: cambio solo de mayúsculas → rename", () => {
  assert.equal(plan("Maki", "MAKI"), "rename");
});

test("shouldDeleteOldProductImage: solo si el nombre cambia de verdad", () => {
  assert.equal(shouldDeleteOldProductImage("Maki", "Nigiri"), true);
  assert.equal(shouldDeleteOldProductImage("Maki", " Maki "), false);
  assert.equal(shouldDeleteOldProductImage("Maki", "MAKI"), false);
});

async function withDir(fn: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), "michi-img-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("moveImageFile: renamed mueve el archivo", () =>
  withDir(async (dir) => {
    await writeFile(join(dir, "a.webp"), "A");
    assert.equal(await moveImageFile(dir, "a.webp", "b.webp"), "renamed");
    assert.equal(await readFile(join(dir, "b.webp"), "utf8"), "A");
    assert.deepEqual(await readdir(dir), ["b.webp"]);
  }));

test("moveImageFile: missing si el origen no existe", () =>
  withDir(async (dir) => {
    assert.equal(await moveImageFile(dir, "a.webp", "b.webp"), "missing");
    assert.deepEqual(await readdir(dir), []);
  }));

test("moveImageFile: exists no sobrescribe el destino", () =>
  withDir(async (dir) => {
    await writeFile(join(dir, "a.webp"), "A");
    await writeFile(join(dir, "b.webp"), "B");
    assert.equal(await moveImageFile(dir, "a.webp", "b.webp"), "exists");
    assert.equal(await readFile(join(dir, "a.webp"), "utf8"), "A");
    assert.equal(await readFile(join(dir, "b.webp"), "utf8"), "B");
  }));

test("moveImageFile: solo mayúsculas permite el rename directo", () =>
  withDir(async (dir) => {
    await writeFile(join(dir, "maki.webp"), "A");
    assert.equal(await moveImageFile(dir, "maki.webp", "MAKI.webp"), "renamed");
    assert.deepEqual(await readdir(dir), ["MAKI.webp"]);
    assert.equal(await readFile(join(dir, "MAKI.webp"), "utf8"), "A");
  }));

test("renameProductImage existe en server-actions, sanea y no sobrescribe", () => {
  const src = read("lib/server-actions.ts");
  assert.match(src, /export async function renameProductImage\(/);
  assert.match(src, /"renamed" \| "missing" \| "exists" \| "error"/);
  assert.match(src, /buildProductImageFileName\(oldName\)/);
  assert.match(src, /buildProductImageFileName\(newName\)/);
  assert.match(src, /moveImageFile\(/);
  const helper = read("lib/product-image-files.ts");
  assert.match(helper, /"exists"/);
  assert.match(helper, /access\(/);
  assert.doesNotMatch(helper, /writeFile/);
});

test("ProductFormPage avisa con toast.warning y llama a renameProductImage", () => {
  const src = read("common/components/pages/product/ProductFormPage.tsx");
  assert.match(src, /renameProductImage\(product\.name, data\.name\)/);
  assert.match(
    src,
    /toast\.warning\(\s*"Producto actualizado, pero ya existe una imagen con el nuevo nombre; no se ha movido la foto\."/,
  );
  assert.match(
    src,
    /toast\.warning\(\s*"Producto actualizado, pero no se ha podido mover la imagen\."/,
  );
  assert.match(src, /planProductImageOperation\(/);
});
