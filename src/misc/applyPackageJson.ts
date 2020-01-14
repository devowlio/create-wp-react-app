import { logProgress, logSuccess, DEFAULT_ENCODING } from "../utils";
import chalk from "chalk";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

/**
 * Update package.json with new utils version and author information.
 * Each package also contains a composer.json, update it too...
 *
 * It does not update the name of the package!
 *
 * @param root
 * @param createPackageCwd
 * @param input
 * @param updateUtilsVersion
 */
function applyPackageJson(
    root: string,
    createPackageCwd: string,
    input: {
        version: string;
        description: string;
        author: string;
        homepage: string;
    },
    updateUtilsVersion: boolean | string = true
) {
    const packageJsonPath = resolve(createPackageCwd, "package.json");
    const composerJsonPath = resolve(createPackageCwd, "composer.json");

    logProgress(`Update ${chalk.underline(packageJsonPath)}...`);
    let packageJson = readFileSync(packageJsonPath, { encoding: DEFAULT_ENCODING });

    packageJson = packageJson.replace(/"version":\s*"([0-9.]+)"/g, '"version": "' + input.version + '"');
    packageJson = packageJson.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.description + '"');
    packageJson = packageJson.replace(/"author":\s*"([^"]+)"/g, '"author": "' + input.author + '"');
    packageJson = packageJson.replace(/"homepage":\s*"([^"]+)"/g, '"homepage": "' + input.homepage + '"');

    // Update utils version
    if (updateUtilsVersion) {
        const utilsVersion =
            updateUtilsVersion === true
                ? require(resolve(createPackageCwd, "../../packages/utils/package.json")).version
                : updateUtilsVersion;
        packageJson = packageJson.replace(
            new RegExp('"@' + root + '\\/utils":\\s*"\\^([0-9.]+)"', "g"),
            '"@' + root + '/utils": "^' + utilsVersion + '"'
        );
    }

    writeFileSync(packageJsonPath, packageJson, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully updated ${chalk.underline(packageJsonPath)}`);

    // Update composer.json
    logProgress(`Update ${chalk.underline(composerJsonPath)}...`);
    let composerJson = readFileSync(composerJsonPath, { encoding: DEFAULT_ENCODING });

    composerJson = composerJson.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.description + '"');
    composerJson = composerJson.replace(/Matthias Günter/g, input.author);

    writeFileSync(composerJsonPath, composerJson, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully updated ${chalk.underline(composerJsonPath)}`);
}

export { applyPackageJson };
