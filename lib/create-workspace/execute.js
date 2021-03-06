"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var _1 = require("./");
var create_plugin_1 = require("../create-plugin");
var create_package_1 = require("../create-package");
var utils_1 = require("../utils");
var misc_1 = require("../misc");
var createDotEnv_1 = require("./createDotEnv");
/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 */
function createWorkspaceExecute(input) {
    return __awaiter(this, void 0, void 0, function () {
        var createCwd, utilsPath, gitlabProjectCreator, gitLabProject;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createCwd = path_1.resolve(process.cwd(), input.workspace);
                    utilsPath = path_1.resolve(createCwd, "packages/utils");
                    return [4 /*yield*/, _1.promptGitLab(input.workspace)];
                case 1:
                    gitlabProjectCreator = _a.sent();
                    // Run create-plugin command without installation (because this is done below)
                    // So we have all prompts in one flow, awesome!
                    return [4 /*yield*/, create_plugin_1.createPluginPrompt({
                            cwd: createCwd
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(gitlabProjectCreator !== false)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, gitlabProjectCreator()];
                                    case 1:
                                        gitLabProject = _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        _1.createGitFolder(input.checkout, input.repository, createCwd, gitLabProject);
                                        createDotEnv_1.createDotEnv(createCwd, input);
                                        _1.removeExamplePlugin(createCwd);
                                        _1.applyWorkspaceName(input.workspace, createCwd);
                                        _1.applyPorts(input.portWp, input.portPma, createCwd);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (createPluginCwd, pluginData) { return __awaiter(_this, void 0, void 0, function () {
                            var splitNs, utilsNamespace;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        splitNs = pluginData.namespace.split("\\");
                                        utilsNamespace = (splitNs.length > 1 ? splitNs.slice(0, -1).join("\\") : pluginData.namespace) + "\\Utils";
                                        misc_1.applyPhpNamespace(utilsPath, utilsNamespace, "utils");
                                        // Re-apply namespace of utils package for this plugin because before it did not know the namespace
                                        misc_1.applyPhpNamespace(createPluginCwd, pluginData.namespace, "plugin");
                                        create_package_1.applyName(utilsPath, "utils");
                                        misc_1.applyPackageJson(input.workspace, utilsPath, {
                                            author: pluginData.author,
                                            description: "Utility functionality for all your WordPress plugins.",
                                            homepage: pluginData.authorUri,
                                            version: "1.0.0"
                                        }, false);
                                        utils_1.generateLicenseFile(utilsPath, pluginData.author, pluginData.pluginDesc);
                                        // Complete
                                        return [4 /*yield*/, _1.completeWorkspace(createPluginCwd, createCwd, utilsPath, gitLabProject)];
                                    case 1:
                                        // Complete
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    // Run create-plugin command without installation (because this is done below)
                    // So we have all prompts in one flow, awesome!
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createWorkspaceExecute = createWorkspaceExecute;
