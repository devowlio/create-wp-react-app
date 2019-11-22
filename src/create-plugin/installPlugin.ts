import { logProgress, logSuccess } from "../utils";
import execa from "execa";

const PROMPT_AFTER_BOOTSTRAP = [
    {
        name: "build",
        type: "confirm",
        message:
            "Would you like to do an initial build process for the new plugin (usually this is done by CI, but sure is sure)?",
        default: "y"
    },
    {
        name: "docs",
        type: "confirm",
        message:
            "Would you like to do an initial generation of the technical docs for the new plugin (PHP, JS, API, Hooks)?",
        default: "y"
    }
];

/**
 * Depending on the answers of PROMPT_AFTER_BOOTSTRAP do some basic builds.
 *
 * @param answers
 */
function preInstallationBuilds(answers: { build: boolean; docs: boolean }, createPluginCwd: string) {
    if (answers.build) {
        logProgress("Start initial build process...");
        execa.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully created first build");
        logProgress("Start i18n generation...");
        execa.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
        execa.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully generate .pot files in your plugin");
    }

    if (answers.docs) {
        logProgress("Generate technical documents...");
        execa.sync("yarn", ["docs"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully created technical documents");
    }
}

export { PROMPT_AFTER_BOOTSTRAP, preInstallationBuilds };
