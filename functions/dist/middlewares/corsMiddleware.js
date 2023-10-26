"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const origin = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://milestone3-rpb.web.app"
];
const partnerOrigin = [
    "https://week15-rpb-y.netlify.app"
];
const corsOptions = (req, callback) => {
    var _a;
    const clientOrigin = origin.includes(req.header("Origin"));
    const clientPartnerOrigin = partnerOrigin.includes(req.header("Origin"));
    const isPostman = (_a = req.header("User-Agent")) === null || _a === void 0 ? void 0 : _a.includes("Postman");
    if (clientOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST, DELETE, PUT, OPTIONS, HEAD',
        });
    }
    else if (clientPartnerOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST',
        });
    }
    else if (isPostman) {
        // Allow Postman to access your API
        callback(null, {
            origin: 'https://www.getpostman.com',
            methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        });
    }
    else {
        callback(new Error('Not allowed by CORS'));
    }
};
const corsMiddleware = (app) => {
    app.use((0, cors_1.default)(corsOptions));
};
exports.default = corsMiddleware;
