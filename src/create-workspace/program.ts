import { command } from "commander";
import { createWorkspacePrompt } from "./prompt";

type CreateWorkspaceOpts = {
    workspace: string;
    repository: string;
    checkout: string;
    portWp: number;
    portPma: number;
};

const createWorkspaceCommand = command("create-workspace")
    .description("Creates a new workspace where your plugins are placed.")
    .option(
        "-w, --workspace [value]",
        "The name of your workspace, it is similar to your future git repository name.",
        ""
    )
    .option("-r, --repository [value]", "The repository URL", "https://github.com/matzeeable/wp-reactjs-starter")
    .option("-g, --checkout [value]", "The checkout ref", "master")
    .option("--port-wp <number>", "The port for your local WordPress development environment", (i) => +i)
    .option("--port-pma <number>", "The port for your local phpMyAdmin development environment", (i) => +i)
    .action((args) => createWorkspacePrompt(args));

export { CreateWorkspaceOpts, createWorkspaceCommand };
