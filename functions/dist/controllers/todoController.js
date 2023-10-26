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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneTodo = exports.deleteTodo = exports.updateTodo = exports.getAllTodo = exports.createTodo = void 0;
const schema_1 = require("../config/schemas/schema");
const todoService_1 = require("../services/todoService");
const getToken_1 = require("../utils/getToken");
//------ getTodo ------
const getAllTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, getToken_1.getToken)(req);
    const { userRole, username } = (0, getToken_1.loggedUser)(decodedToken);
    console.log('test', userRole, username);
    try {
        if (userRole == "admin") {
            const todo = yield (0, todoService_1.getMakerTodos)();
            return res.status(200).json({
                success: true,
                message: "Successfully fetched all todo",
                result: todo,
                user: username,
                role: userRole
            });
        }
        else if (userRole == "guest") {
            const todo = yield (0, todoService_1.getMakerTodos)(username);
            return res.status(200).json({
                success: true,
                message: "Successfully fetched todos for the user",
                result: todo,
                user: username,
                role: userRole
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Please login first"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get todos",
        });
    }
});
exports.getAllTodo = getAllTodo;
const getOneTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const todo = yield schema_1.todoModel.findById(id);
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "success get todo",
            user: todo,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Internal server erro while get Todo or Todo id wrong format"
        });
    }
});
exports.getOneTodo = getOneTodo;
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, getToken_1.getToken)(req);
    const { username } = (0, getToken_1.loggedUser)(decodedToken);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized please login"
        });
    }
    try {
        const { todo, priority } = req.body;
        const newTodo = yield schema_1.todoModel.create({ todo, priority, maker: username });
        return res.status(200).json({
            success: true,
            message: "Add new todo success",
            data: newTodo,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});
exports.createTodo = createTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, getToken_1.getToken)(req);
    const { username } = (0, getToken_1.loggedUser)(decodedToken);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized please login"
        });
    }
    try {
        const { id } = req.params;
        const todoId = yield schema_1.todoModel.findOne({ _id: id });
        if (!todoId) {
            return {
                success: false,
                status: 404,
                message: "Todo name not found",
                data: null,
            };
        }
        const { todo, status, priority, dueDate } = req.body;
        if (!todo && !status && !dueDate && !priority) {
            return res.status(400).json({
                success: false,
                message: "At least one of 'todo', 'status', 'priority' or 'dueDate' is required for update todo",
            });
        }
        if (todoId.maker == username) {
            const updatedStatus = yield (0, todoService_1.updateMakerTodos)(id, todo, status, priority, dueDate);
            if (updatedStatus.success) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully updated status",
                    updatedData: { todo, status, dueDate }
                });
            }
            else {
                return res.status(updatedStatus.status).json({
                    success: false,
                    message: updatedStatus.message,
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this todo",
            });
        }
    }
    catch (err) {
        console.log("Error updating status:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the status",
        });
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, getToken_1.getToken)(req);
    const { username } = (0, getToken_1.loggedUser)(decodedToken);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized please login"
        });
    }
    try {
        const { id } = req.params;
        const todo = yield schema_1.todoModel.findOne({ _id: id });
        if (!todo) {
            return {
                success: false,
                status: 404,
                message: "Todo not found",
                data: null,
            };
        }
        if (todo && todo.maker == username) {
            const deletedTodo = yield (0, todoService_1.deleteMakerTodos)(id);
            if (deletedTodo.status = 200) {
                return res.status(200).json({
                    success: true,
                    message: "Todo deleted successfully",
                    data: deletedTodo,
                });
            }
            else {
                return res.status(deletedTodo.status).json({
                    success: false,
                    message: 'Failed deteted todo',
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this todo",
            });
        }
    }
    catch (err) {
        console.log("Error deleting todo:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the todo",
        });
    }
});
exports.deleteTodo = deleteTodo;
