import rimraf from "rimraf";
import chalk from "chalk";
import { resolve } from "path";
import { logProgress, FOLDER_CWRA, logSuccess } from "../utils";
import { copySync } from "fs-extra";

/**
 * Copy templates to the given path and read template files.
 *
 * @param createPackageCwd
 */
function copyTemplates(createPackageCwd: string) {
    logProgress("Create new package from template...");
    const templateCwd = resolve(createPackageCwd, "../..", FOLDER_CWRA, "template-package");
    copySync(templateCwd, createPackageCwd);

    // Delete language folder
    rimraf.sync(resolve(createPackageCwd, "languages"));

    logSuccess(`Successfully created package folder ${chalk.underline(createPackageCwd)}`);
}

export { copyTemplates };
