"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = require("inquirer");
var _1 = require("./");
var utils_1 = require("../utils");
var path_1 = require("path");
var slugify_1 = __importDefault(require("slugify"));
/**
 * Prompt for CLI arguments which are not passed.
 *
 * @param opts
 * @param before If you pass a callback the plugin itself will not be installed and build because it comes from create-workspace
 * @param after
 */
function createPluginPrompt(_a, before, after) {
    var cwd = _a.cwd, pluginName = _a.pluginName, slug = _a.slug, pluginUri = _a.pluginUri, pluginDesc = _a.pluginDesc, author = _a.author, authorUri = _a.authorUri, pluginVersion = _a.pluginVersion, minPhp = _a.minPhp, minWp = _a.minWp, namespace = _a.namespace, optPrefix = _a.optPrefix, dbPrefix = _a.dbPrefix, constantPrefix = _a.constantPrefix;
    return __awaiter(this, void 0, void 0, function () {
        var root, createWorkspaceCwd, mockData, gitName, answers, _b, parsed, createPluginCwd, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    createWorkspaceCwd = cwd ? path_1.resolve(cwd) : process.cwd();
                    // It is coming directly from create-plugin command
                    if (!before) {
                        root = utils_1.checkValidWorkspace(createWorkspaceCwd, _1.createPluginCommand);
                    }
                    mockData = utils_1.getInternalExampleArgs("plugin");
                    gitName = utils_1.getGitConfig("user.name");
                    _b = mockData;
                    if (_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer_1.prompt([
                            !pluginName && {
                                name: "pluginName",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--plugin-name"),
                                type: "input",
                                validate: utils_1.inquirerRequiredValidate
                            },
                            !slug && {
                                name: "slug",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--slug"),
                                type: "input",
                                default: function (dAnswers) {
                                    var useThis = (dAnswers.pluginName || pluginName);
                                    return useThis
                                        ? slugify_1.default(useThis, {
                                            lower: true
                                        }).replace(/^wp-/, "")
                                        : undefined;
                                },
                                validate: function (value) {
                                    return /^[A-Za-z0-9-_]+$/.test(value) ? true : "Your plugin slug should only contain [A-Za-z0-9-_].";
                                }
                            },
                            !pluginUri && {
                                name: "pluginUri",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--plugin-uri"),
                                type: "input",
                                validate: function (value) { return (value ? utils_1.isValidUrl(value, true) : true); }
                            },
                            !pluginDesc && {
                                name: "pluginDesc",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--plugin-desc"),
                                type: "input"
                            },
                            !author && {
                                name: "author",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--author"),
                                type: "input",
                                validate: utils_1.inquirerRequiredValidate,
                                default: gitName
                            },
                            !authorUri && {
                                name: "authorUri",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--author-uri"),
                                type: "input",
                                validate: function (value) { return (value ? utils_1.isValidUrl(value, true) : true); }
                            },
                            !pluginVersion && {
                                name: "pluginVersion",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--plugin-version"),
                                type: "input",
                                default: "1.0.0",
                                validate: function (value) { return utils_1.isValidSemver(value, true); }
                            },
                            !minPhp && {
                                name: "minPhp",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--min-php"),
                                type: "input",
                                default: "7.0.0",
                                validate: function (value) { return utils_1.isValidSemver(value, true); }
                            },
                            !minWp && {
                                name: "minWp",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--min-wp"),
                                type: "input",
                                default: "5.2.0",
                                validate: function (value) { return utils_1.isValidSemver(value, true); }
                            },
                            !namespace && {
                                name: "namespace",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--namespace"),
                                type: "input",
                                validate: function (value) {
                                    var required = utils_1.inquirerRequiredValidate(value);
                                    if (required !== true) {
                                        return required;
                                    }
                                    return utils_1.isValidPhpNamespace(value) ? true : "This is not a valid PHP namespace.";
                                },
                                default: function (dAnswers) {
                                    var useThis = (dAnswers.author || author);
                                    var useSlug = (dAnswers.slug || slug);
                                    return useThis && useSlug
                                        ? utils_1.slugCamelCase(slugify_1.default(useThis, {
                                            lower: true
                                        }), true) +
                                            "\\" +
                                            utils_1.slugCamelCase(useSlug, true)
                                        : undefined;
                                }
                            },
                            !optPrefix && {
                                name: "optPrefix",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--opt-prefix"),
                                type: "input",
                                validate: function (value) {
                                    var required = utils_1.inquirerRequiredValidate(value);
                                    if (required !== true) {
                                        return required;
                                    }
                                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid option prefix.";
                                },
                                default: function (dAnswers) {
                                    var result = (dAnswers.slug || slug).replace(/-/g, "_");
                                    var availableFirstLetters = result.match(/_(.)/g);
                                    if (availableFirstLetters && availableFirstLetters.length > 1) {
                                        return result.charAt(0) + availableFirstLetters.map(function (o) { return o.slice(1); }).join("");
                                    }
                                    return result;
                                }
                            },
                            !dbPrefix && {
                                name: "dbPrefix",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--db-prefix"),
                                type: "input",
                                validate: function (value) {
                                    var required = utils_1.inquirerRequiredValidate(value);
                                    if (required !== true) {
                                        return required;
                                    }
                                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid database table prefix.";
                                },
                                default: function (dAnswers) {
                                    var useThis = (dAnswers.optPrefix || optPrefix);
                                    return useThis ? useThis.replace(/-/g, "_").replace(/^wp_/, "") : undefined;
                                }
                            },
                            !constantPrefix && {
                                name: "constantPrefix",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createPluginCommand, "--constant-prefix"),
                                type: "input",
                                validate: function (value) {
                                    var required = utils_1.inquirerRequiredValidate(value);
                                    if (required !== true) {
                                        return required;
                                    }
                                    return /^[A-Za-z_]+$/.test(value) ? true : "This is not a valid constant prefix.";
                                },
                                default: function (dAnswers) {
                                    var useThis = (dAnswers.optPrefix || optPrefix);
                                    return useThis ? useThis.toUpperCase().replace(/-/g, "_") : undefined;
                                }
                            }
                        ].filter(Boolean))];
                case 1:
                    _b = (_c.sent());
                    _c.label = 2;
                case 2:
                    answers = _b;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 9, , 10]);
                    parsed = __assign({ cwd: cwd,
                        pluginName: pluginName,
                        slug: slug,
                        pluginUri: pluginUri,
                        pluginDesc: pluginDesc,
                        author: author,
                        authorUri: authorUri,
                        pluginVersion: pluginVersion,
                        minPhp: minPhp,
                        minWp: minWp,
                        namespace: namespace,
                        optPrefix: optPrefix,
                        dbPrefix: dbPrefix,
                        constantPrefix: constantPrefix }, answers);
                    parsed.namespace = parsed.namespace.replace(/\\\\/g, "\\");
                    parsed = utils_1.caseAll(parsed, ["constantPrefix"], ["slug", "pluginUri", "authorUri", "optPrefix", "dbPrefix"]);
                    if (!before) return [3 /*break*/, 5];
                    return [4 /*yield*/, before()];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    // Root can be lazy due create-workspace command
                    if (!root) {
                        root = utils_1.checkValidWorkspace(createWorkspaceCwd, _1.createPluginCommand);
                    }
                    return [4 /*yield*/, _1.createPluginExecute(root, parsed, !!before)];
                case 6:
                    createPluginCwd = _c.sent();
                    if (!after) return [3 /*break*/, 8];
                    return [4 /*yield*/, after(createPluginCwd, parsed)];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _c.sent();
                    utils_1.logError(e_1.toString());
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.createPluginPrompt = createPluginPrompt;
