import execa from "execa";
import chalk from "chalk";
import { ProjectResult, runThirdPartyLicenses } from "./";
import { logProgress, logSuccess } from "../utils";
import { preInstallationBuilds } from "../create-plugin";
import terminalLink from "terminal-link";
import { regenerateLaunchJson } from "../misc";

/**
 * The workspace and initial plugin is created, do some installation process!
 *
 * @param createPluginCwd
 * @param createWorkspaceCwd
 * @param workspaceData
 * @param gitlabProject
 */
async function completeWorkspace(
    createPluginCwd: string,
    createWorkspaceCwd: string,
    createUtilsCwd: string,
    gitlabProject?: ProjectResult
) {
    // Install dependencies
    logProgress("Bootstrap monorepo and download dependencies...");
    execa.sync("yarn", ["bootstrap"], { cwd: createWorkspaceCwd, stdio: "inherit" });

    runThirdPartyLicenses(createWorkspaceCwd);
    regenerateLaunchJson(createWorkspaceCwd);

    // Prompt first build processes
    logSuccess(
        "\n\nThe workspace is now usable. For first usage it is recommend to do some first tests and builds to check all is working fine."
    );

    preInstallationBuilds(createUtilsCwd);
    preInstallationBuilds(createPluginCwd);

    // Start VSCode if available
    try {
        execa("code", [createWorkspaceCwd], {
            detached: true
        });
    } catch (e) {
        // Silence is golden.
    }

    // Push changes
    if (gitlabProject) {
        logProgress("Push complete code to repository...");
        execa.sync("git", ["add", "-A"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        execa.sync("git", ["commit", "-m 'chore: initial commit'", "--no-verify"], {
            cwd: createWorkspaceCwd,
            stdio: "inherit"
        });
        execa.sync("git", ["push", "origin", "develop"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        logSuccess(
            `Successfully pushed code, see your CI/CD pipeline running ${terminalLink(
                "here",
                gitlabProject.web_url + "/pipelines"
            )}`
        );
    }

    logProgress(`Initially start the development environment with ${chalk.underline("yarn docker:start")}...`);
    execa("yarn", ["docker:start"], { cwd: createWorkspaceCwd, stdio: "inherit" });
}

export { completeWorkspace };
