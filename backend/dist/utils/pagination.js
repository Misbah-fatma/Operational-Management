"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = exports.buildPaginationMeta = exports.buildSort = exports.getPagination = void 0;
const getPagination = (req) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    return { page, limit, sortBy, sortOrder };
};
exports.getPagination = getPagination;
const buildSort = (sortBy, sortOrder) => {
    return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
};
exports.buildSort = buildSort;
const buildPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.escapeRegex = escapeRegex;
//# sourceMappingURL=pagination.js.map