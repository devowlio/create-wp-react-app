import { resolve } from "path";
import {
    CreateWorkspaceOpts,
    createGitFolder,
    completeWorkspace,
    applyPhpUtils,
    removeExamplePlugin,
    applyWorkspaceName,
    applyPorts,
    promptGitLab,
    ProjectResult
} from "./";
import { createPluginPrompt } from "../create-plugin";
import { applyName } from "../create-package";
import { generateLicenseFile } from "../utils";
import { applyPackageJson } from "../misc";

/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 */
async function createWorkspaceExecute(input: CreateWorkspaceOpts) {
    const createCwd = resolve(process.cwd(), input.workspace);
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
            removeExamplePlugin(createCwd);
            applyWorkspaceName(input.workspace, createCwd);
            applyPorts(input.portWp, input.portPma, createCwd);
        },
        async (createPluginCwd, pluginData) => {
            // Brand first package: utils
            const utilsPath = resolve(createCwd, "packages/utils");
            applyPhpUtils(pluginData.namespace, createPluginCwd);
            applyName(utilsPath, "utils");
            applyPackageJson(input.workspace, utilsPath, {
                author: pluginData.author,
                description: "Utility functionality for all your WordPress plugins.",
                homepage: pluginData.authorUri,
                version: "1.0.0"
            });
            generateLicenseFile(utilsPath, pluginData.author, pluginData.pluginDesc);

            // Complete
            await completeWorkspace(createPluginCwd, createCwd, input, gitLabProject);
        }
    );
}

export { createWorkspaceExecute };
