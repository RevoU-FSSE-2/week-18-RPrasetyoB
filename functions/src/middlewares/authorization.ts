import { Request, Response, NextFunction} from 'express'
import { getToken, loggedUser } from '../utils/getToken';


const authorization = (allowedRoles: ('admin' | 'guest')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = getToken(req)
    const { userRole } = loggedUser(decodedToken);

    if (!decodedToken) {
      return res.status(401).send({ message: "Unauthorized, please login" });
    }

    try {
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).send({ message: "Access forbidden: Role not allowed" });
      }

      next();
    } catch (error) {
      res.status(401).send({ message: "Invalid Access" });
    }
  };
};

export default authorization