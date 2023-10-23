"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Acces forbidden' });
    }
    next();
};
exports.default = authentication;
