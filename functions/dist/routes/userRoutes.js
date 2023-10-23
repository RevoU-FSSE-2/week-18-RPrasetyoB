"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRoutes = express_1.default.Router();
userRoutes.get('/users', userController_1.getAllUsers);
userRoutes.patch('/users', userController_1.update);
exports.default = userRoutes;
