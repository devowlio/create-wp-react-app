#!/usr/bin/env node

import { parse } from "commander";
import "./create-workspace";
import "./create-plugin";

parse(process.argv);
