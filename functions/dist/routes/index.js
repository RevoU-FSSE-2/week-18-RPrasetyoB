"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const todoRoutes_1 = __importDefault(require("./todoRoutes"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const routes = express_1.default.Router();
routes.use('/v1', authRoutes_1.default);
routes.use('/v1', authentication_1.default, userRoutes_1.default);
routes.use('/v1', authentication_1.default, todoRoutes_1.default);
exports.default = routes;
