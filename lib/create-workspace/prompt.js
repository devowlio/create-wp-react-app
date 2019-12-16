"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = require("inquirer");
var _1 = require("./");
var utils_1 = require("../utils");
/**
 * Prompt for CLI arguments which are not passed.
 */
function createWorkspacePrompt(_a) {
    var workspace = _a.workspace, repository = _a.repository, checkout = _a.checkout, portWp = _a.portWp, portPma = _a.portPma;
    return __awaiter(this, void 0, void 0, function () {
        var mockData, answers, _b, parsed, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _1.checkDependencies();
                    mockData = utils_1.getInternalExampleArgs("workspace");
                    _b = mockData;
                    if (_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer_1.prompt([
                            !workspace && {
                                name: "workspace",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createWorkspaceCommand, "--workspace"),
                                type: "input",
                                validate: function (value) {
                                    if (value && /^[A-Za-z0-9-_]+$/.test(value)) {
                                        return true;
                                    }
                                    return "Your workspace name should only contain [A-Za-z0-9-_]";
                                }
                            },
                            !portWp && {
                                name: "portWp",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createWorkspaceCommand, "--port-wp"),
                                type: "number",
                                default: 8080,
                                validate: utils_1.inquirerRequiredValidate
                            },
                            !portPma && {
                                name: "portPma",
                                message: utils_1.getCommandDescriptionForPrompt(_1.createWorkspaceCommand, "--port-pma"),
                                type: "number",
                                default: function (answers) {
                                    var useThis = (answers.portWp || +portWp);
                                    return useThis > 0 ? useThis + 1 : 8079;
                                },
                                validate: function (value, answers) {
                                    if (value === (answers.portWp || +portWp)) {
                                        return "You can not use the port twice.";
                                    }
                                    return true;
                                }
                            }
                        ].filter(Boolean))];
                case 1:
                    _b = (_c.sent());
                    _c.label = 2;
                case 2:
                    answers = _b;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    parsed = __assign({ workspace: workspace, repository: repository, checkout: checkout, portWp: portWp, portPma: portPma }, answers);
                    return [4 /*yield*/, _1.createWorkspaceExecute(utils_1.caseAll(parsed, [], ["workspace"]))];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _c.sent();
                    utils_1.logError(e_1.toString());
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createWorkspacePrompt = createWorkspacePrompt;
