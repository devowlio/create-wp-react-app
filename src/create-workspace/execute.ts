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
import { promptGitLab } from "./promptGitLab";

/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 */
async function createWorkspaceExecute(input: CreateWorkspaceOpts) {
    const createCwd = resolve(process.cwd(), input.workspace);
    const gitlabProjectResult = await promptGitLab();
    const gitlabProject = gitlabProjectResult === false ? undefined : gitlabProjectResult;

    // Run create-plugin command without installation (because this is done below)
    // So we have all prompts in one flow, awesome!
    await createPluginPrompt(
        {
            cwd: createCwd
        },
        async () => {
            createGitFolder(input.checkout, input.repository, createCwd, gitlabProject);
            removeExamplePlugin(createCwd);
            applyWorkspaceName(input.workspace, createCwd);
            applyPorts(input.portWp, input.portPma, createCwd);
        },
        async (createPluginCwd) => {
            await completeWorkspace(createPluginCwd, createCwd, input, gitlabProject);
        }
    );
}

export { createWorkspaceExecute };
