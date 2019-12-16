import chalk from "chalk";
import glob from "glob";
import { logProgress, searchAndReplace } from "../utils";

/**
 * Find GitLab CI jobs and replace them with the correct prefix (depending on constant prefix).
 *
 * This does not add the include to the root .gitlab-ci.yml!
 *
 * @param createPackageCwd
 * @param constantPrefix
 * @param prefixToReplace
 */
function applyGitLabCi(createPackageCwd: string, constantPrefix: string, prefixToReplace: "wprjss" | "utils") {
    const jobPrefix = constantPrefix.toLowerCase();
    logProgress(`Find GitLab CI jobs and prefix them with ${chalk.underline(jobPrefix)}...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPackageCwd, absolute: true });
    const files = [...globFiles("devops/.gitlab/**/*.yml"), ...globFiles("devops/.gitlab/.gitlab-ci.yml")];
    searchAndReplace(files, new RegExp(prefixToReplace, "g"), jobPrefix);
}

export { applyGitLabCi };
