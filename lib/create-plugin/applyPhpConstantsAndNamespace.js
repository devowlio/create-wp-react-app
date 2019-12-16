"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
/**
 * Apply PHP constants to the available *.php files. Also adjust
 * the PHP autoloading namespace (+ UtilsProvider trait).
 *
 * @param createPluginCwd
 * @param appliedTemplates
 * @param constantPrefix
 */
function applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, constantPrefix, namespace) {
    utils_1.logProgress("Get and apply all your PHP constants to the *.php files...");
    // Find constants
    var m;
    var regex = /define\('([^']+)/g;
    var constantList = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((m = regex.exec(appliedTemplates.indexPhpContent)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach(function (match, groupIndex) {
            if (groupIndex === 1) {
                constantList.push(match);
            }
        });
    }
    // Search & Replace constants
    var phpFiles = glob_1.default.sync("src/**/*.php", { cwd: createPluginCwd, absolute: true });
    constantList.forEach(function (constant) {
        return utils_1.searchAndReplace(phpFiles, new RegExp("WPRJSS" + constant.slice(constantPrefix.length), "g"), constant);
    });
    utils_1.searchAndReplace(glob_1.default.sync("src/inc/base/UtilsProvider.trait.php", { cwd: createPluginCwd, absolute: true }), /'WPRJSS'/g, constantPrefix);
    utils_1.logSuccess("Successfully applied the following constants which you can use now - read more about them in WP ReactJS Starter documentation:\n - " + constantList.join("\n - "));
    // Apply the namespace
    utils_1.logProgress("Apply namespace " + chalk_1.default.underline(namespace) + " to all PHP files for autoloading...");
    utils_1.searchAndReplace(phpFiles, /MatthiasWeb\\WPRJSS/g, namespace);
}
exports.applyPhpConstantsAndNamespace = applyPhpConstantsAndNamespace;
