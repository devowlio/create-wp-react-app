import { prompt } from "inquirer";
import { CreatePluginOpts, createPluginCommand, createPluginExecute } from "./";
import {
    getCommandDescriptionForPrompt,
    logError,
    logSuccess,
    inquirerRequiredValidate,
    caseAll,
    FOLDER_CWRA,
    DEFAULT_ENCODING
} from "../utils";
import chalk from "chalk";
import { resolve, join } from "path";
import { existsSync, readdirSync } from "fs";

/**
 * Prompt for CLI arguments which are not passed.
 *
 * @param opts
 * @param before If you pass a callback the plugin itself will not be installed and build because it comes from create-workspace
 * @param after
 */
async function createPluginPrompt(
    {
        cwd,
        pluginName,
        slug,
        pluginUri,
        pluginDesc,
        author,
        authorUri,
        pluginVersion,
        minPhp,
        minWp,
        namespace,
        optPrefix,
        dbPrefix,
        constantPrefix
    }: Partial<CreatePluginOpts>,
    before?: () => Promise<void>,
    after?: (createPluginCwd: string, pluginData: CreatePluginOpts) => Promise<void>
) {
    let root: any;
    const createWorkspaceCwd = cwd ? resolve(cwd) : process.cwd();

    // It is coming directly from create-plugin command
    if (!before) {
        root = checkValidWorkspace(createWorkspaceCwd);
    }

    const answers = await prompt(
        [
            !pluginName && {
                name: "pluginName",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-name"),
                type: "input",
                validate: inquirerRequiredValidate
            },
            !slug && {
                name: "slug",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--slug"),
                type: "input",
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.pluginName || pluginName) as string;
                    if (useThis) {
                        return useThis.toLowerCase().replace(/ /g, "-");
                    }
                    return undefined;
                },
                validate: (value: string) => {
                    if (/^[A-Za-z0-9-_]+$/.test(value)) {
                        return true;
                    }

                    return "Your plugin slug should only contain [A-Za-z0-9-_]";
                }
            },
            !pluginUri && {
                name: "pluginUri",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-uri"),
                type: "input"
            },
            !pluginDesc && {
                name: "pluginDesc",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-desc"),
                type: "input"
            },
            !author && {
                name: "author",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--author"),
                type: "input",
                validate: inquirerRequiredValidate
            },
            !authorUri && {
                name: "authorUri",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--author-uri"),
                type: "input"
            },
            !pluginVersion && {
                name: "pluginVersion",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-version"),
                type: "input",
                default: "1.0.0"
            },
            !minPhp && {
                name: "minPhp",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--min-php"),
                type: "input",
                default: "7.0"
            },
            !minWp && {
                name: "minWp",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--min-wp"),
                type: "input",
                default: "5.2"
            },
            !namespace && {
                name: "namespace",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--namespace"),
                type: "input",
                validate: inquirerRequiredValidate
            },
            !optPrefix && {
                name: "optPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--opt-prefix"),
                type: "input",
                validate: inquirerRequiredValidate
            },
            !dbPrefix && {
                name: "dbPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--db-prefix"),
                type: "input",
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.optPrefix || optPrefix) as string;
                    return useThis ? useThis : undefined;
                },
                validate: inquirerRequiredValidate
            },
            !constantPrefix && {
                name: "constantPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--constant-prefix"),
                type: "input",
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.optPrefix || optPrefix) as string;
                    return useThis ? useThis.toUpperCase() : undefined;
                },
                validate: inquirerRequiredValidate
            }
        ].filter(Boolean)
    );

    try {
        let parsed = {
            cwd,
            pluginName,
            slug,
            pluginUri,
            pluginDesc,
            author,
            authorUri,
            pluginVersion,
            minPhp,
            minWp,
            namespace,
            optPrefix,
            dbPrefix,
            constantPrefix,
            ...answers
        };
        parsed.namespace = parsed.namespace.replace(/\\\\/g, "\\");
        parsed = caseAll(parsed, ["constantPrefix"], ["slug", "pluginUri", "authorUri", "optPrefix", "dbPrefix"]);
        if (before) {
            await before();
        }

        // Root can be lazy due create-workspace command
        if (!root) {
            root = checkValidWorkspace(createWorkspaceCwd);
        }

        const createPluginCwd = await createPluginExecute(root, parsed, !!before);
        if (after) {
            await after(createPluginCwd, parsed);
        }
    } catch (e) {
        logError(e.toString());
    }
}

/**
 * Check for valid workspace and exit if not found.
 *
 * @param createWorkspaceCwd
 * @returns
 */
function checkValidWorkspace(createWorkspaceCwd: string) {
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
        createPluginCommand.help();
    }
}

/**
 * Get a valid workspace package.json content.
 *
 * @param cwd
 * @returns package.json content of the root
 * @throws
 */
function getValidWorkspace(cwd: string) {
    const json = require(join(cwd, "package.json"));
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

export { createPluginPrompt };
