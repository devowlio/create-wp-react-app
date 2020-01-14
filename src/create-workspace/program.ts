import { command } from "commander";
import { createWorkspacePrompt } from "./";

type CreateWorkspaceOpts = {
    workspace: string;
    repository: string;
    checkout: string;
    remote: string;
    portWp: number;
    portPma: number;
};

const createWorkspaceCommand = command("create-workspace")
    .description("Creates a new workspace where your plugins are placed.")
    .option(
        "-w, --workspace [value]",
        "What's the name of your workspace (similar to your future git repository name)?",
        ""
    )
    .option("-r, --repository [value]", "The repository URL", "https://github.com/matzeeable/wp-reactjs-starter")
    .option("-g, --checkout [value]", "The checkout ref", "master")
    .option("--remote <number>", "Which URL should be used for WordPress development? Leave empty for `localhost`")
    .option("--port-wp <number>", "Which port should be used for the local WordPress development?", (i) => +i)
    .option("--port-pma <number>", "Which port should be used for the local phpMyAdmin development?", (i) => +i)
    .action((args) => createWorkspacePrompt(args));

export { CreateWorkspaceOpts, createWorkspaceCommand };
