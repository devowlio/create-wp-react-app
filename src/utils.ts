import execa from "execa";
import chalk from "chalk";
import { command, Option, Command } from "commander";
import { resolve, join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { URL } from "url";
import { CreateWorkspaceOpts } from "./create-workspace";
import { CreatePluginOpts } from "./create-plugin";
import { existsSync } from "fs-extra";
import { CreatePackageOpts } from "./create-package";

const FOLDER_CWRA = "common/create-wp-react-app";

const DEFAULT_ENCODING = "UTF-8";

const logProgress = (text: string) => console.log(chalk.black.bgCyan(text));
const logSuccess = (text: string) => console.log(chalk.black.green(text));
const logError = (text: string) => console.log(chalk.red(text));

/**
 * Similar to runThirdPartyLicenses but only for one package.
 *
 * @param cwd
 */
function runThirdPartyLicenseForPackage(cwd: string) {
    logProgress(`Generate 3rd party licenses in ${chalk.underline(cwd)}...`);
    execa.sync("yarn", ["grunt", "composer:disclaimer"], { cwd });
    execa.sync("yarn", ["grunt", "yarn:disclaimer"], { cwd });
    logSuccess("Successfully generated 3rd party licenses");
}

/**
 * Generate a LICENSE file for a given package.json.
 *
 * @param cwd
 * @param author
 * @param description
 */
function generateLicenseFile(cwd: string, author: string, description: string) {
    const licensePath = resolve(cwd, "LICENSE");
    logProgress(`Generate LICENSE file in ${chalk.underline(licensePath)}...`);
    const licenseFile = readFileSync(licensePath, { encoding: DEFAULT_ENCODING })
        .split("\n")
        .slice(2)
        .join("\n");
    const year = new Date().getFullYear();
    const header = `${description}
Copyright (C) ${year} ${author}
`;
    writeFileSync(licensePath, header + licenseFile);
    logSuccess("Successfully generated LICENSE file");

    return licensePath;
}

/**
 * Get a valid workspace package.json content.
 *
 * @param cwd
 * @returns package.json content of the root
 * @throws
 */
function getValidWorkspace(cwd: string) {
    const json = require(join(cwd, "package.json")); // eslint-disable-line @typescript-eslint/no-var-requires
    logSuccess(`Successfully found ${chalk.underline(json.name)} as root project!`);

    if (!json.private) {
        throw new Error("This project is not private. Yarn root workspaces must be private!");
    }

    if (!json.workspaces) {
        throw new Error("This project has no workspaces defined.");
    }

    if (JSON.stringify(json.workspaces).indexOf("plugins/*") === -1) {
        throw new Error("This project has no plugins/* workspaces defined.");
    }

    return json;
}

/**
 * Get CLI arguments if SKIP_PROMPT is set so the prompt is skipped.
 * This is for development purposes only!
 *
 * @param type
 * @private
 */
function getInternalExampleArgs(type: "workspace" | "plugin" | "package") {
    if (process.env.SKIP_PROMPT) {
        switch (type) {
            case "workspace":
                return {
                    checkout: "feat/multipackage",
                    portPma: 9099,
                    portWp: 9098,
                    workspace: "my-awesomeness"
                } as CreateWorkspaceOpts;
            case "plugin":
                return {
                    author: "Jon Smith",
                    authorUri: "https://example.com",
                    constantPrefix: "AWEONE",
                    dbPrefix: "aweone",
                    minPhp: "7.0.0",
                    minWp: "5.2.0",
                    namespace: "JonSmith\\AwesomeOne",
                    optPrefix: "awe",
                    pluginDesc: "This is an awesome plugin #1!",
                    pluginName: "Awesome One",
                    pluginUri: "https://awesome-one.example.com",
                    pluginVersion: "1.0.0",
                    slug: "awesome-one"
                } as CreatePluginOpts;
            case "package":
                return {
                    abbreviation: "mbp",
                    author: "Jon Smith",
                    namespace: "JonSmith\\MyBestPackage",
                    packageDesc: "This is an awesome package?!",
                    packageName: "my-best-package",
                    packageUri: "https://my-best-package.example.com"
                } as CreatePackageOpts;
        }
    }
    return null;
}

/**
 * Get an option from a command by long definition.
 *
 * @param c
 * @param long
 */
function getCommandOption(c: ReturnType<typeof command>, long: Option["long"]) {
    return (c.options as Option[]).filter((o) => o.long === long)[0];
}

/**
 * Used in prompts so you do not have to duplicate the question strings
 * and take it directly from the commander option description.
 *
 * @param c
 * @param long
 */
function getCommandDescriptionForPrompt(c: ReturnType<typeof command>, long: Option["long"]) {
    return getCommandOption(c, long).description;
}

/**
 * Search and replace file content and write it back with success message.
 *
 * @param files Absolute pathes
 * @param search
 * @param replace
 */
function searchAndReplace(files: string[], search: RegExp, replace: any) {
    let wroteHeader = false;
    files.forEach((file) => {
        if (file.indexOf(FOLDER_CWRA) === -1) {
            let i = 0;
            const newContent = readFileSync(file, { encoding: DEFAULT_ENCODING }).replace(search, () => {
                i++;
                return replace;
            });
            writeFileSync(file, newContent, { encoding: DEFAULT_ENCODING });

            if (i > 0) {
                if (!wroteHeader) {
                    logSuccess(`Search (${search}) & Replace (${replace}):`);
                    wroteHeader = true;
                }
                logSuccess(`├── ${chalk.underline(file)} (${i} times)`);
            }
        }
    });
}

/**
 * Return an error message when the given input is empty.
 *
 * @param value
 * @returns
 */
function inquirerRequiredValidate(value: string) {
    if (!value) {
        return "This prompt may not be empty!";
    }
    return true;
}

/**
 * Adjust the cases by keys in a given object.
 *
 * @param object
 * @param upper
 * @param lower
 */
function caseAll<T extends any>(object: T, upper: Array<keyof T>, lower: Array<keyof T>): T {
    upper.forEach((i) => (object[i] = object[i].toUpperCase()));
    lower.forEach((i) => (object[i] = object[i].toLowerCase()));
    return object;
}

/**
 * Get a git config by parameter.
 *
 * @param param
 * @returns
 */
function getGitConfig(param: string) {
    try {
        return execa.sync("git", ["config", "--get", param]).stdout;
    } catch (e) {
        return "";
    }
}

/**
 * Convert a slug like "my-plugin" to "myPlugin".
 *
 * @param slug
 * @param firstUc
 * @returns
 */
function slugCamelCase(slug: string, firstUc = false) {
    const result = slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return firstUc ? result.charAt(0).toUpperCase() + result.slice(1) : result;
}

/**
 * Checks if a given version is a valid semver.
 *
 * @param version
 * @param errorAsString
 * @returns
 * @see https://github.com/semver/semver/issues/232
 */
function isValidSemver(version: string, errorAsString = false) {
    const valid = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/.test(
        version
    );
    return valid ? true : errorAsString ? "This is not a valid version." : false;
}

/**
 * Checks if a given name is a valid PHP namespace.
 *
 * @param name
 * @returns
 */
function isValidPhpNamespace(name: string) {
    return /^[^\\0-9][A-Za-z0-9_\\]+$/.test(name);
}

/**
 * Checks if the given url is valid.
 *
 * @param url
 * @param errorAsString
 * @returns
 */
function isValidUrl(url: string, errorAsString = false) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return errorAsString ? "This is not a valid URL" : false;
    }
}

