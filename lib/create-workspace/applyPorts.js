"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var utils_1 = require("../utils");
var glob_1 = __importDefault(require("glob"));
/**
 * Apply ports to the local docker-compose environment.
 *
 * @param portWp
 * @param portPma
 * @param createCwd
 */
function applyPorts(portWp, portPma, createCwd) {
    utils_1.logProgress("Apply ports " + chalk_1.default.underline(portWp) + " (WP) and " + chalk_1.default.underline(portPma) + " (PMA) for local development...");
    var composeFiles = glob_1.default.sync("devops/docker-compose/docker-compose.local.yml", {
        cwd: createCwd,
        absolute: true
    });
    var shFiles = glob_1.default.sync("devops/scripts/*.sh", { cwd: createCwd, absolute: true });
    utils_1.searchAndReplace(composeFiles, /"8080:80"/g, "\"" + portWp + ":80\"");
    utils_1.searchAndReplace(composeFiles, /"8079:80"/g, "\"" + portPma + ":80\"");
    utils_1.searchAndReplace(shFiles, /localhost:8080/g, "localhost:" + portWp);
}
exports.applyPorts = applyPorts;
