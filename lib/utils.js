"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var url_1 = require("url");
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
/**
 * Get a git config by parameter.
 *
 * @param param
 * @returns
 */
function getGitConfig(param) {
    try {
        return execa_1.default.sync("git", ["config", "--get", param]).stdout;
    } catch (e) {
        return "";
    }
}
exports.getGitConfig = getGitConfig;
/**
 * Convert a slug like "my-plugin" to "myPlugin".
 *
 * @param slug
 * @param firstUc
 * @returns
 */
function slugCamelCase(slug, firstUc) {
    if (firstUc === void 0) {
        firstUc = false;
    }
    var result = slug.replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase();
    });
    return firstUc ? result.charAt(0).toUpperCase() + result.slice(1) : result;
}
exports.slugCamelCase = slugCamelCase;
/**
 * Checks if a given version is a valid semver.
 *
 * @param version
 * @param errorAsString
 * @returns
 * @see https://github.com/semver/semver/issues/232
 */
function isValidSemver(version, errorAsString) {
    if (errorAsString === void 0) {
        errorAsString = false;
    }
    var valid = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/.test(
        version
    );
    return valid ? true : errorAsString ? "This is not a valid version." : false;
}
exports.isValidSemver = isValidSemver;
/**
 * Checks if the given url is valid.
 *
 * @param url
 * @param errorAsString
 * @returns
 */
function isValidUrl(url, errorAsString) {
    if (errorAsString === void 0) {
        errorAsString = false;
    }
    try {
        new url_1.URL(url);
        return true;
    } catch (e) {
        return errorAsString ? "This is not a valid URL" : false;
    }
}
exports.isValidUrl = isValidUrl;
