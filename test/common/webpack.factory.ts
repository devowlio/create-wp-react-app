/**
 * Common rules / configuration for WordPress webpack builder.
 */

import { resolve, join } from "path";
import fs from "fs";
import { Configuration, DefinePlugin, Compiler } from "webpack";
import { spawn, execSync } from "child_process";
import WebpackBar from "webpackbar";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const NODE_ENV = (process.env.NODE_ENV as Configuration["mode"]) || "development";
const PWD = process.env.PWD; // PWD = our plugin folder
const plugins = getPlugins();

/**
 * The result of yarn lerna list as JSON.
 */
type LernaListItem = {
    name: string;
    version: string;
    private: boolean;
    location: string;
};

/**
 * Create default settings for the current working directory.
 * If you want to do some customizations you can pass an override function
 * which passes the complete default settings and you can mutate it.
 *
 * @param override
 */
function createDefaultSettings(override?: (settings: Configuration) => void) {
    const dist = join(PWD, "src/public", NODE_ENV === "production" ? "dist" : "dev");
    const slug = process.env.npm_package_slug;

    const settings: Configuration = {
        context: PWD,
        mode: NODE_ENV,
        output: {
            path: dist,
            filename: "[name].js",
            library: slugCamelCase(slug) + "_[name]"
        },
        entry: {
            // Dynamically get the entries from first-level files
            ...plugins.reduce((map: { [key: string]: string }, obj) => {
                map[obj.entrypointName] = obj.modulePath;
                return map;
            }, {})
        },
        externals: {
            react: "React",
            "react-dom": "ReactDOM",
            jquery: "jQuery",
            mobx: "mobx",
            wp: "wp",
            _: "_",
            lodash: "lodash",
            wpApiSettings: "wpApiSettings",
            "@wordpress/i18n": "wp['i18n']",
            // @wordpress/i18n relies on moment, but it also includes moment-timezone which also comes with WP core
            moment: "moment",
            "moment-timezone": "moment",
            // Get dynamically a map of externals for add-on development
            ...plugins.reduce((map: { [key: string]: string }, obj) => {
                map[obj.externalId] = obj.moduleId;
                return map;
            }, {})
        },
        devtool: "#source-map",
        module: {
            rules: [
                {
                    test: /\.tsx$/,
                    exclude: /(disposables)/,
                    use: {
                        loader: "babel-loader?cacheDirectory",
                        options: require(resolve(PWD, "package.json")).babel
                    }
                },
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
                }
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            modules: ["node_modules", "src/public/ts"]
        },
        plugins: [
            new WebpackBar({
                name: slug
            }),
            new ForkTsCheckerWebpackPlugin(),
            new DefinePlugin({
                // NODE_ENV is used inside React to enable/disable features that should only be used in development
                "process.env": {
                    NODE_ENV: JSON.stringify(NODE_ENV),
                    env: JSON.stringify(NODE_ENV),
                    slug: JSON.stringify(slug)
                }
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new WebpackPluginDone()
        ]
    };

    if (override) {
        override(settings);
    }
    return settings;
}

/**
 * An internal plugin which runs build:webpack:done script.
 */
class WebpackPluginDone {
    public apply(compiler: Compiler) {
        compiler.plugin("done", function() {
            spawn("yarn --silent build:webpack:done", {
                stdio: "inherit",
                shell: true
            }).on("error", (err) => console.log(err));
        });
    }
}

/**
 * Convert a slug like "my-plugin" to "myPlugin". This can
 * be useful for library naming (window[""] is bad because the hyphens).
 *
 * @param slug
 * @returns
 */
function slugCamelCase(slug: string) {
    return slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Generate externals because for add-on development we never bundle the dependent to the add-on!
 *
 * @returns {object}
 */
function getPlugins() {
    const lernaList: LernaListItem[] = JSON.parse(
        execSync("yarn --silent lerna list --loglevel silent --json --all").toString()
    );

    // Filter only plugins, not packages
    const pluginList = lernaList.filter(({ location }) => location.startsWith(resolve(PWD, "../..", "plugins")));

    // We determine the externals due the entry points
    const tsFolder = "src/public/ts";
    const plugins: Array<LernaListItem & {
        modulePath: string;
        moduleId: string;
        externalId: string;
        entrypointName: string;
    }> = [];

    pluginList.forEach((item) =>
        fs
            .readdirSync(join(item.location, tsFolder), { withFileTypes: true })
            .filter((f) => !f.isDirectory())
            // Now we have all entry points available
            .forEach((f) => {
                const entrypointName = f.name.split(".", 1)[0];
                const modulePath = resolve(item.location, tsFolder, f.name);
                const moduleId = item.name + "/" + tsFolder + "/" + entrypointName;
                const externalId =
                    slugCamelCase(require(resolve(item.location, "package.json")).slug) + "_" + entrypointName; // see output.library

                plugins.push({ ...item, modulePath, moduleId, externalId, entrypointName });
            })
    );
    return plugins;
}

export { createDefaultSettings, slugCamelCase, getPlugins };
