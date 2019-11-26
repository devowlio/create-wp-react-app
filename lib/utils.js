"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var FOLDER_CWRA = "common/create-wp-react-app";
exports.FOLDER_CWRA = FOLDER_CWRA;
var DEFAULT_ENCODING = "UTF-8";
exports.DEFAULT_ENCODING = DEFAULT_ENCODING;
var logProgress = function(text) {
    return console.log(chalk_1.default.black.bgCyan(text));
};
exports.logProgress = logProgress;
var logSuccess = function(text) {
    return console.log(chalk_1.default.black.green(text));
};
exports.logSuccess = logSuccess;
var logError = function(text) {
    return console.log(chalk_1.default.red(text));
};
exports.logError = logError;
/**
 * Get an option from a command by long definition.
 *
 * @param c
 * @param long
 */
function getCommandOption(c, long) {
    return c.options.filter(function(o) {
        return o.long === long;
    })[0];
}
exports.getCommandOption = getCommandOption;
/**
 * Used in prompts so you do not have to duplicate the question strings
 * and take it directly from the commander option description.
 *
 * @param c
 * @param long
 */
function getCommandDescriptionForPrompt(c, long) {
    return getCommandOption(c, long).description;
}
exports.getCommandDescriptionForPrompt = getCommandDescriptionForPrompt;
/**
 * Search and replace file content and write it back with success message.
 *
 * @param files Absolute pathes
 * @param search
 * @param replace
 */
function searchAndReplace(files, search, replace) {
    var wroteHeader = false;
    files.forEach(function(file) {
        if (file.indexOf(FOLDER_CWRA) === -1) {
            var i_1 = 0;
            var newContent = fs_1.readFileSync(file, { encoding: DEFAULT_ENCODING }).replace(search, function() {
                i_1++;
                return replace;
            });
            fs_1.writeFileSync(file, newContent, { encoding: DEFAULT_ENCODING });
            if (i_1 > 0) {
                if (!wroteHeader) {
                    logSuccess("Search (" + search + ") & Replace (" + replace + "):");
                    wroteHeader = true;
                }
                logSuccess("\u251C\u2500\u2500 " + chalk_1.default.underline(file) + " (" + i_1 + " times)");
            }
        }
    });
}
exports.searchAndReplace = searchAndReplace;
/**
 * Return an error message when the given input is empty.
 *
 * @param value
 * @returns
 */
function inquirerRequiredValidate(value) {
    if (!value) {
        return "This prompt may not be empty!";
    }
    return true;
}
exports.inquirerRequiredValidate = inquirerRequiredValidate;
/**
 * Adjust the cases by keys in a given object.
 *
 * @param object
 * @param upper
 * @param lower
 */
function caseAll(object, upper, lower) {
    upper.forEach(function(i) {
        return (object[i] = object[i].toUpperCase());
    });
    lower.forEach(function(i) {
        return (object[i] = object[i].toLowerCase());
    });
    return object;
}
exports.caseAll = caseAll;
