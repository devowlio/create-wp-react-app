import { CreatePackageOpts, copyTemplates, createExampleFiles } from "./";
import { resolve } from "path";
import { existsSync } from "fs-extra";
import { generateLicenseFile, logSuccess, logProgress, runThirdPartyLicenseForPackage } from "../utils";
import chalk from "chalk";
import execa from "execa";
import {
    applyGitLabCi,
    modifyRootGitLabCiInclude,
    applyPackageJson,
    applyPhpNamespace,
    regenerateLaunchJson
} from "../misc";
import { applyName } from "./applyName";

/**
 * Generate a new package from the template. All validations are done in createPackagePrompt.
 *
 * @param root
 * @param input
 * @param fromWorkspace
 * @returns
 * @throws
 */
async function createPackageExecute(root: any, input: CreatePackageOpts) {
    const createPackageCwd = resolve(input.cwd, "packages", input.packageName);

    // Strictly do not override an existing plugin!!
    if (existsSync(createPackageCwd)) {
        throw new Error(`You already have a package with name ${input.packageName}.`);
    }

    copyTemplates(createPackageCwd);
    applyName(createPackageCwd, input.packageName);
    applyPhpNamespace(createPackageCwd, input.namespace, "utils");
    applyGitLabCi(createPackageCwd, input.abbreviation, "utils ");
    applyGitLabCi(createPackageCwd, input.packageName, "utils");
    applyPackageJson(
        root,
        createPackageCwd,
        {
            author: input.author,
            description: input.packageDesc,
            homepage: input.packageUri,
            version: "1.0.0"
        },
        false
    );
    modifyRootGitLabCiInclude("add", input.cwd, input.packageName, "packages");
    generateLicenseFile(createPackageCwd, input.author, input.packageDesc);
    createExampleFiles(createPackageCwd, input.packageName, input.namespace);
    logSuccess(`Successfully created package ${input.packageName} in ${chalk.underline(createPackageCwd)}`);

    logProgress("Bootstrap and link new package...");
    execa.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
    execa.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });

    runThirdPartyLicenseForPackage(createPackageCwd);
    regenerateLaunchJson(input.cwd);

    logProgress(`Rebuild the development environment, afterwards you can use your new package...`);
    execa("yarn", ["docker:start"], { cwd: input.cwd, stdio: "inherit" });
}

export { createPackageExecute };
