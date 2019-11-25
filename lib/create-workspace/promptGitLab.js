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
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var gitlab_1 = require("gitlab");
var inquirer_1 = require("inquirer");
var utils_1 = require("../utils");
var terminal_link_1 = __importDefault(require("terminal-link"));
var chalk_1 = __importDefault(require("chalk"));
/**
 * Prompt for GitLab auth and create the repository in the given group / namespace.
 * It exits automatically if something went wrong (for example SSH check)
 *
 * @returns `false` or `any` representing the new project
 */
function promptGitLab() {
    return __awaiter(this, void 0, void 0, function() {
        var doGitlab, _a, host, token, api, groups, user, group, project;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        inquirer_1.prompt([
                            {
                                name: "doGitlab",
                                type: "confirm",
                                message:
                                    "Would you like to connect with your GitLab and automatically create and push to a new repository?"
                            }
                        ])
                    ];
                case 1:
                    doGitlab = _b.sent().doGitlab;
                    if (!doGitlab) return [3 /*break*/, 8];
                    return [
                        4 /*yield*/,
                        inquirer_1.prompt([
                            {
                                name: "host",
                                type: "input",
                                message: "Please provide your GitLab instance URL",
                                default: process.env.GITLAB_HOST || "https://gitlab.com"
                            },
                            {
                                name: "token",
                                type: "input",
                                message:
                                    "Your " +
                                    terminal_link_1.default(
                                        "personal token",
                                        "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html"
                                    ),
                                default: process.env.GITLAB_TOKEN
                            }
                        ])
                    ];
                case 2:
                    (_a = _b.sent()), (host = _a.host), (token = _a.token);
                    // Check if SSH was setup correctly
                    utils_1.logProgress("Check if SSH is setup correctly...");
                    try {
                        execa_1.default.sync("ssh", ["-T", "git@" + host.replace(/^https?:\/\//, "")]);
                    } catch (e) {
                        utils_1.logError(
                            "SSH key is not setup for this host. Please checkout this " +
                                terminal_link_1.default("documentation", "https://docs.gitlab.com/ee/ssh/") +
                                ". You can rerun this command without creating a GitLab repository automatically."
                        );
                        process.exit(1);
                    }
                    api = new gitlab_1.Gitlab({
                        host: host,
                        token: token,
                        rejectUnauthorized: true
                    });
                    utils_1.logProgress("Loading available possible targets for the new repository...");
                    return [4 /*yield*/, api.Groups.all()];
                case 3:
                    groups = _b.sent();
                    return [4 /*yield*/, api.Users.current()];
                case 4:
                    user = _b.sent();
                    return [
                        4 /*yield*/,
                        inquirer_1.prompt([
                            {
                                name: "group",
                                message: "Where do you want to create the repository?",
                                type: "list",
                                choices: groups
                                    .map(function(g) {
                                        return {
                                            name: g.full_name,
                                            value: g
                                        };
                                    })
                                    .concat([
                                        {
                                            name: "Assign to myself, " + user.username,
                                            value: ""
                                        }
                                    ])
                            }
                        ])
                    ];
                case 5:
                    group = _b.sent().group;
                    return [
                        4 /*yield*/,
                        api.Projects.create({
                            name: "A test",
                            namespace_id: group ? group.id : undefined,
                            default_branch: "master"
                        })
                    ];
                case 6:
                    project = _b.sent();
                    utils_1.logSuccess(
                        "Successfully created project " + chalk_1.default.underline(project.name_with_namespace)
                    );
                    // Create the protected develop branch
                    utils_1.logProgress("Setup repository...");
                    return [4 /*yield*/, api.Branches.create(project.id, "develop", "master")];
                case 7:
                    _b.sent();
                    utils_1.logSuccess("Successfully created branch " + chalk_1.default.underline("develop"));
                    return [2 /*return*/, project];
                case 8:
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.promptGitLab = promptGitLab;
