"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var _1 = require("./");
var createWorkspaceCommand = commander_1
    .command("create-workspace")
    .description("Creates a new workspace where your plugins are placed.")
    .option(
        "-w, --workspace [value]",
        "The name of your workspace, it is similar to your future git repository name.",
        ""
    )
    .option("-r, --repository [value]", "The repository URL", "https://github.com/matzeeable/wp-reactjs-starter")
    .option("-g, --checkout [value]", "The checkout ref", "master")
    .option("--port-wp <number>", "The port for your local WordPress development environment", function(i) {
        return +i;
    })
    .option("--port-pma <number>", "The port for your local phpMyAdmin development environment", function(i) {
        return +i;
    })
    .action(function(args) {
        return _1.createWorkspacePrompt(args);
    });
exports.createWorkspaceCommand = createWorkspaceCommand;
