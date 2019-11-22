"use strict";
var __spreadArrays =
    (this && this.__spreadArrays) ||
    function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
        return r;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = require("inquirer");
var path_1 = require("path");
var fs_1 = require("fs");
var _1 = require("./");
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var applyPackageJson_1 = require("./applyPackageJson");
/**
 * Generate a new plugin from the template. All validations are done in createPluginPrompt.
 *
 * @param root
 * @param input
 * @param fromWorkspace
 * @returns
 * @throws
 */
function createPluginExecute(root, input, fromWorkspace) {
    if (fromWorkspace === void 0) {
        fromWorkspace = false;
    }
    var createPluginCwd = path_1.resolve(input.cwd, "plugins", input.slug);
    // Strictly do not override an existing plugin!!
    if (fs_1.existsSync(createPluginCwd)) {
        throw new Error("You already have a plugin with slug " + input.slug + ".");
    }
    var templates = _1.copyTemplates(createPluginCwd);
    var appliedTemplates = _1.applyPromptsToTemplates(createPluginCwd, templates, input);
    _1.applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, input.constantPrefix, input.namespace);
    _1.applyPhpFunctions(createPluginCwd, input.constantPrefix);
    _1.applySlug(root.name, createPluginCwd, input.slug);
    _1.applyGitLabCi(createPluginCwd, input.constantPrefix);
    applyPackageJson_1.applyPackageJson(root.name, createPluginCwd, input);
    _1.modifyRootGitLabCiInclude("add", input.cwd, input.slug);
    utils_1.logSuccess(
        "Successfully created plugin " + input.pluginName + " in " + chalk_1.default.underline(createPluginCwd)
    );
    if (!fromWorkspace) {
        // TODO: Ask for add-on development
        utils_1.logProgress("Bootstrap and link new plugin...");
        execa_1.default.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
        execa_1.default.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });
        // Start initial builds...
        inquirer_1
            .prompt(
                __spreadArrays(_1.PROMPT_AFTER_BOOTSTRAP, [
                    {
                        name: "dev",
                        type: "confirm",
                        message:
                            "Imagine all the above worked without any problem, would you like to rebuild the development environment with 'yarn docker:start' so your new plugin is visible?",
                        default: "y"
                    }
                ])
            )
            .then(function(answers) {
                // First builds
                _1.preInstallationBuilds(
                    {
                        build: answers.build,
                        docs: answers.docs
                    },
                    createPluginCwd
                );
                if (answers.dev) {
                    utils_1.logProgress(
                        "Rebuild the development environment, afterwards you can activate your new plugin..."
                    );
                    execa_1.default("yarn", ["docker:start"], { cwd: input.cwd, stdio: "inherit" });
                }
            });
    }
    return createPluginCwd;
}
exports.createPluginExecute = createPluginExecute;
