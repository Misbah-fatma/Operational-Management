"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const ApiResponse_1 = require("../utils/ApiResponse");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map((e) => e.msg);
            next(new ApiResponse_1.ApiError(400, 'Validation failed', messages));
            return;
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map