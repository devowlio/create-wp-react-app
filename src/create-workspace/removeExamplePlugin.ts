import chalk from "chalk";
import { resolve } from "path";
import { logProgress, FOLDER_CWRA, DEFAULT_ENCODING } from "../utils";
import { renameSync, writeFileSync } from "fs";
import { modifyRootGitLabCiInclude } from "../create-plugin";

/**
 * Remove first initial plugin and move to create-wp-react-app for others commands.
 * Also alter the .gitlab-ci.yml includes and CHANGELOG.md.
 *
 * @param createCwd
 */
function removeExamplePlugin(createCwd: string) {
    logProgress(`Prepare monorepo for ${chalk.underline("create-wp-react-app create-plugin")} command...`);
    writeFileSync(resolve(createCwd, "plugins/wp-reactjs-starter/CHANGELOG.md"), "", { encoding: DEFAULT_ENCODING });
    renameSync(resolve(createCwd, "plugins/wp-reactjs-starter"), resolve(createCwd, FOLDER_CWRA, "template"));
    modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter");
}

export { removeExamplePlugin };
