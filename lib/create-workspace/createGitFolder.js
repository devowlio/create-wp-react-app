"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var path_1 = require("path");
var rimraf_1 = __importDefault(require("rimraf"));
var utils_1 = require("../utils");
/**
 * Clone the repository and disconnect it.
 *
 * @param checkout
 * @param repository
 * @param workspace
 * @param createCwd
 */
function createGitFolder(checkout, repository, workspace, createCwd) {
    // Start cloning the repository
    utils_1.logProgress("Clone and checkout repository at " + chalk_1.default.underline(checkout) + "...");
    execa_1.default.sync("git", ["clone", repository, workspace], { stdio: "inherit" });
    execa_1.default.sync("git", ["checkout", checkout], { cwd: createCwd, stdio: "inherit" });
    // Disconnect git respository
    utils_1.logProgress("Disconnect git repository...");
    rimraf_1.default.sync(path_1.resolve(createCwd, ".git"));
    utils_1.logSuccess("Workspace successfully created in " + chalk_1.default.underline(createCwd));
}
exports.createGitFolder = createGitFolder;
