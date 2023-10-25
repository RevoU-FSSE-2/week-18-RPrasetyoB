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
exports.accessTokenRefresh = exports.resetPassReq = exports.resetPass = exports.logoutUser = exports.update = exports.login = exports.regUser = exports.getOneUser = exports.getAllUsers = void 0;
const schema_1 = require("../config/schemas/schema");
const userService_1 = require("../services/userService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/auth/jwt");
const getToken_1 = require("../utils/getToken");
//------ Login user ------
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const result = yield (0, userService_1.loginUser)({ username, password });
        console.log('user', result.data.username);
        if (result.success) {
            const token = jsonwebtoken_1.default.sign({ _id: result.data._id, username: result.data.username, role: result.data.role }, jwt_1.JWT_Sign);
            return res.status(200).json({
                message: result.message,
                user: result.data,
                token: token
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//------ Create user ------
const regUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const result = yield (0, userService_1.registerUser)({ username, email, password });
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Registration success',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.regUser = regUser;
//------ Update Role ------
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = (0, getToken_1.getToken)(req);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: "Unauthorized: please login" });
        }
        const { id } = req.params;
        const { role } = req.body;
        const updatedRole = yield (0, userService_1.updateRole)({ id, role });
        if (role !== "guest" && role !== "admin") {
            return res.status(404).json({ success: false, message: "Allowed role only 'admin' or 'guest'" });
        }
        if (updatedRole.success) {
            return res.status(200).json({ success: true, message: 'Role updated successfully', updatedRole });
        }
        else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.update = update;
//------ Password reset -------
const resetPassReq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const result = yield (0, userService_1.passResetReq)(email);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Password reset link sent',
                data: result.data,
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassReq = resetPassReq;
const resetPass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = req.query.key;
        const { password } = req.body;
        const result = yield (0, userService_1.passwordReset)(key, password);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Password reset successful',
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.resetPass = resetPass;
//------ token refresh -------
const accessTokenRefresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['refreshToken'];
    const decodedToken = jsonwebtoken_1.default.decode(refreshToken);
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "refresh token is missing"
        });
    }
    if (!jwt_1.JWT_Sign)
        throw new Error('JWT_SIGN is not defined');
    try {
        if (refreshToken) {
            const accessToken = jsonwebtoken_1.default.sign(decodedToken, jwt_1.JWT_Sign);
            res.cookie("accessToken", accessToken, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
                path: '/'
            });
            return res.status(200).json({
                success: true,
                message: "access token refresh successfully",
                data: { accessToken }
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.accessTokenRefresh = accessTokenRefresh;
//------ log out ------
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            path: '/'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            path: '/'
        });
        return res.status(200).json({
            success: true,
            message: 'Successfully logout'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutUser = logoutUser;
//------ Get all users ------
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield schema_1.userModel.find({});
        return res.status(200).json({
            success: true,
            message: "success get all user",
            users: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "failed to get all users"
        });
    }
});
exports.getAllUsers = getAllUsers;
//------ Get one user by id ------
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield schema_1.userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "success get user",
            user: user,
        });
    }
    catch (err) {
        console.log('Error get user:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while get the user or userId wrong format'
        });
    }
});
exports.getOneUser = getOneUser;
