"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateContext = void 0;
const GenerateContext = (params) => {
    const { req, custom } = params;
    const tokenHeader = req.get('token');
    const isAuthHeader = req.get('isauth');
    let decodedToken = {};
    let isAuth = false;
    if (tokenHeader) {
        decodedToken = JSON.parse(tokenHeader);
    }
    if (isAuthHeader) {
        isAuth = JSON.parse(isAuthHeader);
    }
    return Object.assign({ auth: { decodedToken, isAuth } }, custom);
};
exports.GenerateContext = GenerateContext;
