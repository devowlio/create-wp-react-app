"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var path_1 = require("path");
var rimraf_1 = __importDefault(require("rimraf"));
var utils_1 = require("../utils");
var fs_extra_1 = require("fs-extra");
/**
 * Clone the repository and disconnect it.
 *
 * @param checkout
 * @param repository
 * @param createCwd
 * @param gitlabProject
 */
function createGitFolder(checkout, repository, createCwd, gitlabProject) {
    // Start cloning the repository
    utils_1.logProgress("Download repository " + chalk_1.default.underline(repository) + " ref " + chalk_1.default.underline(checkout) + "...");
    execa_1.default.sync("git", ["clone", repository, path_1.basename(createCwd)], { stdio: "inherit" });
    execa_1.default.sync("git", ["checkout", checkout], { cwd: createCwd, stdio: "inherit" });
    rimraf_1.default.sync(path_1.resolve(createCwd, ".git"));
    // If there is a GitLab project, resolve the SSH checkout and move the .git configuration to the original folder
    if (gitlabProject) {
        var downloadCloneTarget = createCwd + "-temp";
        utils_1.logProgress("Initialize into new repository " + chalk_1.default.underline(gitlabProject.ssh_url_to_repo) + "...");
        execa_1.default.sync("git", ["clone", gitlabProject.ssh_url_to_repo, path_1.basename(downloadCloneTarget)], {
            stdio: "inherit"
        });
        execa_1.default.sync("git", ["checkout", "develop"], { cwd: downloadCloneTarget, stdio: "inherit" });
        fs_extra_1.moveSync(downloadCloneTarget + "/.git", createCwd + "/.git");
        rimraf_1.default.sync(downloadCloneTarget);
    }
    utils_1.logSuccess("Workspace successfully created in " + chalk_1.default.underline(createCwd));
}
exports.createGitFolder = createGitFolder;
