"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedUser = exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.getToken = getToken;
const loggedUser = (decodedToken) => {
    return {
        userRole: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role,
        username: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.username,
        userId: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id
    };
};
exports.loggedUser = loggedUser;
