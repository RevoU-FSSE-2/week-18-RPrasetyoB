"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMakerTodos = exports.updateMakerTodos = exports.getMakerTodos = void 0;
const schema_1 = require("../config/schemas/schema");
const errorCatch_1 = __importDefault(require("../utils/errorCatch"));
//------ get todos ------
const getMakerTodos = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = username
            ? { maker: username, isDeleted: { $exists: false } }
            : { isDeleted: { $exists: false } };
        const todo = yield schema_1.todoModel.find(query);
        return {
            status: 200,
            data: todo,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
});
exports.getMakerTodos = getMakerTodos;
// ------ update todo ------
const updateMakerTodos = (id, todo, status, priority, dueDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoUpdate = yield schema_1.todoModel.findByIdAndUpdate(id, { todo: todo, status: status, priority: priority, dueDate: dueDate }, { new: true });
        return {
            success: true,
            status: 200,
            message: "Successfully updated todo",
            data: todoUpdate,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
});
exports.updateMakerTodos = updateMakerTodos;
const deleteMakerTodos = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTodo = yield schema_1.todoModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        return {
            status: 200,
            data: deletedTodo,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
});
exports.deleteMakerTodos = deleteMakerTodos;
