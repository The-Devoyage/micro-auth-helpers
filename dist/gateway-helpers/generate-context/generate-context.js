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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateContext = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateContext = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { req, secretOrPublicKey } = params;
    const authHeader = req.get("Authorization");
    if (!authHeader)
        return { auth: { isAuth: false } };
    const token = authHeader.split(" ")[1];
    if (!token || token === "")
        return {
            auth: {
                isAuth: false,
                error: "Token property was provided but is not valid.",
            },
        };
    let decodedToken;
    if (!secretOrPublicKey) {
        return {
            auth: {
                isAuth: false,
                error: "Token is provided, but secret or public Decrypting key is missing. Key is required to decode token.",
            },
        };
    }
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, secretOrPublicKey);
    }
    catch (error) {
        console.log(error);
        return { auth: { isAuth: false, error: error } };
    }
    return {
        auth: {
            decodedToken,
            isAuth: true,
        },
    };
});
exports.GenerateContext = GenerateContext;
