import chalk from "chalk";
import { command, Option } from "commander";
import { readFileSync, writeFileSync } from "fs";

const FOLDER_CWRA = "common/create-wp-react-app";

const DEFAULT_ENCODING = "UTF-8";

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

const logProgress = (text: string) => console.log(chalk.black.bgCyan(text));
const logSuccess = (text: string) => console.log(chalk.black.green(text));
const logError = (text: string) => console.log(chalk.red(text));

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

export {
    FOLDER_CWRA,
    DEFAULT_ENCODING,
    getCommandOption,
    getCommandDescriptionForPrompt,
    searchAndReplace,
    logProgress,
    logSuccess,
    logError,
    inquirerRequiredValidate,
    caseAll
};
