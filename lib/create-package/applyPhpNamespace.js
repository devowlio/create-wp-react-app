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
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
/**
 * Apply PHP namespace to package source files.
 *
 * @param createPackageCwd
 * @param namespace
 */
function applyPhpNamespace(createPackageCwd, namespace) {
    // Apply the namespace
    utils_1.logProgress("Apply namespace " + chalk_1.default.underline(namespace) + " to all PHP files for autoloading...");
    var globFiles = function (pattern) { return glob_1.default.sync(pattern, { cwd: createPackageCwd, absolute: true }); };
    utils_1.searchAndReplace(globFiles("composer.*"), /MatthiasWeb\\\\Utils/g, namespace.replace(/\\/g, "\\\\"));
    utils_1.searchAndReplace(__spreadArrays(globFiles("src/**/*.php"), globFiles("test/phpunit/**/*.php")), /MatthiasWeb\\Utils/g, namespace);
    utils_1.logSuccess("Successfully applied PHP namespace to package!");
}
exports.applyPhpNamespace = applyPhpNamespace;
