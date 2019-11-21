import chalk from "chalk";
import { resolve } from "path";
import { CreatePluginOpts } from "./program";
import glob from "glob";
import { logProgress, FOLDER_CWRA, logSuccess, searchAndReplace } from "../utils";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { copySync } from "fs-extra";

const encoding = "UTF-8";

createPluginExecute(
    {},
    {
        cwd: "/d/Programme/VSCode Workspace/create-wp-react-app/test",
        pluginName: "Real Media Library",
        slug: "real-media-library",
        pluginUri: "https://github.com/matzeeable/real-media-library",
        pluginDesc: "This is RML!",
        author: "Matthias Günter",
        authorUri: "https://matthias-web.com",
        pluginVersion: "1.0.0",
        minPhp: "7.2",
        minWp: "5.2",
        namespace: "MatthiasWeb\\RML",
        optPrefix: "rml",
        dbPrefix: "rml",
        constantPrefix: "RML"
    }
);

/**
 * Generate a new plugin from the template. All validations are done in createPluginPrompt.
 *
 * @throws
 */
async function createPluginExecute(root: any, input: CreatePluginOpts) {
    const createPluginCwd = resolve(input.cwd, "plugins", input.slug);
    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });

    // Strictly do not override an existing plugin!!
    if (existsSync(createPluginCwd)) {
        // TODO: throw new Error(`You already have a plugin with slug ${input.slug}.`);
    }

    const templates = copyTemplates(createPluginCwd);
    const appliedTemplates = applyPromptsToTemplates(createPluginCwd, templates, input);
    applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, input.constantPrefix, input.namespace);
    applyPhpFunctions(createPluginCwd, input.constantPrefix);
    applySlug(createPluginCwd, input.slug);
    applyGitLabCi(createPluginCwd, input.constantPrefix);
}

/**
 * Copy templates to the given path and read template files.
 *
 * @param createPluginCwd
 * @returns
 */
function copyTemplates(createPluginCwd: string) {
    logProgress("Create new plugin from template...");
    const templateCwd = resolve(createPluginCwd, "../..", FOLDER_CWRA, "template");
    // TODO: copySync(templateCwd, createPluginCwd);
    const templates = {
        "index.php": readFileSync(resolve(templateCwd, "../grunt-index-php.tmpl"), { encoding: "UTF-8" }),
        "readme.wporg.txt": readFileSync(resolve(templateCwd, "../grunt-readme-txt.tmpl"), { encoding: "UTF-8" })
    };
    logSuccess(`Successfully created plugin folder ${chalk.underline(createPluginCwd)}`);

    return templates;
}

/**
 * Create template files with the given prompt values.
 *
 * @param createPluginCwd
 * @param templates
 * @param input
 * @returns
 */
function applyPromptsToTemplates(
    createPluginCwd: string,
    templates: ReturnType<typeof copyTemplates>,
    input: CreatePluginOpts
) {
    const applyTemplate = (tmpl: string) => {
        let mod = tmpl;
        Object.entries(input).forEach(([key, value]) => {
            if (key === "namespace") {
                value = value.replace(/\\/g, "\\\\");
            }
            mod = mod.replace(new RegExp("\\$\\{" + key + "\\}", "g"), value);
        });
        return mod;
    };

    const indexPhpFile = resolve(createPluginCwd, "src/index.php");
    const readmeTxtFile = resolve(createPluginCwd, "wordpress.org/README.wporg.txt");
    const indexPhpContent = applyTemplate(templates["index.php"]);
    const readmeTxtContent = applyTemplate(templates["readme.wporg.txt"]);
    writeFileSync(indexPhpFile, indexPhpContent, { encoding });
    logSuccess(`Successfully created main plugin file ${chalk.underline(indexPhpFile)}`);
    writeFileSync(readmeTxtFile, readmeTxtContent, { encoding });
    logSuccess(`Successfully created readme file for wordpress.org ${chalk.underline(readmeTxtFile)}`);

    return {
        indexPhpFile,
        readmeTxtFile,
        indexPhpContent,
        readmeTxtContent
    };
}

/**
 * Apply PHP constants to the available *.php files. Also adjust
 * the PHP autoloading namespace.
 *
 * @param createPluginCwd
 * @param appliedTemplates
 * @param constantPrefix
 */
function applyPhpConstantsAndNamespace(
    createPluginCwd: string,
    appliedTemplates: ReturnType<typeof applyPromptsToTemplates>,
    constantPrefix: CreatePluginOpts["constantPrefix"],
    namespace: CreatePluginOpts["namespace"]
) {
    logProgress("Get and apply all your PHP constants to the *.php files...");

    // Find constants
    let m;
    const regex = /define\(\'([^\']+)/g;
    const constantList: string[] = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((m = regex.exec(appliedTemplates.indexPhpContent)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                constantList.push(match);
            }
        });
    }

    // Search & Replace constants
    const phpFiles = glob.sync("**/*.php", { cwd: resolve(createPluginCwd, "src"), absolute: true });
    constantList.forEach((constant) =>
        searchAndReplace(phpFiles, new RegExp("WPRJSS" + constant.slice(constantPrefix.length), "g"), constant)
    );
    logSuccess(
        `Successfully applied the following constants which you can use now - read more about them in WP ReactJS Starter documentation:\n - ${constantList.join(
            "\n - "
        )}`
    );

    // Apply the namespace
    logProgress(`Apply namespace ${chalk.underline(namespace)} to all PHP files for autoloading...`);
    searchAndReplace(phpFiles, /MatthiasWeb\\WPRJSS/g, namespace);
}

/**
 * Find PHP functions starting with wprjss_skip and replace them with the
 * correct prefix (depending on constant prefix).
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyPhpFunctions(createPluginCwd: string, constantPrefix: string) {
    const functionPrefix = constantPrefix.toLowerCase();
    logProgress(`Find PHP functions and replace with ${chalk.underline(functionPrefix)} prefix...`);

    const phpFiles = glob.sync("**/*.php", { cwd: resolve(createPluginCwd, "src"), absolute: true });
    searchAndReplace(phpFiles, /wprjss_skip/g, functionPrefix + "_skip");
}

/**
 * Apply the slug to different files where needed.
 *
 * @param createPluginCwd
 * @param slug
 */
function applySlug(createPluginCwd: string, slug: string) {
    logProgress(`Find various code places and replace the slug with ${chalk.underline(slug)}...`);

    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });
    const files = [
        ...globFiles("devops/**/*.{yml,sh}"),
        ...globFiles("devops/.gitlab/**/*.yml"),
        ...globFiles("devops/.gitlab/.gitlab-ci.yml"),
        ...globFiles("package.json"),
        ...globFiles("src/**/*.php")
    ];
    searchAndReplace(files, /wp-reactjs-starter/g, slug);
}

/**
 * Find GitLab CI jobs and replace them with the correct prefix (depending on constant prefix).
 * Also add the include to the root .gitlab-ci.yml
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyGitLabCi(createPluginCwd: string, constantPrefix: string) {
    const jobPrefix = constantPrefix.toLowerCase();
    logProgress(`Find GitLab CI jobs and prefix them with ${chalk.underline(jobPrefix)}...`);

    const globFiles = (pattern: string) => glob.sync(pattern, { cwd: createPluginCwd, absolute: true });
    const files = [...globFiles("devops/.gitlab/**/*.yml"), ...globFiles("devops/.gitlab/.gitlab-ci.yml")];
    searchAndReplace(files, /wprjss/g, jobPrefix);
}

export { createPluginExecute };
