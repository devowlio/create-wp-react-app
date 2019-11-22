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
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var path_1 = require("path");
var rimraf_1 = __importDefault(require("rimraf"));
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
var fs_1 = require("fs");
var create_plugin_1 = require("../create-plugin");
/**
 * Generate a new workspace from a given repository and disconnect it.
 * Also do some garbage collection and movements for other commands.
 *
 * @throws
 */
function createWorkspaceExecute(input) {
    return __awaiter(this, void 0, void 0, function() {
        var createCwd, globFiles, workspaceFiles, portFiles;
        return __generator(this, function(_a) {
            switch (_a.label) {
                case 0:
                    createCwd = path_1.resolve(process.cwd(), input.workspace);
                    globFiles = function(pattern) {
                        return glob_1.default.sync(pattern, { cwd: createCwd, absolute: true });
                    };
                    // TODO: if possible create single functions in own files
                    // Start cloning the repository
                    utils_1.logProgress(
                        "Clone and checkout repository at " + chalk_1.default.underline(input.checkout) + "..."
                    );
                    return [
                        4 /*yield*/,
                        execa_1.default("git", ["clone", input.repository, input.workspace], { stdio: "inherit" })
                    ];
                case 1:
                    _a.sent();
                    return [
                        4 /*yield*/,
                        execa_1.default("git", ["checkout", input.checkout], { cwd: createCwd, stdio: "inherit" })
                    ];
                case 2:
                    _a.sent();
                    // Disconnect git respository
                    utils_1.logProgress("Disconnect git repository...");
                    rimraf_1.default.sync(path_1.resolve(createCwd, ".git"));
                    utils_1.logSuccess("Workspace successfully created in " + chalk_1.default.underline(createCwd));
                    // Remove first initial plugin and move to create-wp-react-app for others commands
                    utils_1.logProgress(
                        "Prepare monorepo for " +
                            chalk_1.default.underline("create-wp-react-app create-plugin") +
                            " command..."
                    );
                    fs_1.renameSync(
                        path_1.resolve(createCwd, "plugins/wp-reactjs-starter"),
                        path_1.resolve(createCwd, utils_1.FOLDER_CWRA, "template")
                    );
                    // Remove also the .gitlab-ci.yml include
                    create_plugin_1.modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter");
                    // Apply workspace name
                    utils_1.logProgress("Apply workspace name " + chalk_1.default.underline(input.workspace) + "...");
                    workspaceFiles = __spreadArrays(
                        globFiles(".gitlab-ci.yml"),
                        globFiles("**/package.json"),
                        globFiles("packages/utils/README.md")
                    );
                    utils_1.searchAndReplace(workspaceFiles, /wp-reactjs-multi-starter/g, input.workspace);
                    utils_1.logSuccess("Workspace is now branded as " + chalk_1.default.underline(input.workspace));
                    // Apply ports
                    utils_1.logProgress(
                        "Apply ports " +
                            chalk_1.default.underline(input.portWp) +
                            " (WP) and " +
                            chalk_1.default.underline(input.portPma) +
                            " (PMA) for local development..."
                    );
                    portFiles = globFiles("devops/docker-compose/docker-compose.local.yml");
                    utils_1.searchAndReplace(portFiles, /"8080:80"/g, '"' + input.portWp + ':80"');
                    utils_1.searchAndReplace(portFiles, /"8079:80"/g, '"' + input.portPma + ':80"');
                    // Run create-plugin command without installation (because this is done below)
                    create_plugin_1.createPluginPrompt(
                        {
                            cwd: createCwd
                        },
                        function() {
                            // TODO: Install dependencies
                            utils_1.logProgress("Bootstrap monorepo and download dependencies...");
                            // await execa('yarn', ['bootstrap'], { cwd: createCwd, stdio: 'inherit' });
                            // TODO: Links to what's happening next
                        }
                    );
                    return [2 /*return*/];
            }
        });
    });
}
exports.createWorkspaceExecute = createWorkspaceExecute;
