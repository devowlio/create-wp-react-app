"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var glob_1 = __importDefault(require("glob"));
var chalk_1 = __importDefault(require("chalk"));
var create_package_1 = require("../create-package");
var path_1 = require("path");
/**
 * Generate a namespace for the first created plugin and
 * generate accordingly a namespace for the utils PHP package.
 */
function applyPhpUtils(pluginNamespace, createPluginCwd) {
    var splitNs = pluginNamespace.split("\\");
    var utilsNamespace = (splitNs.length > 1 ? splitNs.slice(0, -1).join("\\") : pluginNamespace) + "\\Utils";
    utils_1.logProgress("Apply namespace to utils package " + chalk_1.default.underline(utilsNamespace) + "...");
    var globFiles = function (pattern) { return glob_1.default.sync(pattern, { cwd: createPluginCwd, absolute: true }); };
    utils_1.searchAndReplace(globFiles("composer.lock"), /MatthiasWeb\\\\Utils/g, utilsNamespace.replace(/\\/g, "\\\\"));
    utils_1.searchAndReplace(globFiles("src/inc/**/*.php"), /MatthiasWeb\\Utils/g, utilsNamespace);
    utils_1.logSuccess("Successfully applied PHP utils namespace to plugin!");
    // Apply to utils package itself
    create_package_1.applyPhpNamespace(path_1.resolve(createPluginCwd, "../../packages/utils"), utilsNamespace);
    return utilsNamespace;
}
exports.applyPhpUtils = applyPhpUtils;
