#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
require("./create-workspace/program");
require("./create-plugin/program");
commander_1.parse(process.argv);
