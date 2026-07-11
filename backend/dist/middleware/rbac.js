"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.authorizeRoles = exports.authorize = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const constants_1 = require("../constants");
const authorize = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            next(new ApiResponse_1.ApiError(401, 'Authentication required'));
            return;
        }
        const userRole = req.user.role;
        const userPermissions = constants_1.ROLE_PERMISSIONS[userRole] || [];
        const hasPermission = permissions.some((p) => userPermissions.includes(p));
        if (!hasPermission) {
            next(new ApiResponse_1.ApiError(403, 'Insufficient permissions'));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            next(new ApiResponse_1.ApiError(401, 'Authentication required'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new ApiResponse_1.ApiError(403, 'Insufficient role permissions'));
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const hasPermission = (role, permission) => {
    return (constants_1.ROLE_PERMISSIONS[role] || []).includes(permission);
};
exports.hasPermission = hasPermission;
//# sourceMappingURL=rbac.js.map