import chalk from "chalk";
import { logProgress, DEFAULT_ENCODING, logSuccess } from "../utils";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

/**
 * Modify the anchor content of the root .gitlab-ci.yml file to add or
 * remove a plugin's CI configuration.
 *
 * @param action
 * @param cwd
 * @param slug
 */
function modifyRootGitLabCiInclude(action: "add" | "remove", cwd: string, slug: string) {
    logProgress(`Modify root .gitlab-ci.yml and ${action} include ${chalk.underline(slug)}...`);
    const path = resolve(cwd, ".gitlab-ci.yml");
    let content = readFileSync(path, { encoding: DEFAULT_ENCODING });
    content = content.replace(
        /# create-wp-react-app -->\n(.*)\n(\s*)# <-- create-wp-react-app/gms,
        (match, inner: string, spaceBefore: string) => {
            let newLines = inner.split("\n").filter(Boolean);
            if (action === "remove") {
                newLines = newLines.filter((line) => line.indexOf("- /plugins/" + slug + "/") === -1);
            } else {
                newLines.push(spaceBefore + "- /plugins/" + slug + "/devops/.gitlab/.gitlab-ci.yml");
            }
            return `# create-wp-react-app -->\n${newLines.join("\n")}\n${spaceBefore}# <-- create-wp-react-app`;
        }
    );
    writeFileSync(path, content, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully updated ${path}`);
}

export { modifyRootGitLabCiInclude };
