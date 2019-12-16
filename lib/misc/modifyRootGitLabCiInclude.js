"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var utils_1 = require("../utils");
var path_1 = require("path");
var fs_1 = require("fs");
/**
 * Modify the anchor content of the root .gitlab-ci.yml file to add or
 * remove a plugin's or package CI configuration.
 *
 * @param action
 * @param cwd
 * @param slug
 */
function modifyRootGitLabCiInclude(action, cwd, slug, type) {
    utils_1.logProgress("Modify root .gitlab-ci.yml and " + action + " include " + chalk_1.default.underline(slug) + "...");
    var path = path_1.resolve(cwd, ".gitlab-ci.yml");
    var content = fs_1.readFileSync(path, { encoding: utils_1.DEFAULT_ENCODING });
    content = content.replace(/# create-wp-react-app -->\n(.*)\n(\s*)# <-- create-wp-react-app/gms, function (match, inner, spaceBefore) {
        var newLines = inner.split("\n").filter(Boolean);
        if (action === "remove") {
            newLines = newLines.filter(function (line) { return line.indexOf("- /" + type + "/" + slug + "/") === -1; });
        }
        else {
            newLines.push(spaceBefore + "- /" + type + "/" + slug + "/devops/.gitlab/.gitlab-ci.yml");
        }
        return "# create-wp-react-app -->\n" + newLines.join("\n") + "\n" + spaceBefore + "# <-- create-wp-react-app";
    });
    fs_1.writeFileSync(path, content, { encoding: utils_1.DEFAULT_ENCODING });
    utils_1.logSuccess("Successfully updated " + path);
}
exports.modifyRootGitLabCiInclude = modifyRootGitLabCiInclude;
