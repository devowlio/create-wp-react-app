"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
/**
 * Find GitLab CI jobs and replace them with the correct prefix (depending on constant prefix).
 *
 * This does not add the include to the root .gitlab-ci.yml!
 *
 * @param createPackageCwd
 * @param constantPrefix
 * @param prefixToReplace
 */
function applyGitLabCi(createPackageCwd, constantPrefix, 
/**
 * Why "utils " and "utils"?
 *
 * The package uses same name and abbreviation for folder path and package names.
 *
 * "utils " reflects all job definitions and needs always be the first replacement.
 */
prefixToReplace) {
    var jobPrefix = constantPrefix.toLowerCase();
    utils_1.logProgress("Find GitLab CI jobs and prefix them with " + chalk_1.default.underline(jobPrefix) + "...");
    var globFiles = function (pattern) { return glob_1.default.sync(pattern, { cwd: createPackageCwd, absolute: true }); };
    var files = __spreadArrays(globFiles("devops/.gitlab/**/*.yml"), globFiles("devops/.gitlab/.gitlab-ci.yml"));
    utils_1.searchAndReplace(files, new RegExp(prefixToReplace, "g"), jobPrefix);
}
exports.applyGitLabCi = applyGitLabCi;
