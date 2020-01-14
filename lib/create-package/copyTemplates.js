"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rimraf_1 = __importDefault(require("rimraf"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var utils_1 = require("../utils");
var fs_extra_1 = require("fs-extra");
/**
 * Copy templates to the given path and read template files.
 *
 * @param createPackageCwd
 */
function copyTemplates(createPackageCwd) {
    utils_1.logProgress("Create new package from template...");
    var templateCwd = path_1.resolve(createPackageCwd, "../..", utils_1.FOLDER_CWRA, "template-package");
    fs_extra_1.copySync(templateCwd, createPackageCwd);
    // Delete language folder
    rimraf_1.default.sync(path_1.resolve(createPackageCwd, "languages"));
    utils_1.logSuccess("Successfully created package folder " + chalk_1.default.underline(createPackageCwd));
}
exports.copyTemplates = copyTemplates;
