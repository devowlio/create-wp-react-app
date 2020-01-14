import { logProgress, logSuccess, logError } from "../utils";
import execa, { ExecaSyncReturnValue } from "execa";
import chalk from "chalk";
import terminalLink from "terminal-link";
import { prompt } from "inquirer";
import { execSync } from "child_process";

const LINK_YARN = "https://yarnpkg.com/docs/install/";
const LINK_COMPOSER = "https://getcomposer.org/";
const LINK_DOCKER = "https://docs.docker.com/install/";
const LINK_DOCKER_COMPOSE = "https://docs.docker.com/compose/install/";
const LINK_WP_CLI = "https://wp-cli.org/#installing";
const LINK_PRESTISSIMO = "https://packagist.org/packages/hirak/prestissimo";

/**
 * Install a dependency manually.
 *
 * @param command
 */
async function installNow(command: string[]) {
    console.log("The following commands will run in order to install:");
    command.forEach((c) => console.log(` - ${c}`));
    const { install } = await prompt([
        {
            name: "install",
            type: "confirm",
            message: "Would you like to install it now?",
            default: "n"
        }
    ]);
    if (install) {
        try {
            command.forEach((c) => execSync(c, { stdio: "inherit" }));
            return true;
        } catch (e) {
            logError("Could not be installed, please install manually!");
        }
    }
    return false;
}

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
        logError(
            `├── Missing ${chalk.underline(
                "yarn"
            )} (npm alternative which is used in WP ReactJS Starter), install it now: ${terminalLink(
                LINK_YARN,
                LINK_YARN
            )}`
        );

        if (!(await installNow(["curl -o- -L https://yarnpkg.com/install.sh | bash"]))) {
            exit = true;
        }
    }

    // Composer
    try {
        exec = execa.sync("composer", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        logError(
            `├── Missing ${chalk.underline("composer")} (PHP dependency manager), install it now: ${terminalLink(
                LINK_COMPOSER,
                LINK_COMPOSER
            )}`
        );

        if (
            !(await installNow([
                `php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"`,
                `php -r "if (hash_file('sha384', 'composer-setup.php') === 'c5b9b6d368201a9db6f74e2611495f369991b72d9c8cbd3ffbc63edff210eb73d46ffbfce88669ad33695ef77dc76976') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"`,
                `php composer-setup.php`,
                `php -r "unlink('composer-setup.php');"`,
                `sudo mv composer.phar /usr/local/bin/composer`
            ]))
        ) {
            exit = true;
        }
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

        if (!(await installNow(["curl -o- -L https://get.docker.com | ssh"]))) {
            exit = true;
        }
    }

    // Docker compose
    try {
        exec = execa.sync("docker-compose", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        logError(
            `├── Missing ${chalk.underline(
                "docker-compose"
            )} (connect multiple containerized applications within a network), install it now: ${terminalLink(
                LINK_DOCKER_COMPOSE,
                LINK_DOCKER_COMPOSE
            )}`
        );

        if (!(await installNow(["sudo pip install docker-compose"]))) {
            exit = true;
        }
    }

    // WP CLI
    try {
        exec = execa.sync("wp", ["--version"]);
        logSuccess("├── " + exec.stdout);
    } catch (e) {
        logError(
            `├── Missing ${chalk.underline("wp-cli")} (WordPress CLI), install it now: ${terminalLink(
                LINK_WP_CLI,
                LINK_WP_CLI
            )}`
        );

        if (
            !(await installNow([
                `curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar`,
                `php wp-cli.phar --info`,
                `chmod +x wp-cli.phar`,
                `sudo mv wp-cli.phar /usr/local/bin/wp`,
                `wp --info`
            ]))
        ) {
            exit = true;
        }
    }

    // Prestissimo
    try {
        exec = execa.sync("composer", ["global", "show", "hirak/prestissimo"]);
        logSuccess("├── prestissimo");
    } catch (e) {
        logError(
            `├── Missing optional ${chalk.underline("Prestissimo")} (Composer package), install it now: ${terminalLink(
                LINK_PRESTISSIMO,
                LINK_PRESTISSIMO
            )}`
        );

        await installNow([`composer global require hirak/prestissimo`]);
    }

    if (exit) {
        process.exit(1);
    }
}

export { checkDependencies };
