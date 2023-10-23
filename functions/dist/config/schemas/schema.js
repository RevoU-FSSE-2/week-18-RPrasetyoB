"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'guest',
        enum: ['admin', 'guest']
    }
}, {
    versionKey: false
});
exports.userModel = mongoose_1.default.model('users', userSchema);
const todoSchema = new mongoose_1.default.Schema({
    todo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "in progress",
        enum: ["in progress", "done"]
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },
    dueDate: {
        type: Date,
        default: () => (0, moment_1.default)().add(3, 'days').format('YYYY/MM/DD'),
        required: true
    },
    maker: {
        type: String,
    },
    isDeleted: {
        type: Boolean
    }
}, {
    timestamps: {
        currentTime: () => new Date().setUTCHours(0, 0, 0, 0)
    },
    versionKey: false
});
exports.todoModel = mongoose_1.default.model("todos", todoSchema);
