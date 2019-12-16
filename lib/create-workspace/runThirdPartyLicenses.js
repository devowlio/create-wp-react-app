"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var utils_1 = require("../utils");
/**
 * Generate all disclaimer files for the current workspace.
 *
 * @param createCwd
 */
function runThirdPartyLicenses(createCwd) {
    utils_1.logProgress("Start generating 3rd party disclaimer...");
    execa_1.default.sync("yarn", ["--silent", "workspace:concurrently"], {
        cwd: createCwd,
        env: {
            WORKSPACE_COMMAND: "yarn --silent grunt composer:disclaimer --force 2>/dev/null"
        }
    });
    execa_1.default.sync("yarn", ["--silent", "workspace:concurrently"], {
        cwd: createCwd,
        env: {
            WORKSPACE_COMMAND: "yarn --silent grunt yarn:disclaimer --force 2>/dev/null"
        }
    });
    utils_1.logSuccess("Successfully generated ");
}
exports.runThirdPartyLicenses = runThirdPartyLicenses;
