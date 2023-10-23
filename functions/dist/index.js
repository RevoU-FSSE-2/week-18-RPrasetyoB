"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.milestone3_rpb = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const mainRoutes_1 = __importDefault(require("./routes/mainRoutes"));
const db_connection_1 = require("./config/db/db.connection");
const middlewares_1 = __importDefault(require("./middlewares"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const functions = __importStar(require("firebase-functions"));
const mainRoutes_2 = __importDefault(require("./routes/mainRoutes"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const app = (0, express_1.default)();
const server_port = process.env.SERVER_PORT || 3000;
(0, db_connection_1.db)();
app.use(express_1.default.json());
(0, middlewares_1.default)(app);
app.use(mainRoutes_2.default);
(0, corsMiddleware_1.default)(app);
app.use(mainRoutes_1.default);
app.use(errorHandler_1.default);
app.listen(server_port, () => {
    console.log(`server listening at http://localhost:${server_port}`);
});
exports.milestone3_rpb = functions.https.onRequest(app);
