import chalk from "chalk";
import execa from "execa";
import { resolve, basename } from "path";
import rimraf from "rimraf";
import { CreateWorkspaceOpts, ProjectResult } from "./";
import { logProgress, logSuccess } from "../utils";
import { moveSync } from "fs-extra";

/**
 * Clone the repository and disconnect it.
 *
 * @param checkout
 * @param repository
 * @param createCwd
 * @param gitlabProject
 */
function createGitFolder(
    checkout: CreateWorkspaceOpts["checkout"],
    repository: CreateWorkspaceOpts["repository"],
    createCwd: string,
    gitlabProject?: ProjectResult
) {
    // Start cloning the repository
    logProgress(`Download repository ${chalk.underline(repository)} ref ${chalk.underline(checkout)}...`);
    execa.sync("git", ["clone", repository, basename(createCwd)], { stdio: "inherit" });
    execa.sync("git", ["checkout", checkout], { cwd: createCwd, stdio: "inherit" });
    rimraf.sync(resolve(createCwd, ".git"));

    // If there is a GitLab project, resolve the SSH checkout and move the .git configuration to the original folder
    if (gitlabProject) {
        const downloadCloneTarget = createCwd + "-temp";
        logProgress(`Initialize into new repository ${chalk.underline(gitlabProject.ssh_url_to_repo)}...`);
        execa.sync("git", ["clone", gitlabProject.ssh_url_to_repo, basename(downloadCloneTarget)], {
            stdio: "inherit"
        });
        execa.sync("git", ["checkout", "develop"], { cwd: downloadCloneTarget, stdio: "inherit" });
        moveSync(downloadCloneTarget + "/.git", createCwd + "/.git");
        rimraf.sync(downloadCloneTarget);
    }

    logSuccess(`Workspace successfully created in ${chalk.underline(createCwd)}`);
}

export { createGitFolder };
