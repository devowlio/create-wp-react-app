import { command } from "commander";
import { createPackagePrompt } from "./prompt";

type CreatePackageOpts = {
    cwd: string;
    packageName: string;
    packageDesc: string;
    author: string;
    packageUri: string;
    namespace: string;
    abbreviation: string;
};

const createPackageCommand = command("create-package")
    .description("Creates a new package in packages/.")
    .option("--cwd <value>", "The path to the workspace where the package should be created", process.cwd())
    .option("--package-name <value>", "How should your package be named?")
    .option("--package-desc <value>", "Give a one-line package description?")
    .option("--author <value>", "Who is the package author?")
    .option("--package-uri <value>", "What's your package' homepage URL?")
    .option("--namespace <value>", "What's the PHP Namespace (e. g 'MatthiasWeb\\WPRJSS')?")
    .option("--abbreviation <value>", "What's a short abbreviation for this package (e. g. 'wprjss')?")
    .action((args) => createPackagePrompt(args));

export { CreatePackageOpts, createPackageCommand };
