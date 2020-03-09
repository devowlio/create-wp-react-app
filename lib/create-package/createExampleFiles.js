"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var utils_1 = require("../utils");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
/**
 * Create an example MyClass.php file and an example .tsx file.
 *
 * @param createPackageCwd
 * @param packageName
 * @param namespace
 */
function createExampleFiles(createPackageCwd, packageName, namespace) {
    utils_1.logProgress("Create example PHP and TSX file in " + chalk_1.default.underline(createPackageCwd) + "...");
    var indexTsx = "import \"setimmediate\"; // Polyfill for yielding\n\nfunction sayHello() {\n    console.log(\"Hello from " + packageName + "\");\n}\n\nexport { sayHello };\n";
    var myClassPhp = "<?php\nnamespace " + namespace + ";\n\nclass MyClass {\n    public function __construct() {\n        // Do something here!\n    }\n}";
    fs_extra_1.mkdirSync(path_1.resolve(createPackageCwd, "lib"));
    fs_extra_1.mkdirSync(path_1.resolve(createPackageCwd, "src"));
    fs_extra_1.writeFileSync(path_1.resolve(createPackageCwd, "lib", "index.tsx"), indexTsx);
    fs_extra_1.writeFileSync(path_1.resolve(createPackageCwd, "src", "MyClass.php"), myClassPhp);
    utils_1.logSuccess("Successfully created example files!");
}
exports.createExampleFiles = createExampleFiles;
