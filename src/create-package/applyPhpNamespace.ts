import { logProgress, searchAndReplace, logSuccess } from "../utils";
import chalk from "chalk";
import { CreatePackageOpts } from "./";
import glob from "glob";

/**
 * Apply PHP namespace to package source files.
 *
 * @param createPackageCwd
 * @param namespace
 */
function applyPhpNamespace(createPackageCwd: string, namespace: CreatePackageOpts["namespace"]) {
    // Apply the namespace
    logProgress(`Apply namespace ${chalk.underline(namespace)} to all PHP files for autoloading...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPackageCwd, absolute: true });
    searchAndReplace(globFiles("composer.*"), /MatthiasWeb\\\\Utils/g, namespace.replace(/\\/g, "\\\\"));
    searchAndReplace(globFiles("src/**/*.php"), /MatthiasWeb\\Utils/g, namespace);
    logSuccess(`Successfully applied PHP namespace to package!`);
}

export { applyPhpNamespace };
