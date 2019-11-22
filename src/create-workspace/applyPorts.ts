import chalk from "chalk";
import { CreateWorkspaceOpts } from "./";
import { logProgress, searchAndReplace } from "../utils";
import glob from "glob";

/**
 * Apply ports to the local docker-compose environment.
 *
 * @param portWp
 * @param portPma
 * @param createCwd
 */
function applyPorts(portWp: CreateWorkspaceOpts["portWp"], portPma: CreateWorkspaceOpts["portPma"], createCwd: string) {
    logProgress(
        `Apply ports ${chalk.underline(portWp)} (WP) and ${chalk.underline(portPma)} (PMA) for local development...`
    );
    const portFiles = glob.sync("devops/docker-compose/docker-compose.local.yml", { cwd: createCwd, absolute: true });
    searchAndReplace(portFiles, /"8080:80"/g, `"${portWp}:80"`);
    searchAndReplace(portFiles, /"8079:80"/g, `"${portPma}:80"`);
}

export { applyPorts };
