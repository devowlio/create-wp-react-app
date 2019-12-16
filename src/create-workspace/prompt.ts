import { prompt } from "inquirer";
import { CreateWorkspaceOpts, createWorkspaceCommand, createWorkspaceExecute, checkDependencies } from "./";
import {
    getCommandDescriptionForPrompt,
    logError,
    caseAll,
    inquirerRequiredValidate,
    getInternalExampleArgs
} from "../utils";

/**
 * Prompt for CLI arguments which are not passed.
 */
async function createWorkspacePrompt({ workspace, repository, checkout, portWp, portPma }: CreateWorkspaceOpts) {
    checkDependencies();

    const mockData = getInternalExampleArgs("workspace");

    const answers =
        (mockData as any) ||
        (await prompt(
            [
                !workspace && {
                    name: "workspace",
                    message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--workspace"),
                    type: "input",
                    validate: (value: string) => {
                        if (value && /^[A-Za-z0-9-_]+$/.test(value)) {
                            return true;
                        }
                        return "Your workspace name should only contain [A-Za-z0-9-_]";
                    }
                },
                !portWp && {
                    name: "portWp",
                    message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--port-wp"),
                    type: "number",
                    default: 8080,
                    validate: inquirerRequiredValidate
                },
                !portPma && {
                    name: "portPma",
                    message: getCommandDescriptionForPrompt(createWorkspaceCommand, "--port-pma"),
                    type: "number",
                    default: (answers: any) => {
                        const useThis = (answers.portWp || +portWp) as number;
                        return useThis > 0 ? useThis + 1 : 8079;
                    },
                    validate: (value: number, answers: any) => {
                        if (value === (answers.portWp || +portWp)) {
                            return "You can not use the port twice.";
                        }
                        return true;
                    }
                }
            ].filter(Boolean)
        ));

    try {
        const parsed = { workspace, repository, checkout, portWp, portPma, ...answers };
        await createWorkspaceExecute(caseAll(parsed, [], ["workspace"]));
    } catch (e) {
        logError(e.toString());
    }
}

export { createWorkspacePrompt };
