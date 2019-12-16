import { CreatePluginOpts } from "../create-plugin";
import { logProgress, logSuccess, searchAndReplace } from "../utils";
import glob from "glob";
import chalk from "chalk";
import { applyPhpNamespace } from "../create-package";
import { resolve } from "path";

/**
 * Generate a namespace for the first created plugin and
 * generate accordingly a namespace for the utils PHP package.
 */
function applyPhpUtils(pluginNamespace: CreatePluginOpts["namespace"], createPluginCwd: string) {
    const splitNs = pluginNamespace.split("\\");
    const utilsNamespace = (splitNs.length > 1 ? splitNs.slice(0, -1).join("\\") : pluginNamespace) + "\\Utils";

    logProgress(`Apply namespace to utils package ${chalk.underline(utilsNamespace)}...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });
    searchAndReplace(globFiles("composer.lock"), /MatthiasWeb\\\\Utils/g, utilsNamespace.replace(/\\/g, "\\\\"));
    searchAndReplace(globFiles("src/inc/**/*.php"), /MatthiasWeb\\Utils/g, utilsNamespace);
    logSuccess(`Successfully applied PHP utils namespace to plugin!`);

    // Apply to utils package itself
    applyPhpNamespace(resolve(createPluginCwd, "../../packages/utils"), utilsNamespace);

    return utilsNamespace;
}

export { applyPhpUtils };
