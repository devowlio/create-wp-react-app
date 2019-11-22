import { logProgress, logSuccess, DEFAULT_ENCODING } from "../utils";
import chalk from "chalk";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { CreatePluginOpts } from "./";

/**
 * Update package.json with new utils version and so on.
 *
 * @param root
 * @param createPluginCwd
 * @param input
 */
function applyPackageJson(root: string, createPluginCwd: string, input: CreatePluginOpts) {
    logProgress("Update plugins' package.json...");
    const path = resolve(createPluginCwd, "package.json");
    let content = readFileSync(path, { encoding: DEFAULT_ENCODING });

    content = content.replace(/"version":\s*"([0-9.]+)"/g, '"version": "' + input.pluginVersion + '"');
    content = content.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.pluginDesc + '"');
    content = content.replace(/"author":\s*"([^"]+)"/g, '"author": "' + input.author + '"');
    content = content.replace(/"homepage":\s*"([^"]+)"/g, '"homepage": "' + input.pluginUri + '"');

    // Update utils version
    const utilsVersion = require(resolve(input.cwd, "packages/utils/package.json")).version;
    content = content.replace(
        new RegExp('"@' + root + '\\/utils":\\s*"\\^([0-9.]+)"', "g"),
        '"@' + root + '/utils": "^' + utilsVersion + '"'
    );

    writeFileSync(path, content, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully updated ${chalk.underline(path)}`);
}

export { applyPackageJson };
