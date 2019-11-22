import { logProgress, logSuccess } from "../utils";

import execa = require("execa");

const PROMPT_AFTER_BOOTSTRAP = [
    {
        name: "i18n",
        type: "confirm",
        message: "Would you like to do an initial i18n generation for the new plugin (.pot files)?",
        default: "y"
    },
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
function preInstallationBuilds(answers: { i18n: boolean; build: boolean; docs: boolean }, createPluginCwd: string) {
    if (answers.i18n) {
        logProgress("Start i18n generation...");
        execa.sync("yarn", ["i18n:generate:backend"], { cwd: createPluginCwd, stdio: "inherit" });
        execa.sync("yarn", ["i18n:generate:frontend"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully generate .pot files in your plugin");
    }

    if (answers.build) {
        logProgress("Start initial build process...");
        execa.sync("yarn", ["build"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully created first build");
    }

    if (answers.docs) {
        logProgress("Generate technical documents...");
        execa.sync("yarn", ["docs"], { cwd: createPluginCwd, stdio: "inherit" });
        logSuccess("Successfully created technical documents");
    }
}

export { PROMPT_AFTER_BOOTSTRAP, preInstallationBuilds };
