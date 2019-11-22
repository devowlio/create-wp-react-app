import chalk from "chalk";
import execa from "execa";
import { resolve } from "path";
import rimraf from "rimraf";
import { CreateWorkspaceOpts } from "./";
import glob from "glob";
import { logProgress, logSuccess, searchAndReplace, FOLDER_CWRA } from "../utils";
import { renameSync } from "fs";
import { modifyRootGitLabCiInclude, createPluginPrompt } from "../create-plugin";

/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 *
 * @throws
 */
async function createWorkspaceExecute(input: CreateWorkspaceOpts) {
    const createCwd = resolve(process.cwd(), input.workspace);

    // Run create-plugin command without installation (because this is done below)
    createPluginPrompt(
        {
            cwd: createCwd
        },
        async () => {
            const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createCwd, absolute: true });

            // TODO: if possible create single functions in own files
            // TODO: check docker availability and so on

            // Start cloning the repository
            logProgress(`Clone and checkout repository at ${chalk.underline(input.checkout)}...`);
            await execa("git", ["clone", input.repository, input.workspace], { stdio: "inherit" });
            await execa("git", ["checkout", input.checkout], { cwd: createCwd, stdio: "inherit" });

            // Disconnect git respository
            logProgress("Disconnect git repository...");
            rimraf.sync(resolve(createCwd, ".git"));
            logSuccess(`Workspace successfully created in ${chalk.underline(createCwd)}`);

            // Remove first initial plugin and move to create-wp-react-app for others commands
            logProgress(`Prepare monorepo for ${chalk.underline("create-wp-react-app create-plugin")} command...`);
            renameSync(resolve(createCwd, "plugins/wp-reactjs-starter"), resolve(createCwd, FOLDER_CWRA, "template"));

            // Remove also the .gitlab-ci.yml include
            modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter");

            // Apply workspace name
            logProgress(`Apply workspace name ${chalk.underline(input.workspace)}...`);
            const workspaceFiles = [
                ...globFiles(".gitlab-ci.yml"),
                ...globFiles("**/package.json"),
                ...globFiles("packages/utils/README.md")
            ];
            searchAndReplace(workspaceFiles, /wp-reactjs-multi-starter/g, input.workspace);
            logSuccess(`Workspace is now branded as ${chalk.underline(input.workspace)}`);

            // Apply ports
            logProgress(
                `Apply ports ${chalk.underline(input.portWp)} (WP) and ${chalk.underline(
                    input.portPma
                )} (PMA) for local development...`
            );
            const portFiles = globFiles("devops/docker-compose/docker-compose.local.yml");
            searchAndReplace(portFiles, /"8080:80"/g, `"${input.portWp}:80"`);
            searchAndReplace(portFiles, /"8079:80"/g, `"${input.portPma}:80"`);
        },
        async () => {
            // TODO: Install dependencies
            logProgress("Bootstrap monorepo and download dependencies...");
            // await execa('yarn', ['bootstrap'], { cwd: createCwd, stdio: 'inherit' });

            // TODO: Links to what's happening next
            // TODO: prompt to start `docker:start` and start hacking
        }
    );
}

export { createWorkspaceExecute };
