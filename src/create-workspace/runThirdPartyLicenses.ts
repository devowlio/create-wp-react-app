import execa from "execa";
import { logProgress, logSuccess } from "../utils";

/**
 * Generate all disclaimer files for the current workspace.
 *
 * @param createCwd
 */
function runThirdPartyLicenses(createCwd: string) {
    logProgress("Start generating 3rd party disclaimer...");
    execa.sync("yarn", ["--silent", "workspace:concurrently"], {
        cwd: createCwd,
        env: {
            WORKSPACE_COMMAND: "yarn --silent grunt composer:disclaimer --force 2>/dev/null"
        }
    });
    execa.sync("yarn", ["--silent", "workspace:concurrently"], {
        cwd: createCwd,
        env: {
            WORKSPACE_COMMAND: "yarn --silent grunt yarn:disclaimer --force 2>/dev/null"
        }
    });
    logSuccess("Successfully generated ");
}

export { runThirdPartyLicenses };
