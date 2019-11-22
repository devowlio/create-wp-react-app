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
function applyPackageJson(createPluginCwd, input) {
    // Update package.json with new utils version and so on.
    utils_1.logProgress("Update plugins' package.json...");
    var path = path_1.resolve(createPluginCwd, "package.json");
    var content = fs_1.readFileSync(path, { encoding: utils_1.DEFAULT_ENCODING });
    content = content.replace(/"version":\s*"([0-9.]+)"/g, input.pluginVersion);
    content = content.replace(/"description":\s*"([^"]+)"/g, input.pluginDesc);
    content = content.replace(/"author":\s*"([^"]+)"/g, input.author);
    content = content.replace(/"homepage":\s*"([^"]+)"/g, input.pluginUri);
    fs_1.writeFileSync(path, content, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully updated " + chalk_1.default.underline(path));
}
exports.applyPackageJson = applyPackageJson;
