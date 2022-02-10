"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuth = void 0;
const CheckAuth = (options) => {
    const { context, requireUser, errorMessage } = options;
    if (!context.auth.isAuth)
        throw new Error(errorMessage !== null && errorMessage !== void 0 ? errorMessage : 'Not Authenticated');
    if (requireUser && context.auth.decodedToken) {
        if (!('user' in context.auth.decodedToken)) {
            throw new Error(errorMessage !== null && errorMessage !== void 0 ? errorMessage : 'Requires User Authentiction');
        }
    }
};
exports.CheckAuth = CheckAuth;
