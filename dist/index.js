#!/usr/bin/env node

// src/index.ts
import fs from "fs";
import path from "path";
import process from "process";
async function findNodeModulesDirs(rootDir) {
  const results = [];
  async function walk(current) {
    let entries;
    try {
      entries = await fs.promises.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (typeof entry.isSymbolicLink === "function" && entry.isSymbolicLink()) {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.name === "node_modules") {
        results.push(fullPath);
        continue;
      }
      await walk(fullPath);
    }
  }
  await walk(rootDir);
  return results;
}
async function deleteDir(dir) {
  await fs.promises.rm(dir, { recursive: true, force: true });
}
async function deleteNodeModules(rootDir) {
  const absRoot = path.resolve(rootDir);
  const found = await findNodeModulesDirs(absRoot);
  const deleted = [];
  for (const dir of found) {
    try {
      await deleteDir(dir);
      deleted.push(dir);
    } catch (err) {
      console.error(`Failed to delete ${dir}:`, err?.message ?? err);
    }
  }
  return { found, deleted };
}
(async function() {
  const dirArg = process.argv[2] || process.cwd();
  if (!fs.existsSync(dirArg)) {
    console.log("Invalid path argument");
    return;
  }
  await deleteNodeModules(dirArg);
})();
export {
  deleteDir,
  deleteNodeModules,
  findNodeModulesDirs
};
//# sourceMappingURL=index.js.map