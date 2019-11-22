"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var execa = require("execa");
var PROMPT_AFTER_BOOTSTRAP = [
    {
        name: "i18n",
        type: "confirm",
        message: "Would you like to do an initial i18n generation for the new plugin (.pot files)?",
        default: "y"
    },
    {
        name: "build",
        type: "confirm",
        message:
            "Would you like to do an initial build process for the new plugin (usually this is done by CI, but sure is sure)?",
        default: "y"
    },
    {
        name: "docs",
        type: "confirm",
        message:
            "Would you like to do an initial generation of the technical docs for the new plugin (PHP, JS, API, Hooks)?",
        default: "y"
    }
];
exports.PROMPT_AFTER_BOOTSTRAP = PROMPT_AFTER_BOOTSTRAP;
/**
 * Depending on the answers of PROMPT_AFTER_BOOTSTRAP do some basic builds.
 *
 * @param answers
 */
function preInstallationBuilds(answers, createPluginCwd) {
    if (answers.i18n) {
        utils_1.logProgress("Start i18n generation...");
        execa.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
        execa.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully generate .pot files in your plugin");
    }
    if (answers.build) {
        utils_1.logProgress("Start initial build process...");
        execa.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully created first build");
    }
    if (answers.docs) {
        utils_1.logProgress("Generate technical documents...");
        execa.sync("yarn", ["docs"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully created technical documents");
    }
}
exports.preInstallationBuilds = preInstallationBuilds;
