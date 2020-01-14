import { resolve } from "path";
import { readFileSync } from "fs";
import { logProgress, searchAndReplace, logSuccess, DEFAULT_ENCODING } from "../utils";
import chalk from "chalk";
import glob from "glob";

function applyPhpNamespace(createPackageCwd: string, namespace: string, type: "utils" | "plugin") {
    // Apply the namespace
    logProgress(`Apply namespace ${chalk.underline(namespace)} to all PHP files for autoloading...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPackageCwd, absolute: true });

    // Define our new package
    searchAndReplace(
        globFiles("composer.json"),
        type === "utils" ? /MatthiasWeb\\\\Utils/g : /MatthiasWeb\\\\WPRJSS/g,
        namespace.replace(/\\/g, "\\\\")
    );

    // Search for namespaces in source and test files
    const phpFiles = [...globFiles("src/**/*.php"), ...globFiles("test/phpunit/**/*.php")];
    searchAndReplace(phpFiles, type === "utils" ? /MatthiasWeb\\Utils/g : /MatthiasWeb\\WPRJSS/g, namespace);

    // Define autoloading for utils package in source and test files
    if (type === "plugin") {
        const utilsPluginReceiverFile = readFileSync(
            resolve(createPackageCwd, "../../packages/utils/src/PluginReceiver.php"),
            { encoding: DEFAULT_ENCODING }
        );
        const namespaceUtils = utilsPluginReceiverFile.match(/^namespace ([^;]+)/m)[1];

        searchAndReplace(globFiles("composer.lock"), /MatthiasWeb\\\\Utils/g, namespaceUtils.replace(/\\/g, "\\\\"));
        searchAndReplace(phpFiles, /MatthiasWeb\\Utils/g, namespaceUtils);
    }

    logSuccess(`Successfully applied PHP namespace to package!`);
}

export { applyPhpNamespace };
