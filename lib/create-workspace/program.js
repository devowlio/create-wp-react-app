"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var _1 = require("./");
var createWorkspaceCommand = commander_1
    .command("create-workspace")
    .description("Creates a new workspace where your plugins are placed.")
    .option(
        "-w, --workspace [value]",
        "What's the name of your workspace (similar to your future git repository name)?",
        ""
    )
    .option("-r, --repository [value]", "The repository URL", "https://github.com/matzeeable/wp-reactjs-starter")
    .option("-g, --checkout [value]", "The checkout ref", "master")
    .option("--port-wp <number>", "Which port should be used for the local WordPress development?", function(i) {
        return +i;
    })
    .option("--port-pma <number>", "Which port should be used for the local phpMyAdmin development?", function(i) {
        return +i;
    })
    .action(function(args) {
        return _1.createWorkspacePrompt(args);
    });
exports.createWorkspaceCommand = createWorkspaceCommand;
