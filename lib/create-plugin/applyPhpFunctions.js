"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
/**
 * Find PHP functions starting with wprjss_skip and replace them with the
 * correct prefix (depending on constant prefix).
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyPhpFunctions(createPluginCwd, constantPrefix) {
    var functionPrefix = constantPrefix.toLowerCase();
    utils_1.logProgress("Find PHP functions and replace with " + chalk_1.default.underline(functionPrefix) + " prefix...");
    var phpFiles = glob_1.default.sync("src/**/*.php", { cwd: createPluginCwd, absolute: true });
    utils_1.searchAndReplace(phpFiles, /wprjss_skip/g, functionPrefix + "_skip");
}
exports.applyPhpFunctions = applyPhpFunctions;
