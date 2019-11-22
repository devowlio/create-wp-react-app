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
/**
 * Create template files with the given prompt values.
 *
 * @param createPluginCwd
 * @param templates
 * @param input
 * @returns
 */
function applyPromptsToTemplates(createPluginCwd, templates, input) {
    var applyTemplate = function(tmpl) {
        var mod = tmpl;
        Object.entries(input).forEach(function(_a) {
            var key = _a[0],
                value = _a[1];
            if (key === "namespace") {
                value = value.replace(/\\/g, "\\\\");
            }
            mod = mod.replace(new RegExp("\\$\\{" + key + "\\}", "g"), value);
        });
        return mod;
    };
    var indexPhpFile = path_1.resolve(createPluginCwd, "src/index.php");
    var readmeTxtFile = path_1.resolve(createPluginCwd, "wordpress.org/README.wporg.txt");
    var indexPhpContent = applyTemplate(templates["index.php"]);
    var readmeTxtContent = applyTemplate(templates["readme.wporg.txt"]);
    fs_1.writeFileSync(indexPhpFile, indexPhpContent, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully created main plugin file " + chalk_1.default.underline(indexPhpFile));
    fs_1.writeFileSync(readmeTxtFile, readmeTxtContent, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess(
        "Successfully created readme file for wordpress.org " + chalk_1.default.underline(readmeTxtFile)
    );
    return {
        indexPhpFile: indexPhpFile,
        readmeTxtFile: readmeTxtFile,
        indexPhpContent: indexPhpContent,
        readmeTxtContent: readmeTxtContent
    };
}
exports.applyPromptsToTemplates = applyPromptsToTemplates;
