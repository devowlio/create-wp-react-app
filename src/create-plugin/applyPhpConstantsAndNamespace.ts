import chalk from "chalk";
import { resolve } from "path";
import { CreatePluginOpts } from "./program";
import glob from "glob";
import { logProgress, logSuccess, searchAndReplace } from "../utils";
import { applyPromptsToTemplates } from "./";

/**
 * Apply PHP constants to the available *.php files. Also adjust
 * the PHP autoloading namespace (+ UtilsProvider trait).
 *
 * @param createPluginCwd
 * @param appliedTemplates
 * @param constantPrefix
 */
function applyPhpConstantsAndNamespace(
    createPluginCwd: string,
    appliedTemplates: ReturnType<typeof applyPromptsToTemplates>,
    constantPrefix: CreatePluginOpts["constantPrefix"],
    namespace: CreatePluginOpts["namespace"]
) {
    logProgress("Get and apply all your PHP constants to the *.php files...");
    // Find constants
    let m;
    const regex = /define\('([^']+)/g;
    const constantList: string[] = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((m = regex.exec(appliedTemplates.indexPhpContent)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                constantList.push(match);
            }
        });
    }
    // Search & Replace constants
    const phpFiles = glob.sync("src/**/*.php", { cwd: createPluginCwd, absolute: true });
    constantList.forEach((constant) =>
        searchAndReplace(phpFiles, new RegExp("WPRJSS" + constant.slice(constantPrefix.length), "g"), constant)
    );
    searchAndReplace(
        glob.sync("src/inc/base/UtilsProvider.trait.php", { cwd: createPluginCwd, absolute: true }),
        /'WPRJSS'/g,
        `'${constantPrefix}'`
    );
    logSuccess(
        `Successfully applied the following constants which you can use now - read more about them in WP ReactJS Starter documentation:\n - ${constantList.join(
            "\n - "
        )}`
    );
    // Apply the namespace
    logProgress(`Apply namespace ${chalk.underline(namespace)} to all PHP files for autoloading...`);
    searchAndReplace(phpFiles, /MatthiasWeb\\WPRJSS/g, namespace);
}

export { applyPhpConstantsAndNamespace };
