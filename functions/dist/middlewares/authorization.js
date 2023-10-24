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
const getToken_1 = require("../utils/getToken");
const authorization = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const decodedToken = (0, getToken_1.getToken)(req);
        const { userRole } = (0, getToken_1.loggedUser)(decodedToken);
        if (!decodedToken) {
            return res.status(401).send({ message: "Unauthorized, please login" });
        }
        try {
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).send({ message: "Access forbidden: Role not allowed" });
            }
            next();
        }
        catch (error) {
            res.status(401).send({ message: "Invalid Access" });
        }
    });
};
exports.default = authorization;
