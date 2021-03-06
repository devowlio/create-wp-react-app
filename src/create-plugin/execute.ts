import { resolve } from "path";
import { CreatePluginOpts } from "./program";
import { existsSync } from "fs";
import {
    copyTemplates,
    applyPromptsToTemplates,
    applyPhpConstants,
    applyPhpFunctions,
    applySlug,
    preInstallationBuilds
} from "./";
import { logSuccess, logProgress, runThirdPartyLicenseForPackage, generateLicenseFile } from "../utils";
import chalk from "chalk";
import execa from "execa";
import {
    applyGitLabCi,
    modifyRootGitLabCiInclude,
    applyPackageJson,
    regenerateLaunchJson,
    applyPhpNamespace
} from "../misc";

/**
 * Generate a new plugin from the template. All validations are done in createPluginPrompt.
 *
 * @param root
 * @param input
 * @param fromWorkspace
 * @returns
 * @throws
 */
async function createPluginExecute(root: any, input: CreatePluginOpts, fromWorkspace = false) {
    const createPluginCwd = resolve(input.cwd, "plugins", input.slug);

    // Strictly do not override an existing plugin!!
    if (existsSync(createPluginCwd)) {
        throw new Error(`You already have a plugin with slug ${input.slug}.`);
    }

    const templates = copyTemplates(createPluginCwd);
    const appliedTemplates = applyPromptsToTemplates(root.name, createPluginCwd, templates, input);
    applyPhpConstants(createPluginCwd, appliedTemplates, input.constantPrefix);
    applyPhpFunctions(createPluginCwd, input.constantPrefix);
    applySlug(root.name, createPluginCwd, input.slug);
    applyGitLabCi(createPluginCwd, input.constantPrefix, "wprjss");
    applyPackageJson(
        root.name,
        createPluginCwd,
        {
            author: input.author,
            description: input.pluginDesc,
            homepage: input.pluginUri,
            version: input.pluginVersion
        },
        fromWorkspace ? "1.0.0" : true
    );
    modifyRootGitLabCiInclude("add", input.cwd, input.slug, "plugins");
    generateLicenseFile(createPluginCwd, input.author, input.pluginDesc);
    logSuccess(`Successfully created plugin ${input.pluginName} in ${chalk.underline(createPluginCwd)}`);

    if (!fromWorkspace) {
        applyPhpNamespace(createPluginCwd, input.namespace, "plugin");

        logProgress("Bootstrap and link new plugin...");
        execa.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
        execa.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });

        runThirdPartyLicenseForPackage(createPluginCwd);
        regenerateLaunchJson(input.cwd);

        // First builds
        preInstallationBuilds(createPluginCwd);

        logProgress(`Rebuild the development environment, afterwards you can activate your new plugin...`);
        execa("yarn", ["docker:start"], { cwd: input.cwd, stdio: "inherit" });
    }

    return createPluginCwd;
}

export { createPluginExecute };
