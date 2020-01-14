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
var path_1 = require("path");
var fs_1 = require("fs");
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
function applyPhpNamespace(createPackageCwd, namespace, type) {
    // Apply the namespace
    utils_1.logProgress("Apply namespace " + chalk_1.default.underline(namespace) + " to all PHP files for autoloading...");
    var globFiles = function (pattern) { return glob_1.default.sync(pattern, { cwd: createPackageCwd, absolute: true }); };
    // Define our new package
    utils_1.searchAndReplace(globFiles("composer.json"), type === "utils" ? /MatthiasWeb\\\\Utils/g : /MatthiasWeb\\\\WPRJSS/g, namespace.replace(/\\/g, "\\\\"));
    // Search for namespaces in source and test files
    var phpFiles = __spreadArrays(globFiles("src/**/*.php"), globFiles("test/phpunit/**/*.php"));
    utils_1.searchAndReplace(phpFiles, type === "utils" ? /MatthiasWeb\\Utils/g : /MatthiasWeb\\WPRJSS/g, namespace);
    // Define autoloading for utils package in source and test files
    if (type === "plugin") {
        var utilsPluginReceiverFile = fs_1.readFileSync(path_1.resolve(createPackageCwd, "../../packages/utils/src/PluginReceiver.php"), { encoding: utils_1.DEFAULT_ENCODING });
        var namespaceUtils = utilsPluginReceiverFile.match(/^namespace ([^;]+)/m)[1];
        utils_1.searchAndReplace(globFiles("composer.lock"), /MatthiasWeb\\\\Utils/g, namespaceUtils.replace(/\\/g, "\\\\"));
        utils_1.searchAndReplace(phpFiles, /MatthiasWeb\\Utils/g, namespaceUtils);
    }
    utils_1.logSuccess("Successfully applied PHP namespace to package!");
}
exports.applyPhpNamespace = applyPhpNamespace;
