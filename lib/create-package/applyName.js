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
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var utils_1 = require("../utils");
var glob_1 = __importDefault(require("glob"));
/**
 * Apply a package name to a given cwd. The scope name is automatically read from
 * the parent root package.json#name variable.
 *
 * @param createPackageCwd
 * @param name
 */
function applyName(createPackageCwd, name) {
    // Generate scoped package name
    var scopeName = JSON.parse(fs_extra_1.readFileSync(path_1.resolve(createPackageCwd, "../../package.json"), { encoding: utils_1.DEFAULT_ENCODING })).name +
        "/" +
        name;
    utils_1.logProgress("Apply package name " + chalk_1.default.underline(scopeName) + " to " + chalk_1.default.underline(createPackageCwd));
    var globFiles = function (pattern) { return glob_1.default.sync(pattern, { cwd: createPackageCwd, absolute: true }); };
    var files = __spreadArrays(globFiles("{package,composer}.json"), globFiles("README.md"));
    utils_1.searchAndReplace(files, /wp-reactjs-multi-starter\/utils/g, scopeName);
    utils_1.logSuccess("Successfully applied name to package!");
    return scopeName;
}
exports.applyName = applyName;
