#!/usr/bin/env node
/**
 * Recursively walk a directory and find all node_modules folders.
 *
 * @param rootDir Absolute path to search from.
 *
 * @return List of absolute paths to node_modules folders.
 */
declare function findNodeModulesDirs(rootDir: string): Promise<string[]>;
/**
 * Delete a directory recursively (like rm -rf).
 */
declare function deleteDir(dir: string): Promise<void>;
interface DeleteNodeModulesResult {
    found: string[];
    deleted: string[];
}
/**
 * Find and delete all node_modules under rootDir.
 */
declare function deleteNodeModules(rootDir: string): Promise<DeleteNodeModulesResult>;

export { type DeleteNodeModulesResult, deleteDir, deleteNodeModules, findNodeModulesDirs };
