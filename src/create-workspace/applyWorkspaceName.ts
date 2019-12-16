import chalk from "chalk";
import { CreateWorkspaceOpts } from "./";
import glob from "glob";
import { logProgress, logSuccess, searchAndReplace } from "../utils";

/**
 * Apply workspace name to the given folder.
 *
 * @param workspace
 * @param createCwd
 */
function applyWorkspaceName(workspace: CreateWorkspaceOpts["workspace"], createCwd: string) {
    logProgress(`Apply workspace name ${chalk.underline(workspace)}...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createCwd, absolute: true });
    const workspaceFiles = [
        ...globFiles(".gitlab-ci.yml"),
        ...globFiles("package.json"),
        ...globFiles("{plugins,packages}/*/package.json")
    ];
    searchAndReplace(workspaceFiles, /wp-reactjs-multi-starter/g, workspace);
    logSuccess(`Workspace is now branded as ${chalk.underline(workspace)}`);
}

export { applyWorkspaceName };
