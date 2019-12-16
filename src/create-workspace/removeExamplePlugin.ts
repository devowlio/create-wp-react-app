import chalk from "chalk";
import { resolve } from "path";
import { logProgress, FOLDER_CWRA, DEFAULT_ENCODING } from "../utils";
import { renameSync, writeFileSync, mkdirSync } from "fs";
import { copySync } from "fs-extra";
import rimraf from "rimraf";
import { modifyRootGitLabCiInclude } from "../misc";

/**
 * Remove first initial plugin and move to create-wp-react-app for others commands.
 * Also alter the .gitlab-ci.yml includes and CHANGELOG.md.
 *
 * @param createCwd
 */
function removeExamplePlugin(createCwd: string) {
    logProgress(
        `Prepare monorepo for future commands like ${chalk.underline("create-plugin")} and ${chalk.underline(
            "create-package"
        )}...`
    );
    writeFileSync(resolve(createCwd, "plugins/wp-reactjs-starter/CHANGELOG.md"), "", { encoding: DEFAULT_ENCODING });
    writeFileSync(resolve(createCwd, "packages/utils/CHANGELOG.md"), "", { encoding: DEFAULT_ENCODING });
    renameSync(resolve(createCwd, "plugins/wp-reactjs-starter"), resolve(createCwd, FOLDER_CWRA, "template"));

    // Copy utils package for "create-package" command
    const tmplPackageFolder = resolve(createCwd, FOLDER_CWRA, "template-package");
    copySync(resolve(createCwd, "packages/utils"), tmplPackageFolder);
    rimraf.sync(resolve(tmplPackageFolder, "lib"));
    rimraf.sync(resolve(tmplPackageFolder, "src"));
    mkdirSync(resolve(tmplPackageFolder, "lib"));
    mkdirSync(resolve(tmplPackageFolder, "src"));

    modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter", "plugins");
}

export { removeExamplePlugin };
