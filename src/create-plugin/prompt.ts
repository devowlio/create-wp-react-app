import { prompt } from "inquirer";
import { CreatePluginOpts, createPluginCommand, createPluginExecute } from "./";
import {
    getCommandDescriptionForPrompt,
    logError,
    inquirerRequiredValidate,
    caseAll,
    slugCamelCase,
    getGitConfig,
    isValidSemver,
    isValidUrl,
    isValidPhpNamespace,
    getInternalExampleArgs,
    checkValidWorkspace
} from "../utils";
import { resolve } from "path";
import slugify from "slugify";
import { newsletterPrompt } from "../misc";

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
        root = checkValidWorkspace(createWorkspaceCwd, createPluginCommand);
    }

    const mockData = getInternalExampleArgs("plugin");
    const gitName = getGitConfig("user.name");

    const answers =
        (mockData as any) ||
        (await prompt(
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
                        return isValidPhpNamespace(value) ? true : "This is not a valid PHP namespace.";
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
                        if (availableFirstLetters && availableFirstLetters.length > 1) {
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
        ));

    // If there is no plugin name given via CLI also ask for email marketing
    await newsletterPrompt(!(mockData as any) && !pluginName);

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
            root = checkValidWorkspace(createWorkspaceCwd, createPluginCommand);
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
