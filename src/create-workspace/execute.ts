import { resolve } from "path";
import {
    CreateWorkspaceOpts,
    createGitFolder,
    completeWorkspace,
    removeExamplePlugin,
    applyWorkspaceName,
    applyPorts,
    promptGitLab,
    ProjectResult
} from "./";
import { createPluginPrompt } from "../create-plugin";
import { applyName } from "../create-package";
import { generateLicenseFile } from "../utils";
import { applyPackageJson, applyPhpNamespace } from "../misc";
import { createDotEnv } from "./createDotEnv";

/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 */
async function createWorkspaceExecute(input: CreateWorkspaceOpts) {
    const createCwd = resolve(process.cwd(), input.workspace);
    const utilsPath = resolve(createCwd, "packages/utils");
    const gitlabProjectCreator = await promptGitLab(input.workspace);
    let gitLabProject: ProjectResult;

    // Run create-plugin command without installation (because this is done below)
    // So we have all prompts in one flow, awesome!
    await createPluginPrompt(
        {
            cwd: createCwd
        },
        async () => {
            if (gitlabProjectCreator !== false) {
                gitLabProject = await gitlabProjectCreator();
            }
            createGitFolder(input.checkout, input.repository, createCwd, gitLabProject);
            createDotEnv(createCwd, input);
            removeExamplePlugin(createCwd);
            applyWorkspaceName(input.workspace, createCwd);
            applyPorts(input.portWp, input.portPma, createCwd);
        },
        async (createPluginCwd, pluginData) => {
            // Brand first package: utils
            const splitNs = pluginData.namespace.split("\\");
            const utilsNamespace =
                (splitNs.length > 1 ? splitNs.slice(0, -1).join("\\") : pluginData.namespace) + "\\Utils";

            applyPhpNamespace(utilsPath, utilsNamespace, "utils");

            // Re-apply namespace of utils package for this plugin because before it did not know the namespace
            applyPhpNamespace(createPluginCwd, pluginData.namespace, "plugin");

            applyName(utilsPath, "utils");
            applyPackageJson(
                input.workspace,
                utilsPath,
                {
                    author: pluginData.author,
                    description: "Utility functionality for all your WordPress plugins.",
                    homepage: pluginData.authorUri,
                    version: "1.0.0"
                },
                false
            );
            generateLicenseFile(utilsPath, pluginData.author, pluginData.pluginDesc);

            // Complete
            await completeWorkspace(createPluginCwd, createCwd, utilsPath, gitLabProject);
        }
    );
}

export { createWorkspaceExecute };
