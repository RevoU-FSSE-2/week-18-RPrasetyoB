import { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";

const setPermissionsPolicy = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Permissions-Policy", "your-permissions-policy");
  next();
};

const helmetApp = (app: Express) => {
  app.use(helmet());
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(setPermissionsPolicy);
};

export default helmetApp;
