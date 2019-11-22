"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var fs_1 = require("fs");
/**
 * Update package.json with new utils version and so on.
 *
 * @param root
 * @param createPluginCwd
 * @param input
 */
function applyPackageJson(root, createPluginCwd, input) {
    utils_1.logProgress("Update plugins' package.json...");
    var path = path_1.resolve(createPluginCwd, "package.json");
    var content = fs_1.readFileSync(path, { encoding: utils_1.DEFAULT_ENCODING });
    content = content.replace(/"version":\s*"([0-9.]+)"/g, '"version": "' + input.pluginVersion + '"');
    content = content.replace(/"description":\s*"([^"]+)"/g, '"description": "' + input.pluginDesc + '"');
    content = content.replace(/"author":\s*"([^"]+)"/g, '"author": "' + input.author + '"');
    content = content.replace(/"homepage":\s*"([^"]+)"/g, '"homepage": "' + input.pluginUri + '"');
    // Update utils version
    var utilsVersion = require(path_1.resolve(input.cwd, "packages/utils/package.json")).version;
    content = content.replace(
        new RegExp('"@' + root + '\\/utils":\\s*"\\^([0-9.]+)"', "g"),
        '"@' + root + '/utils": "^' + utilsVersion + '"'
    );
    fs_1.writeFileSync(path, content, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully updated " + chalk_1.default.underline(path));
}
exports.applyPackageJson = applyPackageJson;
