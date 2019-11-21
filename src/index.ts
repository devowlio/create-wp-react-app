#!/usr/bin/env node

import { parse } from "commander";
import "./create-workspace/program";
import "./create-plugin/program";

parse(process.argv);
