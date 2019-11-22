import chalk from "chalk";
import glob from "glob";
import { logProgress, searchAndReplace } from "../utils";
import { resolve } from "path";
import { renameSync } from "fs";

/**
 * Apply the slug to different files where needed. Also apply the main root slug
 * in the plugin so the utils package for example can be correctly linked and resolved.
 *
 * Additionally change the name of the initial .pot file because it also relies on the slug.
 *
 * @param workspace
 * @param createPluginCwd
 * @param slug
 */
function applySlug(workspace: string, createPluginCwd: string, slug: string) {
    logProgress(`Find various code places and replace the slug with ${chalk.underline(slug)}...`);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });
    const files = [
        ...globFiles("devops/**/*.{yml,sh}"),
        ...globFiles("devops/.gitlab/**/*.yml"),
        ...globFiles("devops/.gitlab/.gitlab-ci.yml"),
        ...globFiles("package.json"),
        ...globFiles("src/**/*.php")
    ];
    searchAndReplace(files, /wp-reactjs-starter/g, slug);

    // Get root name and replace wp-reactjs-multi-starter
    logProgress(`Find various code places and replace the root package name with ${chalk.underline(workspace)}...`);
    const multiStarterFiles = [...globFiles("src/public/ts/**/*.tsx"), ...globFiles("package.json")];
    searchAndReplace(multiStarterFiles, /wp-reactjs-multi-starter/g, workspace);

    // i18n .pot files
    const phpPotFolder = resolve(createPluginCwd, "src/inc/languages");
    const tsPotFolder = resolve(createPluginCwd, "src/public/languages");
    renameSync(resolve(phpPotFolder, "wp-reactjs-starter.pot"), resolve(phpPotFolder, slug + ".pot"));
    renameSync(resolve(tsPotFolder, "wp-reactjs-starter.pot"), resolve(tsPotFolder, slug + ".pot"));
}

export { applySlug };
