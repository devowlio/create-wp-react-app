"use strict";
var __spreadArrays =
    (this && this.__spreadArrays) ||
    function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
        return r;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
/**
 * Apply workspace name to the given folder.
 *
 * @param workspace
 * @param createCwd
 */
function applyWorkspaceName(workspace, createCwd) {
    utils_1.logProgress("Apply workspace name " + chalk_1.default.underline(workspace) + "...");
    var globFiles = function(pattern) {
        return glob_1.default.sync(pattern, { cwd: createCwd, absolute: true });
    };
    var workspaceFiles = __spreadArrays(
        globFiles(".gitlab-ci.yml"),
        globFiles("**/package.json"),
        globFiles("packages/utils/README.md")
    );
    utils_1.searchAndReplace(workspaceFiles, /wp-reactjs-multi-starter/g, workspace);
    utils_1.logSuccess("Workspace is now branded as " + chalk_1.default.underline(workspace));
}
exports.applyWorkspaceName = applyWorkspaceName;
