#!/usr/bin/env node
import fs from "fs";
import path from "path";

/**
 * Recursively walk a directory and find all node_modules folders.
 *
 * @param rootDir Absolute path to search from.
 * @returns List of absolute paths to node_modules folders.
 */
export async function findNodeModulesDirs(rootDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string): Promise<void> {
    let entries: fs.Dirent[];

    try {
      entries = await fs.promises.readdir(current, { withFileTypes: true });
    } catch {
      // Skip directories we can't read
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // Skip symlink directories
      if (
        typeof entry.isSymbolicLink === "function" &&
        entry.isSymbolicLink()
      ) {
        continue;
      }

      const fullPath = path.join(current, entry.name);

      if (entry.name === "node_modules") {
        results.push(fullPath);
        // Don't descend into node_modules; it's going to be deleted
        continue;
      }

      await walk(fullPath);
    }
  }

  await walk(rootDir);
  return results;
}

/**
 * Delete a directory recursively (like rm -rf).
 */
export async function deleteDir(dir: string): Promise<void> {
  await fs.promises.rm(dir, { recursive: true, force: true });
}

export interface DeleteNodeModulesResult {
  found: string[];
  deleted: string[];
}

/**
 * Find and delete all node_modules under rootDir.
 */
export async function deleteNodeModules(
  rootDir: string
): Promise<DeleteNodeModulesResult> {
  const absRoot = path.resolve(rootDir);
  const found = await findNodeModulesDirs(absRoot);

  const deleted: string[] = [];

  for (const dir of found) {
    try {
      await deleteDir(dir);
      deleted.push(dir);
    } catch (err: any) {
      console.error(`Failed to delete ${dir}:`, err?.message ?? err);
    }
  }

  return { found, deleted };
}
