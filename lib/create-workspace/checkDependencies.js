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
var utils_1 = require("../utils");
var execa_1 = __importDefault(require("execa"));
var chalk_1 = __importDefault(require("chalk"));
var terminal_link_1 = __importDefault(require("terminal-link"));
var inquirer_1 = require("inquirer");
var child_process_1 = require("child_process");
var LINK_YARN = "https://yarnpkg.com/docs/install/";
var LINK_COMPOSER = "https://getcomposer.org/";
var LINK_DOCKER = "https://docs.docker.com/install/";
var LINK_DOCKER_COMPOSE = "https://docs.docker.com/compose/install/";
var LINK_WP_CLI = "https://wp-cli.org/#installing";
var LINK_PRESTISSIMO = "https://packagist.org/packages/hirak/prestissimo";
/**
 * Install a dependency manually.
 *
 * @param command
 */
function installNow(command) {
    return __awaiter(this, void 0, void 0, function () {
        var install;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("The following commands will run in order to install:");
                    command.forEach(function (c) { return console.log(" - " + c); });
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: "install",
                                type: "confirm",
                                message: "Would you like to install it now?",
                                default: "n"
                            }
                        ])];
                case 1:
                    install = (_a.sent()).install;
                    if (install) {
                        try {
                            command.forEach(function (c) { return child_process_1.execSync(c, { stdio: "inherit" }); });
                            return [2 /*return*/, true];
                        }
                        catch (e) {
                            utils_1.logError("Could not be installed, please install manually!");
                        }
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
/**
 * Check needed dependencies and exit if something missing.
 */
function checkDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var exit, exec, e_1, e_2, e_3, e_4, e_5, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exit = false;
                    utils_1.logProgress("Checking prerequesits...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 2, , 4]);
                    exec = execa_1.default.sync("yarn", ["--version"]);
                    utils_1.logSuccess("├── Yarn v" + exec.stdout);
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    utils_1.logError("\u251C\u2500\u2500 Missing " + chalk_1.default.underline("yarn") + " (npm alternative which is used in WP ReactJS Starter), install it now: " + terminal_link_1.default(LINK_YARN, LINK_YARN));
                    return [4 /*yield*/, installNow(["curl -o- -L https://yarnpkg.com/install.sh | bash"])];
                case 3:
                    if (!(_a.sent())) {
                        exit = true;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 5, , 7]);
                    exec = execa_1.default.sync("composer", ["--version"]);
                    utils_1.logSuccess("├── " + exec.stdout);
                    return [3 /*break*/, 7];
                case 5:
                    e_2 = _a.sent();
                    utils_1.logError("\u251C\u2500\u2500 Missing " + chalk_1.default.underline("composer") + " (PHP dependency manager), install it now: " + terminal_link_1.default(LINK_COMPOSER, LINK_COMPOSER));
                    return [4 /*yield*/, installNow([
                            "php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"",
                            "php -r \"if (hash_file('sha384', 'composer-setup.php') === 'c5b9b6d368201a9db6f74e2611495f369991b72d9c8cbd3ffbc63edff210eb73d46ffbfce88669ad33695ef77dc76976') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;\"",
                            "php composer-setup.php",
                            "php -r \"unlink('composer-setup.php');\"",
                            "sudo mv composer.phar /usr/local/bin/composer"
                        ])];
                case 6:
                    if (!(_a.sent())) {
                        exit = true;
                    }
                    return [3 /*break*/, 7];
                case 7:
                    _a.trys.push([7, 8, , 10]);
                    exec = execa_1.default.sync("docker", ["--version"]);
                    utils_1.logSuccess("├── " + exec.stdout);
                    return [3 /*break*/, 10];
                case 8:
                    e_3 = _a.sent();
                    exit = true;
                    utils_1.logError("\u251C\u2500\u2500 Missing " + chalk_1.default.underline("docker") + " (containerizing applications), install it now: " + terminal_link_1.default(LINK_DOCKER, LINK_DOCKER));
                    return [4 /*yield*/, installNow(["curl -o- -L https://get.docker.com | ssh"])];
                case 9:
                    if (!(_a.sent())) {
                        exit = true;
                    }
                    return [3 /*break*/, 10];
                case 10:
                    _a.trys.push([10, 11, , 13]);
                    exec = execa_1.default.sync("docker-compose", ["--version"]);
                    utils_1.logSuccess("├── " + exec.stdout);
                    return [3 /*break*/, 13];
                case 11:
                    e_4 = _a.sent();
                    utils_1.logError("\u251C\u2500\u2500 Missing " + chalk_1.default.underline("docker-compose") + " (connect multiple containerized applications within a network), install it now: " + terminal_link_1.default(LINK_DOCKER_COMPOSE, LINK_DOCKER_COMPOSE));
                    return [4 /*yield*/, installNow(["sudo pip install docker-compose"])];
                case 12:
                    if (!(_a.sent())) {
                        exit = true;
                    }
                    return [3 /*break*/, 13];
                case 13:
                    _a.trys.push([13, 14, , 16]);
                    exec = execa_1.default.sync("wp", ["--version"]);
                    utils_1.logSuccess("├── " + exec.stdout);
                    return [3 /*break*/, 16];
                case 14:
                    e_5 = _a.sent();
                    utils_1.logError("\u251C\u2500\u2500 Missing " + chalk_1.default.underline("wp-cli") + " (WordPress CLI), install it now: " + terminal_link_1.default(LINK_WP_CLI, LINK_WP_CLI));
                    return [4 /*yield*/, installNow([
                            "curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar",
                            "php wp-cli.phar --info",
                            "chmod +x wp-cli.phar",
                            "sudo mv wp-cli.phar /usr/local/bin/wp",
                            "wp --info"
                        ])];
                case 15:
                    if (!(_a.sent())) {
                        exit = true;
                    }
                    return [3 /*break*/, 16];
                case 16:
                    _a.trys.push([16, 17, , 19]);
                    exec = execa_1.default.sync("composer", ["global", "show", "hirak/prestissimo"]);
                    utils_1.logSuccess("├── prestissimo");
                    return [3 /*break*/, 19];
                case 17:
                    e_6 = _a.sent();
                    utils_1.logError("\u251C\u2500\u2500 Missing optional " + chalk_1.default.underline("Prestissimo") + " (Composer package), install it now: " + terminal_link_1.default(LINK_PRESTISSIMO, LINK_PRESTISSIMO));
                    return [4 /*yield*/, installNow(["composer global require hirak/prestissimo"])];
                case 18:
                    _a.sent();
                    return [3 /*break*/, 19];
                case 19:
                    if (exit) {
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkDependencies = checkDependencies;
