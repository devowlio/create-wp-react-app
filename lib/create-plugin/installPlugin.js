"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var execa_1 = __importDefault(require("execa"));
var PROMPT_AFTER_BOOTSTRAP = [
    {
        name: "build",
        type: "confirm",
        message: "Would you like to do an initial build process for the new plugin (usually this is done by CI, but sure is sure)?",
        default: "y"
    },
    {
        name: "docs",
        type: "confirm",
        message: "Would you like to do an initial generation of the technical docs for the new plugin (PHP, JS, API, Hooks)?",
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
    if (answers.build) {
        utils_1.logProgress("Start initial build process...");
        execa_1.default.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully created first build");
        utils_1.logProgress("Start i18n generation...");
        execa_1.default.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
        execa_1.default.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully generate .pot files in your plugin");
    }
    if (answers.docs) {
        utils_1.logProgress("Generate technical documents...");
        execa_1.default.sync("yarn", ["docs"], { cwd: createPluginCwd, stdio: "inherit" });
        utils_1.logSuccess("Successfully created technical documents");
    }
}
exports.preInstallationBuilds = preInstallationBuilds;
