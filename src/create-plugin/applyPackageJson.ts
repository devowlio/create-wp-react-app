import { logProgress, logSuccess, DEFAULT_ENCODING } from "../utils";
import chalk from "chalk";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { CreatePluginOpts } from "./";

function applyPackageJson(createPluginCwd: string, input: CreatePluginOpts) {
    // Update package.json with new utils version and so on.
    logProgress("Update plugins' package.json...");
    const path = resolve(createPluginCwd, "package.json");
    let content = readFileSync(path, { encoding: DEFAULT_ENCODING });

    content = content.replace(/"version":\s*"([0-9.]+)"/g, input.pluginVersion);
    content = content.replace(/"description":\s*"([^"]+)"/g, input.pluginDesc);
    content = content.replace(/"author":\s*"([^"]+)"/g, input.author);
    content = content.replace(/"homepage":\s*"([^"]+)"/g, input.pluginUri);

    writeFileSync(path, content, { encoding: DEFAULT_ENCODING });
    logSuccess(`Successfully updated ${chalk.underline(path)}`);
}

export { applyPackageJson };
