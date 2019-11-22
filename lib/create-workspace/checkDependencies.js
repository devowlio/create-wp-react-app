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
var utils_1 = require("../utils");
var execa_1 = __importDefault(require("execa"));
var chalk_1 = __importDefault(require("chalk"));
var terminal_link_1 = __importDefault(require("terminal-link"));
var LINK_YARN = "https://yarnpkg.com/docs/install/";
var LINK_COMPOSER = "https://getcomposer.org/";
var LINK_WP_CLI = "https://wp-cli.org/";
var LINK_DOCKER = "https://docs.docker.com/install/";
var LINK_DOCKER_COMPOSE = "https://docs.docker.com/compose/install/";
/**
 * Check needed dependencies and exit if something missing.
 */
function checkDependencies() {
    return __awaiter(this, void 0, void 0, function() {
        var exit, exec;
        return __generator(this, function(_a) {
            exit = false;
            utils_1.logProgress("Checking prerequesits...");
            // Yarn
            try {
                exec = execa_1.default.sync("yarn", ["--version"]);
                utils_1.logSuccess("├── Yarn v" + exec.stdout);
            } catch (e) {
                exit = true;
                utils_1.logError(
                    "\u251C\u2500\u2500 Missing " +
                        chalk_1.default.underline("yarn") +
                        " (npm alternative which is used in WP ReactJS Starter), install it now: " +
                        terminal_link_1.default(LINK_YARN, LINK_YARN)
                );
            }
            // Composer
            try {
                exec = execa_1.default.sync("composer", ["--version"]);
                utils_1.logSuccess("├── " + exec.stdout);
            } catch (e) {
                exit = true;
                utils_1.logError(
                    "\u251C\u2500\u2500 Missing " +
                        chalk_1.default.underline("composer") +
                        " (PHP dependency manager), install it now: " +
                        terminal_link_1.default(LINK_COMPOSER, LINK_COMPOSER)
                );
            }
            // WP CLI
            try {
                exec = execa_1.default.sync("wp", ["--version"]);
                utils_1.logSuccess("├── " + exec.stdout);
            } catch (e) {
                exit = true;
                utils_1.logError(
                    "\u251C\u2500\u2500 Missing " +
                        chalk_1.default.underline("wp") +
                        " (WordPress command line interface), install it now: " +
                        terminal_link_1.default(LINK_WP_CLI, LINK_WP_CLI)
                );
            }
            // Docker
            try {
                exec = execa_1.default.sync("docker", ["--version"]);
                utils_1.logSuccess("├── " + exec.stdout);
            } catch (e) {
                exit = true;
                utils_1.logError(
                    "\u251C\u2500\u2500 Missing " +
                        chalk_1.default.underline("docker") +
                        " (containerizing applications), install it now: " +
                        terminal_link_1.default(LINK_DOCKER, LINK_DOCKER)
                );
            }
            // Docker compose
            try {
                exec = execa_1.default.sync("docker-compose", ["--version"]);
                utils_1.logSuccess("├── " + exec.stdout);
            } catch (e) {
                exit = true;
                utils_1.logError(
                    "\u251C\u2500\u2500 Missing " +
                        chalk_1.default.underline("docker-compose") +
                        " (connect multiple containerized applications within a network), install it now: " +
                        terminal_link_1.default(LINK_DOCKER_COMPOSE, LINK_DOCKER_COMPOSE)
                );
            }
            if (exit) {
                process.exit(1);
            }
            return [2 /*return*/];
        });
    });
}
exports.checkDependencies = checkDependencies;
