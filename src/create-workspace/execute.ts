import { resolve } from "path";
import {
    CreateWorkspaceOpts,
    createGitFolder,
    completeWorkspace,
    removeExamplePlugin,
    applyWorkspaceName,
    applyPorts
} from "./";
import { createPluginPrompt } from "../create-plugin";
import chalk from "chalk";

/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 */
function createWorkspaceExecute(input: CreateWorkspaceOpts) {
    const createCwd = resolve(process.cwd(), input.workspace);

    console.log(
        chalk.blue(
            "Creating a workspace can take a while (up 5 minutes) because it installs all needed dependencies and starts a new docker environment. Do not worry, the development process is much faster ;-)"
        )
    );

    // Run create-plugin command without installation (because this is done below)
    // So we have all prompts in one flow, awesome!
    createPluginPrompt(
        {
            cwd: createCwd
        },
        async () => {
            createGitFolder(input.checkout, input.repository, input.workspace, createCwd);
            removeExamplePlugin(createCwd);
            applyWorkspaceName(input.workspace, createCwd);
            applyPorts(input.portWp, input.portPma, createCwd);
        },
        async (createPluginCwd, pluginData) => completeWorkspace(createPluginCwd, pluginData, createCwd, input)
    );
}

export { createWorkspaceExecute };
