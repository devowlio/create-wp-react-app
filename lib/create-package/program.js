"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var prompt_1 = require("./prompt");
var createPackageCommand = commander_1.command("create-package")
    .description("Creates a new package in packages/.")
    .option("--cwd <value>", "The path to the workspace where the package should be created", process.cwd())
    .option("--package-name <value>", "How should your package be named?")
    .option("--package-desc <value>", "Give a one-line package description?")
    .option("--author <value>", "Who is the package author?")
    .option("--package-uri <value>", "What's your package' homepage URL?")
    .option("--namespace <value>", "What's the PHP Namespace (e. g 'MatthiasWeb\\WPRJSS')?")
    .option("--abbreviation <value>", "What's a short abbreviation for this package?")
    .action(function (args) { return prompt_1.createPackagePrompt(args); });
exports.createPackageCommand = createPackageCommand;
