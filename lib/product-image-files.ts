import { access, rename } from "node:fs/promises";
import { join } from "node:path";

export type MoveImageResult = "renamed" | "missing" | "exists";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return false;
    throw error;
  }
}

/**
 * Mueve `oldFile` a `newFile` dentro de `dir` sin sobrescribir.
 * - "missing": el origen no existe.
 * - "exists": el destino existe (y no es solo un cambio de mayúsculas).
 */
export async function moveImageFile(
  dir: string,
  oldFile: string,
  newFile: string
): Promise<MoveImageResult> {
  const from = join(dir, oldFile);
  const to = join(dir, newFile);
  if (!(await fileExists(from))) return "missing";
  const caseOnly =
    oldFile !== newFile && oldFile.toLowerCase() === newFile.toLowerCase();
  if (!caseOnly && (await fileExists(to))) return "exists";
  await rename(from, to);
  return "renamed";
}
