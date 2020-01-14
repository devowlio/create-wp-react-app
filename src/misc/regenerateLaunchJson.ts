import chalk from "chalk";
import execa from "execa";
import { logProgress } from "../utils";

/**
 * Regenerate launch.json file.
 *
 * @param createCwd
 */
function regenerateLaunchJson(createCwd: string) {
    logProgress(`Regenerate ${chalk.underline("launch.json")} for debug purposes...`);
    execa.sync("yarn", ["debug:php:generate"], { cwd: createCwd, stdio: "inherit" });
}

export { regenerateLaunchJson };
