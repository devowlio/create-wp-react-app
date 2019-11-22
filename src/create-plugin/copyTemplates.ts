import chalk from "chalk";
import { resolve } from "path";
import { logProgress, FOLDER_CWRA, logSuccess, DEFAULT_ENCODING } from "../utils";
import { readFileSync } from "fs";
import { copySync } from "fs-extra";

/**
 * Copy templates to the given path and read template files.
 *
 * @param createPluginCwd
 * @returns
 */
function copyTemplates(createPluginCwd: string) {
    logProgress("Create new plugin from template...");
    const templateCwd = resolve(createPluginCwd, "../..", FOLDER_CWRA, "template");
    copySync(templateCwd, createPluginCwd);
    const templates = {
        "index.php": readFileSync(resolve(templateCwd, "../grunt-index-php.tmpl"), { encoding: DEFAULT_ENCODING }),
        "readme.wporg.txt": readFileSync(resolve(templateCwd, "../grunt-readme-txt.tmpl"), {
            encoding: DEFAULT_ENCODING
        })
    };
    logSuccess(`Successfully created plugin folder ${chalk.underline(createPluginCwd)}`);
    return templates;
}

export { copyTemplates };
