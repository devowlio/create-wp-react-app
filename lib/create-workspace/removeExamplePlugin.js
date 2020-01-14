"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var utils_1 = require("../utils");
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var rimraf_1 = __importDefault(require("rimraf"));
var misc_1 = require("../misc");
/**
 * Remove first initial plugin and move to create-wp-react-app for others commands.
 * Also alter the .gitlab-ci.yml includes and CHANGELOG.md.
 *
 * @param createCwd
 */
function removeExamplePlugin(createCwd) {
    utils_1.logProgress("Prepare monorepo for future commands like " + chalk_1.default.underline("create-plugin") + " and " + chalk_1.default.underline("create-package") + "...");
    fs_1.writeFileSync(path_1.resolve(createCwd, "plugins/wp-reactjs-starter/CHANGELOG.md"), "", { encoding: utils_1.DEFAULT_ENCODING });
    fs_1.writeFileSync(path_1.resolve(createCwd, "packages/utils/CHANGELOG.md"), "", { encoding: utils_1.DEFAULT_ENCODING });
    fs_1.renameSync(path_1.resolve(createCwd, "plugins/wp-reactjs-starter"), path_1.resolve(createCwd, utils_1.FOLDER_CWRA, "template"));
    // Copy utils package for "create-package" command
    var tmplPackageFolder = path_1.resolve(createCwd, utils_1.FOLDER_CWRA, "template-package");
    fs_extra_1.copySync(path_1.resolve(createCwd, "packages/utils"), tmplPackageFolder);
    rimraf_1.default.sync(path_1.resolve(tmplPackageFolder, "lib"));
    rimraf_1.default.sync(path_1.resolve(tmplPackageFolder, "src"));
    rimraf_1.default.sync(path_1.resolve(tmplPackageFolder, "test/jest"));
    rimraf_1.default.sync(path_1.resolve(tmplPackageFolder, "test/phpunit"));
    fs_1.mkdirSync(path_1.resolve(tmplPackageFolder, "lib"));
    fs_1.mkdirSync(path_1.resolve(tmplPackageFolder, "src"));
    fs_1.mkdirSync(path_1.resolve(tmplPackageFolder, "test/jest"));
    fs_1.mkdirSync(path_1.resolve(tmplPackageFolder, "test/phpunit"));
    misc_1.modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter", "plugins");
}
exports.removeExamplePlugin = removeExamplePlugin;
