import chalk from "chalk";
import { logProgress, logSuccess } from "../utils";
import { CreatePackageOpts } from "./program";
import { writeFileSync } from "fs-extra";
import { resolve } from "path";

/**
 * Create an example MyClass.php file and an example .tsx file.
 *
 * @param createPackageCwd
 * @param packageName
 * @param namespace
 */
function createExampleFiles(
    createPackageCwd: string,
    packageName: CreatePackageOpts["packageName"],
    namespace: CreatePackageOpts["namespace"]
) {
    logProgress(`Create example PHP and TSX file in ${chalk.underline(createPackageCwd)}...`);
    const indexTsx = `import "setimmediate"; // Polyfill for yielding

function sayHello() {
    console.log("Hello from ${packageName}");
}

export { sayHello };
`;

    const myClassPhp = `<?php
namespace ${namespace};

class MyClass {
    public function __construct() {
        // Do something here!
    }
}`;

    writeFileSync(resolve(createPackageCwd, "lib", "index.tsx"), indexTsx);
    writeFileSync(resolve(createPackageCwd, "src", "MyClass.php"), myClassPhp);
    logSuccess("Successfully created example files!");
}

export { createExampleFiles };
