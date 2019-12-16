import { prompt } from "inquirer";
import { CreatePackageOpts, createPackageCommand, createPackageExecute } from "./";
import {
    logError,
    caseAll,
    checkValidWorkspace,
    getCommandDescriptionForPrompt,
    inquirerRequiredValidate,
    getGitConfig,
    isValidPhpNamespace,
    slugCamelCase,
    isValidUrl,
    getInternalExampleArgs
} from "../utils";
import { resolve } from "path";
import slugify from "slugify";

/**
 * Prompt for CLI arguments which are not passed.
 *
 * @param opts
 */
async function createPackagePrompt({
    cwd,
    packageName,
    packageDesc,
    author,
    packageUri,
    namespace,
    abbreviation
}: Partial<CreatePackageOpts>) {
    const createWorkspaceCwd = cwd ? resolve(cwd) : process.cwd();
    const root = checkValidWorkspace(createWorkspaceCwd, createPackageCommand);

    const gitName = getGitConfig("user.name");
    const mockData = getInternalExampleArgs("package");

    const answers =
        (mockData as any) ||
        (await prompt(
            [
                !packageName && {
                    name: "packageName",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--package-name"),
                    type: "input",
                    validate: (value: string) =>
                        /^[A-Za-z0-9-_]+$/.test(value) ? true : "Your package slug should only contain [A-Za-z0-9-_]."
                },
                !packageDesc && {
                    name: "packageDesc",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--package-desc"),
                    type: "input"
                },
                !author && {
                    name: "author",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--author"),
                    type: "input",
                    validate: inquirerRequiredValidate,
                    default: gitName
                },
                !packageUri && {
                    name: "packageUri",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--package-uri"),
                    type: "input",
                    validate: (value: string) => (value ? isValidUrl(value, true) : true)
                },
                !namespace && {
                    name: "namespace",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--namespace"),
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
                        const useSlug = (dAnswers.packageName || packageName) as string;
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
                !abbreviation && {
                    name: "abbreviation",
                    message: getCommandDescriptionForPrompt(createPackageCommand, "--abbreviation"),
                    type: "input",
                    validate: (value: string) => {
                        const required = inquirerRequiredValidate(value);
                        if (required !== true) {
                            return required;
                        }
                        return /^[A-Za-z_]+$/.test(value)
                            ? true
                            : "This is not a valid abbreviation (allowed: [A-Za-z_]).";
                    },
                    default: (dAnswers: any) => {
                        const result = ((dAnswers.packageName || packageName) as string).replace(/-/g, "_");
                        const availableFirstLetters = result.match(/_(.)/g);
                        if (availableFirstLetters && availableFirstLetters.length > 1) {
                            return result.charAt(0) + availableFirstLetters.map((o) => o.slice(1)).join("");
                        }
                        return result;
                    }
                }
            ].filter(Boolean)
        ));

    try {
        let parsed = {
            cwd,
            packageName,
            packageDesc,
            author,
            packageUri,
            namespace,
            abbreviation,
            ...answers
        };
        parsed.namespace = parsed.namespace.replace(/\\\\/g, "\\");
        parsed = caseAll(parsed, [], ["abbreviation", "packageName", "packageUri"]);

        await createPackageExecute(root, parsed);
    } catch (e) {
        logError(e.toString());
    }
}

export { createPackagePrompt };
