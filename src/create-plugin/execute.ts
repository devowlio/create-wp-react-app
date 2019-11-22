import { resolve } from "path";
import { CreatePluginOpts, createPluginCommand } from "./program";
import glob from "glob";
import { existsSync } from "fs";
import {
    copyTemplates,
    applyPromptsToTemplates,
    applyPhpConstantsAndNamespace,
    applyPhpFunctions,
    applySlug,
    applyGitLabCi,
    modifyRootGitLabCiInclude
} from "./";
import { logSuccess } from "../utils";

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

/**
 * Generate a new plugin from the template. All validations are done in createPluginPrompt.
 *
 * @throws
 */
async function createPluginExecute(root: any, input: CreatePluginOpts, fromWorkspace: boolean = false) {
    const createPluginCwd = resolve(input.cwd, "plugins", input.slug);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });

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
    modifyRootGitLabCiInclude("add", input.cwd, input.slug);
    logSuccess(`Successfully created plugin ${input.pluginName} in ${createPluginCwd}`);

    // TODO: Install new plugin (except when running create-workspace)
    // TODO: First build (except when running create-workspace)
}

export { createPluginExecute };
