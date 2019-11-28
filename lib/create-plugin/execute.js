"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function(resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator =
    (this && this.__generator) ||
    function(thisArg, body) {
        var _ = {
                label: 0,
                sent: function() {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function(v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y["return"]
                                    : op[0]
                                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
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
    return __awaiter(this, void 0, void 0, function() {
        var createPluginCwd, templates, appliedTemplates, answers;
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    createPluginCwd = path_1.resolve(input.cwd, "plugins", input.slug);
                    // Strictly do not override an existing plugin!!
                    if (fs_1.existsSync(createPluginCwd)) {
                        throw new Error("You already have a plugin with slug " + input.slug + ".");
                    }
                    templates = _1.copyTemplates(createPluginCwd);
                    appliedTemplates = _1.applyPromptsToTemplates(createPluginCwd, templates, input);
                    _1.applyPhpConstantsAndNamespace(
                        createPluginCwd,
                        appliedTemplates,
                        input.constantPrefix,
                        input.namespace
                    );
                    _1.applyPhpFunctions(createPluginCwd, input.constantPrefix);
                    _1.applySlug(root.name, createPluginCwd, input.slug);
                    _1.applyGitLabCi(createPluginCwd, input.constantPrefix);
                    applyPackageJson_1.applyPackageJson(root.name, createPluginCwd, input);
                    _1.modifyRootGitLabCiInclude("add", input.cwd, input.slug);
                    utils_1.logSuccess(
                        "Successfully created plugin " +
                            input.pluginName +
                            " in " +
                            chalk_1.default.underline(createPluginCwd)
                    );
                    if (!!fromWorkspace) return [3 /*break*/, 2];
                    // TODO: Ask for add-on development
                    utils_1.logProgress("Bootstrap and link new plugin...");
                    execa_1.default.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
                    execa_1.default.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });
                    return [
                        4 /*yield*/,
                        inquirer_1.prompt(
                            __spreadArrays(_1.PROMPT_AFTER_BOOTSTRAP, [
                                {
                                    name: "dev",
                                    type: "confirm",
                                    message:
                                        "Would you like to rebuild the development environment with " +
                                        chalk_1.default.underline("yarn docker:start") +
                                        " so your new plugin is visible?",
                                    default: "y"
                                }
                            ])
                        )
                    ];
                case 1:
                    answers = _a.sent();
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
                    _a.label = 2;
                case 2:
                    return [2 /*return*/, createPluginCwd];
            }
        });
    });
}
exports.createPluginExecute = createPluginExecute;
