"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xRequest_id_1 = require("./xRequest-id");
const helmetApp_1 = __importDefault(require("./helmetApp"));
const middleWares = (app) => {
    (0, helmetApp_1.default)(app);
    // morganApp(app);
    // cookieMidleware(app);
    app.use(xRequest_id_1.xRequestId);
};
exports.default = middleWares;
