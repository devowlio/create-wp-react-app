import execa from "execa";
import { Gitlab } from "gitlab";
import { prompt } from "inquirer";
import { logProgress, logSuccess, logError, isValidUrl, inquirerRequiredValidate } from "../utils";
import terminalLink from "terminal-link";
import chalk from "chalk";
import { CreateWorkspaceOpts } from "./program";

type ProjectResult = {
    id: number;
    name: string;
    name_with_namespace: string;
    path: string;
    path_with_namespace: string;
    ssh_url_to_repo: string;
    web_url: string;
    [key: string]: any;
};

/**
 * Prompt for GitLab auth and create the repository in the given group / namespace.
 * It exits automatically if something went wrong (for example SSH check)
 *
 * @param workspace
 * @returns `false` or `any` representing the new project
 */
async function promptGitLab(workspace: CreateWorkspaceOpts["workspace"]) {
    if (process.env.SKIP_PROMPT) {
        return false;
    }

    const { doGitlab } = await prompt([
        {
            name: "doGitlab",
            type: "confirm",
            message: "Would you like to connect with your GitLab and automatically create and push to a new repository?"
        }
    ]);

    if (doGitlab) {
        const { host, token } = await prompt([
            {
                name: "host",
                type: "input",
                message: "What's your GitLab instance URL?",
                default: process.env.GITLAB_HOST || "https://gitlab.com",
                validate: (value: string) => isValidUrl(value, true)
            },
            {
                name: "token",
                type: "input",
                message: `What's your ${terminalLink(
                    "personal token",
                    "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html"
                )} (click the link to learn how to obtain a token; create with ${chalk.underline("api")} scope)?`,
                default: process.env.GITLAB_TOKEN,
                validate: inquirerRequiredValidate
            }
        ]);

        // Check if SSH was setup correctly
        logProgress("Check if SSH is setup correctly...");
        try {
            execa.sync("ssh", ["-T", "git@" + host.replace(/^https?:\/\//, "")]);
        } catch (e) {
            logError(
                `SSH key is not setup for this host. Please checkout this ${terminalLink(
                    "documentation",
                    "https://docs.gitlab.com/ee/ssh/"
                )}. You can rerun this command without creating a GitLab repository automatically.`
            );
            process.exit(1);
        }

        // The typed api, make it only available when successfully logged in through the personal token
        const api = new Gitlab({
            host,
            token,
            rejectUnauthorized: true
        });
        logProgress("Loading available possible targets for the new repository...");
        const groups = (await api.Groups.all()) as any[];
        const user = (await api.Users.current()) as any;
        let namespaceId: number;

        if (groups && groups.length) {
            const { group } = await prompt([
                {
                    name: "group",
                    message: "Where in GitLab (Group) do you want to create the repository?",
                    type: "list",
                    choices: groups
                        .map((g) => ({
                            name: g.full_name,
                            value: g
                        }))
                        .concat([
                            {
                                name: "Assign to myself, " + user.username,
                                value: ""
                            }
                        ])
                }
            ]);
            namespaceId = group ? group.id : undefined;
        }

        /**
         * Make the creation lazy by a closure function.
         */
        const creator = async () => {
            // Create the repository in the given namespace
            logProgress("Create GitLab project...");
            const project = (await api.Projects.create({
                name: workspace,
                namespace_id: namespaceId // eslint-disable-line @typescript-eslint/camelcase
            })) as ProjectResult;
            logSuccess(`Successfully created project ${chalk.underline(project.name_with_namespace)}`);

            // Create the protected develop branch
            logProgress("Setup repository...");
            await api.Branches.create(project.id, "develop", "master");
            await api.Projects.edit(project.id, {
                default_branch: "develop" // eslint-disable-line @typescript-eslint/camelcase
            });
            logSuccess(`Successfully created default branch ${chalk.underline("develop")}`);
            return project;
        };
        return creator;
    }

    return false;
}

export { ProjectResult, promptGitLab };
