import { command } from "commander";
import { createPluginPrompt } from "./";

type CreatePluginOpts = {
    cwd: string;
    pluginName: string;
    slug: string;
    pluginUri: string;
    pluginDesc: string;
    author: string;
    authorUri: string;
    pluginVersion: string;
    minPhp: string;
    minWp: string;
    namespace: string;
    optPrefix: string;
    dbPrefix: string;
    constantPrefix: string;
};

const createPluginCommand = command("create-plugin")
    .description("Create a new plugin within your workspace which you created previously.")
    .option("--cwd <value>", "The path to the workspace where the plugin should be created", process.cwd())
    .option("--plugin-name <value>", "How should your plugin be named?")
    .option("--slug <value>", "What's the plugin slug (similar to folder name inside wp-content/plugins)?")
    .option("--plugin-uri <value>", "What's your plugins' homepage URL?")
    .option("--plugin-desc <value>", "Give a one-line plugin description?")
    .option("--author <value>", "Who is the plugin author (e. g. your wordpress.org username)?")
    .option("--author-uri <value>", "What's your author homepage URL?")
    .option("--plugin-version <value>", "What should be the initial version of the plugin?")
    .option(
        "--min-php <value>",
        "What's the minimum required PHP version (minimum of 7.0 required for the boilerplate)?"
    )
    .option(
        "--min-wp <value>",
        "What's the minimum required WordPress version (minimum of 5.2 required for the boilerplate)?"
    )
    .option("--namespace <value>", "What's the PHP Namespace (e. g. 'MatthiasWeb\\WPRJSS')?")
    .option("--opt-prefix <value>", "What's the WordPress options (wp_options) names prefix?")
    .option("--db-prefix <value>", "What's the WordPress database tables prefix?")
    .option("--constant-prefix <value>", "What's the PHP constants prefix?")
    .action((args) => createPluginPrompt(args));

export { CreatePluginOpts, createPluginCommand };
