import { prompt } from "inquirer";
import { resolve } from "path";
import { CreatePluginOpts } from "./program";
import { existsSync } from "fs";
import {
    copyTemplates,
    applyPromptsToTemplates,
    applyPhpConstantsAndNamespace,
    applyPhpFunctions,
    applySlug,
    applyGitLabCi,
    modifyRootGitLabCiInclude,
    PROMPT_AFTER_BOOTSTRAP,
    preInstallationBuilds
} from "./";
import { logSuccess, logProgress } from "../utils";
import chalk from "chalk";
import execa from "execa";
import { applyPackageJson } from "./applyPackageJson";

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
    const appliedTemplates = applyPromptsToTemplates(createPluginCwd, templates, input);
    applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, input.constantPrefix, input.namespace);
    applyPhpFunctions(createPluginCwd, input.constantPrefix);
    applySlug(root.name, createPluginCwd, input.slug);
    applyGitLabCi(createPluginCwd, input.constantPrefix);
    applyPackageJson(root.name, createPluginCwd, input);
    modifyRootGitLabCiInclude("add", input.cwd, input.slug);
    logSuccess(`Successfully created plugin ${input.pluginName} in ${chalk.underline(createPluginCwd)}`);

    if (!fromWorkspace) {
        // TODO: Ask for add-on development

        logProgress("Bootstrap and link new plugin...");
        execa.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
        execa.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });

        // Start initial builds...
        const answers = await prompt([
            ...PROMPT_AFTER_BOOTSTRAP,
            {
                name: "dev",
                type: "confirm",
                message: `Would you like to rebuild the development environment with ${chalk.underline(
                    "yarn docker:start"
                )} so your new plugin is visible?`,
                default: "y"
            }
        ]);

        // First builds
        preInstallationBuilds(
            {
                build: answers.build as boolean,
                docs: answers.docs as boolean
            },
            createPluginCwd
        );

        if (answers.dev) {
            logProgress(`Rebuild the development environment, afterwards you can activate your new plugin...`);
            execa("yarn", ["docker:start"], { cwd: input.cwd, stdio: "inherit" });
        }
    }

    return createPluginCwd;
}

/* createPluginExecute(
    {
        name: "test"
    },
    {
        cwd: "/d/Programme/VSCode Workspace/create-wp-react-app/test",
        pluginName: "Real Media Library",
        slug: "real-media-library",
        pluginUri: "https://github.com/matzeeable/real-media-library",
        pluginDesc: "This is RML!",
        author: "Matthias Günter",
        authorUri: "https://matthias-web.com",
        pluginVersion: "1.0.0",
        minPhp: "7.2",
        minWp: "5.2",
        namespace: "MatthiasWeb\\RML",
        optPrefix: "rml",
        dbPrefix: "rml",
        constantPrefix: "RML"
    }
); */

export { createPluginExecute };
