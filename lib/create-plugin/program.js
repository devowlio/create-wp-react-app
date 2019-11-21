"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var prompt_1 = require("./prompt");
var createPluginCommand = commander_1
    .command("create-plugin")
    .description("Create a new plugin within your workspace which you created previously.")
    .option("--cwd <value>", "The path to the workspace where the plugin should be created", process.cwd())
    .option("--plugin-name <value>", "Plugin name")
    .option("--slug <value>", "Unique plugin slug (it represents the folder name inside wp-content/plugins)")
    .option("--plugin-uri <value>", "Plugin URI")
    .option("--plugin-desc <value>", "Plugin description")
    .option("--author <value>", "Author")
    .option("--author-uri <value>", "Author URI")
    .option("--plugin-version <value>", "Initial version")
    .option("--min-php <value>", "Minimum PHP version (minimum of 5.6 required for the boilerplate)")
    .option("--min-wp <value>", "Minimum WordPress version (minimum of 5.2 required for the boilerplate)")
    .option("--namespace <value>", "Unique PHP Namespace, for example 'MatthiasWeb\\WPRJSS'")
    .option("--opt-prefix <value>", "Unique WordPress option names prefix, for example 'wprjss'")
    .option("--db-prefix <value>", "Unique WordPress database tables prefix, for example 'wprjss'")
    .option("--constant-prefix <value>", "Unique PHP constants prefix for all the above options, for example 'WPRJSS'")
    .action(function(args) {
        return prompt_1.createPluginPrompt(args);
    });
exports.createPluginCommand = createPluginCommand;
