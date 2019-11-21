"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function(resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator =
    (this && this.__generator) ||
    function(thisArg, body) {
        var _ = {
                label: 0,
                sent: function() {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
                (g[Symbol.iterator] = function() {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function(v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y["return"]
                                    : op[0]
                                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
var __spreadArrays =
    (this && this.__spreadArrays) ||
    function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
        return r;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function(mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
var glob_1 = __importDefault(require("glob"));
var utils_1 = require("../utils");
var fs_1 = require("fs");
var encoding = "UTF-8";
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
function createPluginExecute(root, input) {
    return __awaiter(this, void 0, void 0, function() {
        var createPluginCwd, globFiles, templates, appliedTemplates;
        return __generator(this, function(_a) {
            createPluginCwd = path_1.resolve(input.cwd, "plugins", input.slug);
            globFiles = function(pattern) {
                return glob_1.default.sync(pattern, { cwd: createPluginCwd, absolute: true });
            };
            // Strictly do not override an existing plugin!!
            if (fs_1.existsSync(createPluginCwd)) {
                // TODO: throw new Error(`You already have a plugin with slug ${input.slug}.`);
            }
            templates = copyTemplates(createPluginCwd);
            appliedTemplates = applyPromptsToTemplates(createPluginCwd, templates, input);
            applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, input.constantPrefix, input.namespace);
            applyPhpFunctions(createPluginCwd, input.constantPrefix);
            applySlug(createPluginCwd, input.slug);
            applyGitLabCi(createPluginCwd, input.constantPrefix);
            return [2 /*return*/];
        });
    });
}
exports.createPluginExecute = createPluginExecute;
/**
 * Copy templates to the given path and read template files.
 *
 * @param createPluginCwd
 * @returns
 */
function copyTemplates(createPluginCwd) {
    utils_1.logProgress("Create new plugin from template...");
    var templateCwd = path_1.resolve(createPluginCwd, "../..", utils_1.FOLDER_CWRA, "template");
    // TODO: copySync(templateCwd, createPluginCwd);
    var templates = {
        "index.php": fs_1.readFileSync(path_1.resolve(templateCwd, "../grunt-index-php.tmpl"), { encoding: "UTF-8" }),
        "readme.wporg.txt": fs_1.readFileSync(path_1.resolve(templateCwd, "../grunt-readme-txt.tmpl"), {
            encoding: "UTF-8"
        })
    };
    utils_1.logSuccess("Successfully created plugin folder " + chalk_1.default.underline(createPluginCwd));
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
function applyPromptsToTemplates(createPluginCwd, templates, input) {
    var applyTemplate = function(tmpl) {
        var mod = tmpl;
        Object.entries(input).forEach(function(_a) {
            var key = _a[0],
                value = _a[1];
            if (key === "namespace") {
                value = value.replace(/\\/g, "\\\\");
            }
            mod = mod.replace(new RegExp("\\$\\{" + key + "\\}", "g"), value);
        });
        return mod;
    };
    var indexPhpFile = path_1.resolve(createPluginCwd, "src/index.php");
    var readmeTxtFile = path_1.resolve(createPluginCwd, "wordpress.org/README.wporg.txt");
    var indexPhpContent = applyTemplate(templates["index.php"]);
    var readmeTxtContent = applyTemplate(templates["readme.wporg.txt"]);
    fs_1.writeFileSync(indexPhpFile, indexPhpContent, { encoding: encoding });
    utils_1.logSuccess("Successfully created main plugin file " + chalk_1.default.underline(indexPhpFile));
    fs_1.writeFileSync(readmeTxtFile, readmeTxtContent, { encoding: encoding });
    utils_1.logSuccess(
        "Successfully created readme file for wordpress.org " + chalk_1.default.underline(readmeTxtFile)
    );
    return {
        indexPhpFile: indexPhpFile,
        readmeTxtFile: readmeTxtFile,
        indexPhpContent: indexPhpContent,
        readmeTxtContent: readmeTxtContent
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
function applyPhpConstantsAndNamespace(createPluginCwd, appliedTemplates, constantPrefix, namespace) {
    utils_1.logProgress("Get and apply all your PHP constants to the *.php files...");
    // Find constants
    var m;
    var regex = /define\(\'([^\']+)/g;
    var constantList = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((m = regex.exec(appliedTemplates.indexPhpContent)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach(function(match, groupIndex) {
            if (groupIndex === 1) {
                constantList.push(match);
            }
        });
    }
    // Search & Replace constants
    var phpFiles = glob_1.default.sync("**/*.php", { cwd: path_1.resolve(createPluginCwd, "src"), absolute: true });
    constantList.forEach(function(constant) {
        return utils_1.searchAndReplace(
            phpFiles,
            new RegExp("WPRJSS" + constant.slice(constantPrefix.length), "g"),
            constant
        );
    });
    utils_1.logSuccess(
        "Successfully applied the following constants which you can use now - read more about them in WP ReactJS Starter documentation:\n - " +
            constantList.join("\n - ")
    );
    // Apply the namespace
    utils_1.logProgress(
        "Apply namespace " + chalk_1.default.underline(namespace) + " to all PHP files for autoloading..."
    );
    utils_1.searchAndReplace(phpFiles, /MatthiasWeb\\WPRJSS/g, namespace);
}
/**
 * Find PHP functions starting with wprjss_skip and replace them with the
 * correct prefix (depending on constant prefix).
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyPhpFunctions(createPluginCwd, constantPrefix) {
    var functionPrefix = constantPrefix.toLowerCase();
    utils_1.logProgress(
        "Find PHP functions and replace with " + chalk_1.default.underline(functionPrefix) + " prefix..."
    );
    var phpFiles = glob_1.default.sync("**/*.php", { cwd: path_1.resolve(createPluginCwd, "src"), absolute: true });
    utils_1.searchAndReplace(phpFiles, /wprjss_skip/g, functionPrefix + "_skip");
}
/**
 * Apply the slug to different files where needed.
 *
 * @param createPluginCwd
 * @param slug
 */
function applySlug(createPluginCwd, slug) {
    utils_1.logProgress(
        "Find various code places and replace the slug with " + chalk_1.default.underline(slug) + "..."
    );
    var globFiles = function(pattern) {
        return glob_1.default.sync(pattern, { cwd: createPluginCwd, absolute: true });
    };
    var files = __spreadArrays(
        globFiles("devops/**/*.{yml,sh}"),
        globFiles("devops/.gitlab/**/*.yml"),
        globFiles("devops/.gitlab/.gitlab-ci.yml"),
        globFiles("package.json"),
        globFiles("src/**/*.php")
    );
    utils_1.searchAndReplace(files, /wp-reactjs-starter/g, slug);
}
/**
 * Find GitLab CI jobs and replace them with the correct prefix (depending on constant prefix).
 * Also add the include to the root .gitlab-ci.yml
 *
 * @param createPluginCwd
 * @param constantPrefix
 */
function applyGitLabCi(createPluginCwd, constantPrefix) {
    var jobPrefix = constantPrefix.toLowerCase();
    utils_1.logProgress("Find GitLab CI jobs and prefix them with " + chalk_1.default.underline(jobPrefix) + "...");
    var globFiles = function(pattern) {
        return glob_1.default.sync(pattern, { cwd: createPluginCwd, absolute: true });
    };
    var files = __spreadArrays(globFiles("devops/.gitlab/**/*.yml"), globFiles("devops/.gitlab/.gitlab-ci.yml"));
    utils_1.searchAndReplace(files, /wprjss/g, jobPrefix);
}
