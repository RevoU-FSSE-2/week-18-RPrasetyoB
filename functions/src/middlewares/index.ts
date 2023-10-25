import { Express } from "express";
// import cookieMidleware from "./cookiesParser";
// import morganApp from "./morganApp";
import { xRequestId } from "./xRequest-id";
import helmetApp from "./helmetApp";

const middleWares = (app: Express)=> {
    helmetApp(app);
    // morganApp(app);
    // cookieMidleware(app);
    app.use(xRequestId)
}

export default middleWares