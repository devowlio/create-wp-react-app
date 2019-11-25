import { prompt } from "inquirer";
import { CreateWorkspaceOpts, createWorkspaceCommand, createWorkspaceExecute, checkDependencies } from "./";
import { getCommandDescriptionForPrompt, logError, caseAll } from "../utils";

/**
 * Prompt for CLI arguments which are not passed.
 */
async function createWorkspacePrompt({ workspace, repository, checkout, portWp, portPma }: CreateWorkspaceOpts) {
    checkDependencies();

    const answers = await prompt(
        [
            !workspace && {
                name: "workspace",
                message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--workspace"),
                type: "input",
                validate: (value: string) => {
                    if (/^[A-Za-z0-9-_]+$/.test(value)) {
                        return true;
                    }
                    return "Your workspace name should only contain [A-Za-z0-9-_]";
                }
            },
            !portWp && {
                name: "portWp",
                message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--port-wp"),
                type: "number",
                default: 8080
            },
            !portPma && {
                name: "portPma",
                message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--port-pma"),
                type: "number",
                default: 8079
            }
        ].filter(Boolean)
    );

    try {
        const parsed = { workspace, repository, checkout, portWp, portPma, ...answers };
        await createWorkspaceExecute(caseAll(parsed, [], ["workspace"]));
    } catch (e) {
        logError(e.toString());
    }
}

export { createWorkspacePrompt };
