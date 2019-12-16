"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var utils_1 = require("../utils");
var chalk_1 = __importDefault(require("chalk"));
var execa_1 = __importDefault(require("execa"));
var misc_1 = require("../misc");
var applyName_1 = require("./applyName");
/**
 * Generate a new package from the template. All validations are done in createPackagePrompt.
 *
 * @param root
 * @param input
 * @param fromWorkspace
 * @returns
 * @throws
 */
function createPackageExecute(root, input) {
    return __awaiter(this, void 0, void 0, function () {
        var createPackageCwd;
        return __generator(this, function (_a) {
            createPackageCwd = path_1.resolve(input.cwd, "packages", input.packageName);
            // Strictly do not override an existing plugin!!
            if (fs_extra_1.existsSync(createPackageCwd)) {
                throw new Error("You already have a package with name " + input.packageName + ".");
            }
            _1.copyTemplates(createPackageCwd);
            applyName_1.applyName(createPackageCwd, input.packageName);
            _1.applyPhpNamespace(createPackageCwd, input.namespace);
            misc_1.applyGitLabCi(createPackageCwd, input.abbreviation, "utils");
            misc_1.applyPackageJson(root, createPackageCwd, {
                author: input.author,
                description: input.packageDesc,
                homepage: input.packageUri,
                version: "1.0.0"
            }, false);
            misc_1.modifyRootGitLabCiInclude("add", input.cwd, input.packageName, "packages");
            utils_1.generateLicenseFile(createPackageCwd, input.author, input.packageDesc);
            _1.createExampleFiles(createPackageCwd, input.packageName, input.namespace);
            utils_1.logSuccess("Successfully created package " + input.packageName + " in " + chalk_1.default.underline(createPackageCwd));
            utils_1.logProgress("Bootstrap and link new package...");
            execa_1.default.sync("yarn", ["bootstrap"], { cwd: input.cwd, stdio: "inherit" });
            execa_1.default.sync("yarn", ["lerna", "link"], { cwd: input.cwd, stdio: "inherit" });
            utils_1.runThirdPartyLicenseForPackage(createPackageCwd);
            utils_1.logProgress("Rebuild the development environment, afterwards you can use your new package...");
            execa_1.default("yarn", ["docker:start"], { cwd: input.cwd, stdio: "inherit" });
            return [2 /*return*/];
        });
    });
}
exports.createPackageExecute = createPackageExecute;
