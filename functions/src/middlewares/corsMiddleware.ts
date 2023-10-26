import cors, { CorsOptions } from "cors";
import { Application, Request } from "express";

const origin = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://milestone3-rpb.web.app"
];

const partnerOrigin = [
    "https://week15-rpb-y.netlify.app"
];

const corsOptions = (req: Request | any, callback: (err: Error | null, options?: CorsOptions) => void) => {
    const clientOrigin = origin.includes(req.header("Origin"));
    const clientPartnerOrigin = partnerOrigin.includes(req.header("Origin"));
    const isPostman = req.header("User-Agent")?.includes("Postman");

    if (clientOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST, DELETE, PUT, OPTIONS, HEAD',
        });
    } else if (clientPartnerOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST',
        });
    } else if (isPostman) {
        // Allow Postman to access your API
        callback(null, {
            origin: 'https://www.getpostman.com',
            methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        });
    } else {
        callback(new Error('Not allowed by CORS'));
    }
};

const corsMiddleware = (app: Application) => {
    app.use(cors(corsOptions));
};

export default corsMiddleware;
