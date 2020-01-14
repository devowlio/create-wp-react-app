import { writeFileSync } from "fs";
import { resolve } from "path";
import { CreateWorkspaceOpts } from ".";
import { DEFAULT_ENCODING } from "../utils";

/**
 * Create a predefined .env file.
 *
 * @param createCwd
 * @param input
 */
function createDotEnv(createCwd: string, input: CreateWorkspaceOpts) {
    const dotEnvFile = resolve(createCwd, ".env");
    const pairs = {} as { [key: string]: string };

    if (input.remote) {
        pairs["WP_LOCAL_INSTALL_DIR"] = input.remote;
    }

    if (Object.keys(pairs).length > 0) {
        let content = "";
        Object.keys(pairs).forEach((key) => (content += `${key}=${pairs[key]}\n`));

        writeFileSync(dotEnvFile, content, { encoding: DEFAULT_ENCODING });
    }
}

export { createDotEnv };
