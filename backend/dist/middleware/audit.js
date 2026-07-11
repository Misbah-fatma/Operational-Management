"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = void 0;
const AuditLog_1 = require("../models/AuditLog");
const auditLog = (action, entity) => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = function (body) {
            if (req.user && res.statusCode < 400) {
                const entityId = req.params.id ||
                    body?.data?._id;
                AuditLog_1.AuditLog.create({
                    user: req.user._id,
                    action,
                    entity,
                    entityId,
                    changes: req.method !== 'GET' ? req.body : undefined,
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent'),
                }).catch(() => { });
            }
            return originalJson(body);
        };
        next();
    };
};
exports.auditLog = auditLog;
//# sourceMappingURL=audit.js.map