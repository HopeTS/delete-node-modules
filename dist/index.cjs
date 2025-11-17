#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  deleteDir: () => deleteDir,
  deleteNodeModules: () => deleteNodeModules,
  findNodeModulesDirs: () => findNodeModulesDirs
});
module.exports = __toCommonJS(index_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_process = __toESM(require("process"), 1);
async function findNodeModulesDirs(rootDir) {
  const results = [];
  async function walk(current) {
    let entries;
    try {
      entries = await import_fs.default.promises.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (typeof entry.isSymbolicLink === "function" && entry.isSymbolicLink()) {
        continue;
      }
      const fullPath = import_path.default.join(current, entry.name);
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
  await import_fs.default.promises.rm(dir, { recursive: true, force: true });
}
async function deleteNodeModules(rootDir) {
  const absRoot = import_path.default.resolve(rootDir);
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
  const dirArg = import_process.default.argv[2] || import_process.default.cwd();
  if (!import_fs.default.existsSync(dirArg)) {
    console.log("Invalid path argument");
    return;
  }
  await deleteNodeModules(dirArg);
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteDir,
  deleteNodeModules,
  findNodeModulesDirs
});
//# sourceMappingURL=index.cjs.map