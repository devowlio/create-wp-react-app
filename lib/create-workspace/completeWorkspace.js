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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var chalk_1 = __importDefault(require("chalk"));
var _1 = require("./");
var utils_1 = require("../utils");
var create_plugin_1 = require("../create-plugin");
var terminal_link_1 = __importDefault(require("terminal-link"));
var misc_1 = require("../misc");
/**
 * The workspace and initial plugin is created, do some installation process!
 *
 * @param createPluginCwd
 * @param createWorkspaceCwd
 * @param workspaceData
 * @param gitlabProject
 */
function completeWorkspace(createPluginCwd, createWorkspaceCwd, createUtilsCwd, gitlabProject) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Install dependencies
            utils_1.logProgress("Bootstrap monorepo and download dependencies...");
            execa_1.default.sync("yarn", ["bootstrap"], { cwd: createWorkspaceCwd, stdio: "inherit" });
            _1.runThirdPartyLicenses(createWorkspaceCwd);
            misc_1.regenerateLaunchJson(createWorkspaceCwd);
            // Prompt first build processes
            utils_1.logSuccess("\n\nThe workspace is now usable. For first usage it is recommend to do some first tests and builds to check all is working fine.");
            create_plugin_1.preInstallationBuilds(createUtilsCwd);
            create_plugin_1.preInstallationBuilds(createPluginCwd);
            // Start VSCode if available
            try {
                execa_1.default("code", [createWorkspaceCwd], {
                    detached: true
                });
            }
            catch (e) {
                // Silence is golden.
            }
            // Push changes
            if (gitlabProject) {
                utils_1.logProgress("Push complete code to repository...");
                execa_1.default.sync("git", ["add", "-A"], { cwd: createWorkspaceCwd, stdio: "inherit" });
                execa_1.default.sync("git", ["commit", "-m 'chore: initial commit'", "--no-verify"], {
                    cwd: createWorkspaceCwd,
                    stdio: "inherit"
                });
                execa_1.default.sync("git", ["push", "origin", "develop"], { cwd: createWorkspaceCwd, stdio: "inherit" });
                utils_1.logSuccess("Successfully pushed code, see your CI/CD pipeline running " + terminal_link_1.default("here", gitlabProject.web_url + "/pipelines"));
            }
            utils_1.logProgress("Initially start the development environment with " + chalk_1.default.underline("yarn docker:start") + "...");
            execa_1.default("yarn", ["docker:start"], { cwd: createWorkspaceCwd, stdio: "inherit" });
            return [2 /*return*/];
        });
    });
}
exports.completeWorkspace = completeWorkspace;
