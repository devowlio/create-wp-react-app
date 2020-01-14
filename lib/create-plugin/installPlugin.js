"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var execa_1 = __importDefault(require("execa"));
/**
 * Do some basic builds for a plugin or package.
 *
 * @param answers
 */
function preInstallationBuilds(createPluginCwd) {
    utils_1.logProgress("Start initial build process...");
    execa_1.default.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
    utils_1.logSuccess("Successfully created first build");
    utils_1.logProgress("Run tests...");
    execa_1.default.sync("yarn", ["test"], { cwd: createPluginCwd, stdio: "inherit" });
    utils_1.logSuccess("Successfully run tests");
    utils_1.logProgress("Start i18n generation...");
    execa_1.default.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
    execa_1.default.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
    utils_1.logSuccess("Successfully generate .pot files in your plugin");
}
exports.preInstallationBuilds = preInstallationBuilds;
