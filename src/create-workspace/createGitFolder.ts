import chalk from "chalk";
import execa from "execa";
import { resolve } from "path";
import rimraf from "rimraf";
import { CreateWorkspaceOpts } from "./";
import { logProgress, logSuccess } from "../utils";

/**
 * Clone the repository and disconnect it.
 *
 * @param checkout
 * @param repository
 * @param workspace
 * @param createCwd
 */
function createGitFolder(
    checkout: CreateWorkspaceOpts["checkout"],
    repository: CreateWorkspaceOpts["repository"],
    workspace: CreateWorkspaceOpts["workspace"],
    createCwd: string
) {
    // Start cloning the repository
    logProgress(`Clone and checkout repository at ${chalk.underline(checkout)}...`);
    execa.sync("git", ["clone", repository, workspace], { stdio: "inherit" });
    execa.sync("git", ["checkout", checkout], { cwd: createCwd, stdio: "inherit" });
    // Disconnect git respository
    logProgress("Disconnect git repository...");
    rimraf.sync(resolve(createCwd, ".git"));
    logSuccess(`Workspace successfully created in ${chalk.underline(createCwd)}`);
}

export { createGitFolder };
