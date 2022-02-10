"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitRole = void 0;
const LimitRole = (options) => {
    const { userRole = 100, roleLimit = 1, errorMessage } = options;
    if (userRole !== 1) {
        if (userRole > roleLimit)
            throw new Error(`Permission denied. ${errorMessage !== null && errorMessage !== void 0 ? errorMessage : 'You are not authorized to view/edit these details.'}`);
    }
};
exports.LimitRole = LimitRole;
