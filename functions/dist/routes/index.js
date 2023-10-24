"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./userRoute"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const routes = express_1.default.Router();
routes.use('/v1', authRoutes_1.default);
routes.use('/v1', userRoute_1.default);
routes.use('/v1', authRoutes_1.default);
exports.default = routes;
