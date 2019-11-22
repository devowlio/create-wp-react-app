"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var utils_1 = require("../utils");
var fs_1 = require("fs");
var create_plugin_1 = require("../create-plugin");
/**
 * Remove first initial plugin and move to create-wp-react-app for others commands.
 * Also alter the .gitlab-ci.yml includes and CHANGELOG.md.
 *
 * @param createCwd
 */
function removeExamplePlugin(createCwd) {
    utils_1.logProgress(
        "Prepare monorepo for " + chalk_1.default.underline("create-wp-react-app create-plugin") + " command..."
    );
    fs_1.writeFileSync(path_1.resolve(createCwd, "plugins/wp-reactjs-starter/CHANGELOG.md"), "", {
        encoding: utils_1.DEFAULT_ENCODING
    });
    fs_1.renameSync(
        path_1.resolve(createCwd, "plugins/wp-reactjs-starter"),
        path_1.resolve(createCwd, utils_1.FOLDER_CWRA, "template")
    );
    create_plugin_1.modifyRootGitLabCiInclude("remove", createCwd, "wp-reactjs-starter");
}
exports.removeExamplePlugin = removeExamplePlugin;
