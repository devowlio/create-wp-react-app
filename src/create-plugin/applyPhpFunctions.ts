import chalk from "chalk";
import glob from "glob";
import { logProgress, searchAndReplace } from "../utils";

/**
 * Find PHP functions starting with wprjss_skip and replace them with the
 * correct prefix (depending on constant prefix).
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyPhpFunctions(createPluginCwd: string, constantPrefix: string) {
    const functionPrefix = constantPrefix.toLowerCase();
    logProgress(`Find PHP functions and replace with ${chalk.underline(functionPrefix)} prefix...`);
    const phpFiles = glob.sync("src/**/*.php", { cwd: createPluginCwd, absolute: true });
    searchAndReplace(phpFiles, /wprjss_skip/g, functionPrefix + "_skip");
}

export { applyPhpFunctions };
