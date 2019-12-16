#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
require("./create-workspace");
require("./create-plugin");
require("./create-package");
var program = commander_1.parse(process.argv);
// If no argument is passed show help
if (process.argv.length < 3) {
    program.help();
}
