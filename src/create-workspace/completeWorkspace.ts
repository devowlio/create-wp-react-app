import execa from "execa";
import { CreateWorkspaceOpts } from "./";
import { logProgress, logSuccess } from "../utils";
import { CreatePluginOpts, PROMPT_AFTER_BOOTSTRAP, preInstallationBuilds } from "../create-plugin";
import { prompt } from "inquirer";
import chalk from "chalk";
import terminalLink from "terminal-link";

/**
 * The workspace and initial plugin is created, do some installation process!
 *
 * @param createPluginCwd
 * @param pluginData
 * @param createWorkspaceCwd
 * @param workspaceData
 */
function completeWorkspace(
    createPluginCwd: string,
    pluginData: CreatePluginOpts,
    createWorkspaceCwd: string,
    workspaceData: CreateWorkspaceOpts
) {
    const localhostLink = "http://localhost:" + workspaceData.portWp;

    // Install dependencies
    logProgress("Bootstrap monorepo and download dependencies...");
    execa.sync("yarn", ["bootstrap"], { cwd: createWorkspaceCwd, stdio: "inherit" });

    // Prompt first build processes
    logSuccess(
        "\n\nThe workspace is now usable. For first usage it is recommend to do some first tests and builds to check all is working fine."
    );
    prompt([
        ...PROMPT_AFTER_BOOTSTRAP,
        {
            name: "dev",
            type: "confirm",
            message: `Imagine all the above worked without any problem, would you like to start the development environment ${terminalLink(
                localhostLink,
                localhostLink
            )}? If you pass 'yes' this shell keeps open because it starts in 'watch' mode. You can safely close the shell then and start it again with ${chalk.underline(
                "yarn docker:start"
            )}.`,
            default: "y"
        }
    ]).then((answers) => {
        preInstallationBuilds(
            {
                build: answers.build as boolean,
                docs: answers.docs as boolean
            },
            createPluginCwd
        );

        if (answers.dev) {
            logProgress(`Initially start the development environment...`);
            execa("yarn", ["docker:start"], { cwd: createWorkspaceCwd, stdio: "inherit" });
        }
    });
}

export { completeWorkspace };
