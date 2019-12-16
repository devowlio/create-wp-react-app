import execa from "execa";
import { CreateWorkspaceOpts, ProjectResult, runThirdPartyLicenses } from "./";
import { logProgress, logSuccess } from "../utils";
import { PROMPT_AFTER_BOOTSTRAP, preInstallationBuilds } from "../create-plugin";
import { prompt } from "inquirer";
import terminalLink from "terminal-link";

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
    workspaceData: CreateWorkspaceOpts,
    gitlabProject?: ProjectResult
) {
    // Install dependencies
    logProgress("Bootstrap monorepo and download dependencies...");
    execa.sync("yarn", ["bootstrap"], { cwd: createWorkspaceCwd, stdio: "inherit" });

    // Push changes
    if (gitlabProject) {
        logProgress("Push complete code to repository...");
        execa.sync("git", ["add", "-A"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        execa.sync("git", ["commit", "-m 'chore: initial commit'"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        execa.sync("git", ["push", "origin", "develop"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        logSuccess(
            `Successfully pushed code, see your CI/CD pipeline running ${terminalLink(
                "here",
                gitlabProject.web_url + "/pipelines"
            )}`
        );
    }

    runThirdPartyLicenses(createWorkspaceCwd);

    // Prompt first build processes
    logSuccess(
        "\n\nThe workspace is now usable. For first usage it is recommend to do some first tests and builds to check all is working fine."
    );
    const answers = await prompt(PROMPT_AFTER_BOOTSTRAP);

    preInstallationBuilds(
        {
            build: answers.build as boolean,
            docs: answers.docs as boolean
        },
        createPluginCwd
    );

    logProgress(`Initially start the development environment...`);
    execa("yarn", ["docker:start"], { cwd: createWorkspaceCwd, stdio: "inherit" });
}

export { completeWorkspace };
