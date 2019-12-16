import chalk from "chalk";
import { CreatePackageOpts } from "./program";
import { readFileSync } from "fs-extra";
import { resolve } from "path";
import { DEFAULT_ENCODING, logProgress, logSuccess, searchAndReplace } from "../utils";
import glob from "glob";

/**
 * Apply a package name to a given cwd. The scope name is automatically read from
 * the parent root package.json#name variable.
 *
 * @param createPackageCwd
 * @param name
 */
function applyName(createPackageCwd: string, name: CreatePackageOpts["packageName"]) {
    // Generate scoped package name
    const scopeName =
        JSON.parse(readFileSync(resolve(createPackageCwd, "../../package.json"), { encoding: DEFAULT_ENCODING })).name +
        "/" +
        name;

    logProgress(`Apply package name ${chalk.underline(scopeName)} to ${chalk.underline(createPackageCwd)}`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPackageCwd, absolute: true });
    const files = [...globFiles("{package,composer}.json"), ...globFiles("README.md")];
    searchAndReplace(files, /wp-reactjs-multi-starter\/utils/g, scopeName);
    logSuccess(`Successfully applied name to package!`);

    return scopeName;
}

export { applyName };