/**
 * Check for valid workspace and exit if not found.
 *
 * @param createWorkspaceCwd
 * @returns
 */
function checkValidWorkspace(createWorkspaceCwd: string, outputHelp: Command) {
    // Get the root package
    try {
        const root = getValidWorkspace(createWorkspaceCwd);

        if (!existsSync(resolve(createWorkspaceCwd, FOLDER_CWRA, "template"))) {
            throw new Error("The template folder in common/create-wp-react-app could not be found!");
        }
        return root;
    } catch (e) {
        logError(e.toString());
        logError(
            `You are not using the command inside a folder which was created with ${chalk.underline(
                "create-wp-react-app create-workspace"
            )}. Navigate to that folder or use the ${chalk.underline("--cwd")} argument.`
        );
        outputHelp.help();
    }
}

export {
    logProgress,
    logSuccess,
    logError,
    runThirdPartyLicenseForPackage,
    generateLicenseFile,
    FOLDER_CWRA,
    DEFAULT_ENCODING,
    getInternalExampleArgs,
    getValidWorkspace,
    getCommandOption,
    getCommandDescriptionForPrompt,
    searchAndReplace,
    inquirerRequiredValidate,
    caseAll,
    getGitConfig,
    slugCamelCase,
    isValidSemver,
    isValidPhpNamespace,
    isValidUrl,
    checkValidWorkspace
};
