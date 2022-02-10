"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDataSource = void 0;
const apollo_federation_upload_1 = __importDefault(require("@profusion/apollo-federation-upload"));
class AuthDataSource extends apollo_federation_upload_1.default {
    willSendRequest({ request, context, }) {
        var _a;
        (_a = request.http) === null || _a === void 0 ? void 0 : _a.headers.set('auth', JSON.stringify(context.auth));
    }
}
exports.AuthDataSource = AuthDataSource;
