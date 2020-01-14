"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var utils_1 = require("../utils");
/**
 * Regenerate launch.json file.
 *
 * @param createCwd
 */
function regenerateLaunchJson(createCwd) {
    utils_1.logProgress("Regenerate " + chalk_1.default.underline("launch.json") + " for debug purposes...");
    execa_1.default.sync("yarn", ["debug:php:generate"], { cwd: createCwd, stdio: "inherit" });
}
exports.regenerateLaunchJson = regenerateLaunchJson;
