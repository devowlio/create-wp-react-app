"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var fs_1 = require("fs");
/**
 * Update package.json with new utils version and author information.
 * Each package also contains a composer.json, update it too...
 *
 * It does not update the name of the package!
 *
 * @param root
 * @param createPackageCwd
 * @param input
 * @param updateUtilsVersion
 */
function applyPackageJson(root, createPackageCwd, input, updateUtilsVersion) {
    if (updateUtilsVersion === void 0) { updateUtilsVersion = true; }
    var packageJsonPath = path_1.resolve(createPackageCwd, "package.json");
    var composerJsonPath = path_1.resolve(createPackageCwd, "composer.json");
    utils_1.logProgress("Update " + chalk_1.default.underline(packageJsonPath) + "...");
    var packageJson = fs_1.readFileSync(packageJsonPath, { encoding: utils_1.DEFAULT_ENCODING });
    packageJson = packageJson.replace(/"version":\s*"([0-9.]+)"/g, '"version": "' + input.version + '"');
    packageJson = packageJson.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.description + '"');
    packageJson = packageJson.replace(/"author":\s*"([^"]+)"/g, '"author": "' + input.author + '"');
    packageJson = packageJson.replace(/"homepage":\s*"([^"]+)"/g, '"homepage": "' + input.homepage + '"');
    // Update utils version
    if (updateUtilsVersion) {
        var utilsVersion = require(path_1.resolve(createPackageCwd, "../../packages/utils/package.json")).version;
        packageJson = packageJson.replace(new RegExp('"@' + root + '\\/utils":\\s*"\\^([0-9.]+)"', "g"), '"@' + root + '/utils": "^' + utilsVersion + '"');
    }
    fs_1.writeFileSync(packageJsonPath, packageJson, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully updated " + chalk_1.default.underline(packageJsonPath));
    // Update composer.json
    utils_1.logProgress("Update " + chalk_1.default.underline(composerJsonPath) + "...");
    var composerJson = fs_1.readFileSync(composerJsonPath, { encoding: utils_1.DEFAULT_ENCODING });
    composerJson = composerJson.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.description + '"');
    composerJson = composerJson.replace(/Matthias Günter/g, input.author);
    fs_1.writeFileSync(composerJsonPath, composerJson, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully updated " + chalk_1.default.underline(composerJsonPath));
}
exports.applyPackageJson = applyPackageJson;
