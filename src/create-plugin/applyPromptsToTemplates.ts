import chalk from "chalk";
import { resolve } from "path";
import { CreatePluginOpts } from "./program";
import { logSuccess, DEFAULT_ENCODING } from "../utils";
import { writeFileSync } from "fs";
import { copyTemplates } from "./";

/**
 * Create template files with the given prompt values.
 *
 * @param createPluginCwd
 * @param templates
 * @param input
 * @returns
 */
function applyPromptsToTemplates(
    createPluginCwd: string,
    templates: ReturnType<typeof copyTemplates>,
    input: CreatePluginOpts
) {
    const applyTemplate = (tmpl: string) => {
        let mod = tmpl;
        Object.entries(input).forEach(([key, value]) => {
            if (key === "namespace") {
                value = value.replace(/\\/g, "\\\\");
            }
            mod = mod.replace(new RegExp("\\$\\{" + key + "\\}", "g"), value);
        });
        return mod;
    };
    const indexPhpFile = resolve(createPluginCwd, "src/index.php");
    const readmeTxtFile = resolve(createPluginCwd, "wordpress.org/README.wporg.txt");
    const indexPhpContent = applyTemplate(templates["index.php"]);
    const readmeTxtContent = applyTemplate(templates["readme.wporg.txt"]);
    writeFileSync(indexPhpFile, indexPhpContent, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully created main plugin file ${chalk.underline(indexPhpFile)}`);
    writeFileSync(readmeTxtFile, readmeTxtContent, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully created readme file for wordpress.org ${chalk.underline(readmeTxtFile)}`);
    return {
        indexPhpFile,
        readmeTxtFile,
        indexPhpContent,
        readmeTxtContent
    };
}

export { applyPromptsToTemplates };
