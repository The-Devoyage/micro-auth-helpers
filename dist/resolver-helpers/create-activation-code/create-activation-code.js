"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivationCode = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const CreateActivationCode = (params) => {
    var _a, _b;
    const { codeLength, codeLimit } = params;
    const start = codeLength <= 1 ? 1 : Math.pow(10, codeLength - 1);
    const activationCode = Math.floor(start + Math.random() * 9 * start);
    const activationLimit = (0, dayjs_1.default)().add((_a = codeLimit === null || codeLimit === void 0 ? void 0 : codeLimit.value) !== null && _a !== void 0 ? _a : 1, (_b = codeLimit === null || codeLimit === void 0 ? void 0 : codeLimit.unit) !== null && _b !== void 0 ? _b : 'h');
    return {
        code: activationCode.toString(),
        limit: activationLimit,
        verified: false,
    };
};
exports.CreateActivationCode = CreateActivationCode;
