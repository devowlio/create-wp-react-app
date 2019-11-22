"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var utils_1 = require("../utils");
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
/**
 * Copy templates to the given path and read template files.
 *
 * @param createPluginCwd
 * @returns
 */
function copyTemplates(createPluginCwd) {
    utils_1.logProgress("Create new plugin from template...");
    var templateCwd = path_1.resolve(createPluginCwd, "../..", utils_1.FOLDER_CWRA, "template");
    fs_extra_1.copySync(templateCwd, createPluginCwd);
    var templates = {
        "index.php": fs_1.readFileSync(path_1.resolve(templateCwd, "../grunt-index-php.tmpl"), {
            encoding: utils_1.DEFAULT_ENCODING
        }),
        "readme.wporg.txt": fs_1.readFileSync(path_1.resolve(templateCwd, "../grunt-readme-txt.tmpl"), {
            encoding: utils_1.DEFAULT_ENCODING
        })
    };
    utils_1.logSuccess("Successfully created plugin folder " + chalk_1.default.underline(createPluginCwd));
    return templates;
}
exports.copyTemplates = copyTemplates;
