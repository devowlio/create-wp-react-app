import { logProgress, logSuccess } from "../utils";
import execa from "execa";

/**
 * Do some basic builds for a plugin or package.
 *
 * @param answers
 */
function preInstallationBuilds(createPluginCwd: string) {
    logProgress("Start initial build process...");
    execa.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
    logSuccess("Successfully created first build");

    logProgress("Run tests...");
    execa.sync("yarn", ["test"], { cwd: createPluginCwd, stdio: "inherit" });
    logSuccess("Successfully run tests");

    logProgress("Start i18n generation...");
    execa.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
    execa.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
    logSuccess("Successfully generate .pot files in your plugin");
}

export { preInstallationBuilds };
