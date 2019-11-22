import { logProgress, logSuccess, logError } from "../utils";
import execa, { ExecaSyncReturnValue } from "execa";
import chalk from "chalk";
import terminalLink from "terminal-link";

const LINK_YARN = "https://yarnpkg.com/docs/install/";
const LINK_COMPOSER = "https://getcomposer.org/";
const LINK_WP_CLI = "https://wp-cli.org/";
const LINK_DOCKER = "https://docs.docker.com/install/";
const LINK_DOCKER_COMPOSE = "https://docs.docker.com/compose/install/";

/**
 * Check needed dependencies and exit if something missing.
 */
async function checkDependencies() {
    let exit = false;
    let exec: ExecaSyncReturnValue;
    logProgress("Checking prerequesits...");

    // Yarn
    try {
        exec = execa.sync("yarn", ["--version"]);
        logSuccess("├── Yarn v" + exec.stdout);
    } catch (e) {
        exit = true;
        logError(
            `├── Missing ${chalk.underline(
                "yarn"
            )} (npm alternative which is used in WP ReactJS Starter), install it now: ${terminalLink(
                LINK_YARN,
                LINK_YARN
            )}`
        );
    }

    // Composer
    try {
        exec = execa.sync("composer", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        exit = true;
        logError(
            `├── Missing ${chalk.underline("composer")} (PHP dependency manager), install it now: ${terminalLink(
                LINK_COMPOSER,
                LINK_COMPOSER
            )}`
        );
    }

    // WP CLI
    try {
        exec = execa.sync("wp", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        exit = true;
        logError(
            `├── Missing ${chalk.underline("wp")} (WordPress command line interface), install it now: ${terminalLink(
                LINK_WP_CLI,
                LINK_WP_CLI
            )}`
        );
    }

    // Docker
    try {
        exec = execa.sync("docker", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        exit = true;
        logError(
            `├── Missing ${chalk.underline("docker")} (containerizing applications), install it now: ${terminalLink(
                LINK_DOCKER,
                LINK_DOCKER
            )}`
        );
    }

    // Docker compose
    try {
        exec = execa.sync("docker-compose", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        exit = true;
        logError(
            `├── Missing ${chalk.underline(
                "docker-compose"
            )} (connect multiple containerized applications within a network), install it now: ${terminalLink(
                LINK_DOCKER_COMPOSE,
                LINK_DOCKER_COMPOSE
            )}`
        );
    }

    if (exit) {
        process.exit(1);
    }
}

export { checkDependencies };
