import { prompt } from "inquirer";
import { CreatePluginOpts, createPluginCommand, createPluginExecute } from "./";
import {
    getCommandDescriptionForPrompt,
    logError,
    logSuccess,
    inquirerRequiredValidate,
    caseAll,
    FOLDER_CWRA,
    slugCamelCase,
    getGitConfig,
    isValidSemver,
    isValidUrl
} from "../utils";
import chalk from "chalk";
import { resolve, join } from "path";
import { existsSync } from "fs";
import slugify from "slugify";

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

    const gitName = getGitConfig("user.name");

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
                    return useThis
                        ? slugify(useThis, {
                              lower: true
                          }).replace(/^wp-/, "")
                        : undefined;
                },
                validate: (value: string) =>
                    /^[A-Za-z0-9-_]+$/.test(value) ? true : "Your plugin slug should only contain [A-Za-z0-9-_]."
            },
            !pluginUri && {
                name: "pluginUri",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-uri"),
                type: "input",
                validate: (value: string) => (value ? isValidUrl(value, true) : true)
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
                validate: inquirerRequiredValidate,
                default: gitName
            },
            !authorUri && {
                name: "authorUri",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--author-uri"),
                type: "input",
                validate: (value: string) => (value ? isValidUrl(value, true) : true)
            },
            !pluginVersion && {
                name: "pluginVersion",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--plugin-version"),
                type: "input",
                default: "1.0.0",
                validate: (value: string) => isValidSemver(value, true)
            },
            !minPhp && {
                name: "minPhp",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--min-php"),
                type: "input",
                default: "7.0.0",
                validate: (value: string) => isValidSemver(value, true)
            },
            !minWp && {
                name: "minWp",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--min-wp"),
                type: "input",
                default: "5.2.0",
                validate: (value: string) => isValidSemver(value, true)
            },
            !namespace && {
                name: "namespace",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--namespace"),
                type: "input",
                validate: (value: string) => {
                    const required = inquirerRequiredValidate(value);
                    if (required !== true) {
                        return required;
                    }
                    return /^[^\\0-9][A-Za-z_\\]+$/.test(value) ? true : "This is not a valid PHP namespace.";
                },
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.author || author) as string;
                    const useSlug = (dAnswers.slug || slug) as string;
                    return useThis && useSlug
                        ? slugCamelCase(
                              slugify(useThis, {
                                  lower: true
                              }),
                              true
                          ) +
                              "\\" +
                              slugCamelCase(useSlug, true)
                        : undefined;
                }
            },
            !optPrefix && {
                name: "optPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--opt-prefix"),
                type: "input",
                validate: (value: string) => {
                    const required = inquirerRequiredValidate(value);
                    if (required !== true) {
                        return required;
                    }
                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid option prefix.";
                },
                default: (dAnswers: any) => {
                    const result = ((dAnswers.slug || slug) as string).replace(/-/g, "_");
                    const availableFirstLetters = result.match(/_(.)/g);
                    if (availableFirstLetters.length > 1) {
                        return result.charAt(0) + availableFirstLetters.map((o) => o.slice(1)).join("");
                    }
                    return result;
                }
            },
            !dbPrefix && {
                name: "dbPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--db-prefix"),
                type: "input",
                validate: (value: string) => {
                    const required = inquirerRequiredValidate(value);
                    if (required !== true) {
                        return required;
                    }
                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid database table prefix.";
                },
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.optPrefix || optPrefix) as string;
                    return useThis ? useThis.replace(/-/g, "_").replace(/^wp_/, "") : undefined;
                }
            },
            !constantPrefix && {
                name: "constantPrefix",
                message: getCommandDescriptionForPrompt(createPluginCommand, "--constant-prefix"),
                type: "input",
                validate: (value: string) => {
                    const required = inquirerRequiredValidate(value);
                    if (required !== true) {
                        return required;
                    }
                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid constant prefix.";
                },
                default: (dAnswers: any) => {
                    const useThis = (dAnswers.optPrefix || optPrefix) as string;
                    return useThis ? useThis.toUpperCase().replace(/-/g, "_") : undefined;
                }
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

export { createPluginPrompt };
