#!/usr/bin/env node

import { parse } from "commander";
import "./create-workspace";
import "./create-plugin";
import "./create-package";

const program = parse(process.argv);

// If no argument is passed show help
if (process.argv.length < 3) {
    program.help();
}
