"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var utils_1 = require("../utils");
/**
 * Create a predefined .env file.
 *
 * @param createCwd
 * @param input
 */
function createDotEnv(createCwd, input) {
    var dotEnvFile = path_1.resolve(createCwd, ".env");
    var pairs = {};
    if (input.remote) {
        pairs["WP_LOCAL_INSTALL_DIR"] = input.remote;
    }
    if (Object.keys(pairs).length > 0) {
        var content_1 = "";
        Object.keys(pairs).forEach(function (key) { return (content_1 += key + "=" + pairs[key] + "\n"); });
        fs_1.writeFileSync(dotEnvFile, content_1, { encoding: utils_1.DEFAULT_ENCODING });
    }
}
exports.createDotEnv = createDotEnv;
