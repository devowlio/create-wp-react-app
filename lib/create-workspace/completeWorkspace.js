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
var execa_1 = __importDefault(require("execa"));
var utils_1 = require("../utils");
var create_plugin_1 = require("../create-plugin");
var inquirer_1 = require("inquirer");
var chalk_1 = __importDefault(require("chalk"));
var terminal_link_1 = __importDefault(require("terminal-link"));
/**
 * The workspace and initial plugin is created, do some installation process!
 *
 * @param createPluginCwd
 * @param pluginData
 * @param createWorkspaceCwd
 * @param workspaceData
 */
function completeWorkspace(createPluginCwd, pluginData, createWorkspaceCwd, workspaceData) {
    var localhostLink = "http://localhost:" + workspaceData.portWp;
    // Install dependencies
    utils_1.logProgress("Bootstrap monorepo and download dependencies...");
    execa_1.default.sync("yarn", ["bootstrap"], { cwd: createWorkspaceCwd, stdio: "inherit" });
    // Prompt first build processes
    utils_1.logSuccess(
        "\n\nThe workspace is now usable. For first usage it is recommend to do some first tests and builds to check all is working fine."
    );
    inquirer_1
        .prompt(
            __spreadArrays(create_plugin_1.PROMPT_AFTER_BOOTSTRAP, [
                {
                    name: "dev",
                    type: "confirm",
                    message:
                        "Imagine all the above worked without any problem, would you like to start the development environment " +
                        terminal_link_1.default(localhostLink, localhostLink) +
                        "? If you pass 'yes' this shell keeps open because it starts in 'watch' mode. You can safely close the shell then and start it again with " +
                        chalk_1.default.underline("yarn docker:start") +
                        ".",
                    default: "y"
                }
            ])
        )
        .then(function(answers) {
            create_plugin_1.preInstallationBuilds(
                {
                    build: answers.build,
                    docs: answers.docs
                },
                createPluginCwd
            );
            if (answers.dev) {
                utils_1.logProgress("Initially start the development environment...");
                execa_1.default("yarn", ["docker:start"], { cwd: createWorkspaceCwd, stdio: "inherit" });
            }
        });
}
exports.completeWorkspace = completeWorkspace;
