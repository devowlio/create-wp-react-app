"use strict";
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
    var exit = false;
    var exec;
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
}
exports.checkDependencies = checkDependencies;
