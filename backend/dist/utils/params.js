"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
const getParam = (req, name) => {
    const value = req.params[name];
    return Array.isArray(value) ? value[0] : value;
};
exports.getParam = getParam;
//# sourceMappingURL=params.js.map