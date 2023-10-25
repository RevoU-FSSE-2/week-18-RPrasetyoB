import { NextFunction, Request, Response } from 'express';
import { userModel } from '../config/schemas/schema';
import { loginUser, passResetReq, passwordReset, registerUser, updateRole } from '../services/userService'
import jwt from 'jsonwebtoken'
import { JWT_Sign } from '../config/auth/jwt';
import { getToken, loggedUser } from '../utils/getToken';

//------ Login user ------
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser({ username, password });
    console.log('user', result.data.username)
    if (result.success) {
      const token = jwt.sign({_id : result.data._id, username: result.data.username, role: result.data.role}, JWT_Sign)
      return res.status(200).json({
        message: result.message,
        user: result.data,
        token: token
      });
    }
  } catch (error) {
    next(error);
  }
};


//------ Create user ------
const regUser = async (req : Request, res: Response, next: NextFunction) => {
  try {
  const { username, email, password } = req.body;
  const result = await registerUser({ username, email, password})

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Registration success',
      })
    }
  } catch (error) {
    next(error);
  }
};


//------ Update Role ------
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const decodedToken = getToken(req)

    if (!decodedToken) {
      return res.status(401).json({ success: false, message: "Unauthorized: please login" });
    }
    const { id } = req.params
    const { role } = req.body;
    const updatedRole = await updateRole({ id, role});
    if(role !==  "guest" && role !== "admin") {
      return res.status(404).json({ success: false, message: "Allowed role only 'admin' or 'guest'" });
    }
    if(updatedRole.success) {
      return res.status(200).json({ success: true, message: 'Role updated successfully', updatedRole });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
}


//------ Password reset -------
const resetPassReq = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { email } = req.body;
      const result = await passResetReq(email);

      if (result.success) {
          return res.status(200).json({
              success: true,
              message: 'Password reset link sent',
              data: result.data,
          });
      } else {
          return res.status(404).json({
              success: false,
              message: result.message,
          });
      }
  } catch (error) {
      next(error);
  }
}

const resetPass = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const  key  = req.query.key as string
      const { password } = req.body;
      const result = await passwordReset(key, password);

      if (result.success) {
          return res.status(200).json({
              success: true,
              message: 'Password reset successful',
          });
      } else {
          return res.status(401).json({
              success: false,
              message: result.message,
          });
      }
  } catch (error) {
      next(error);
  }
}


//------ token refresh -------
const accessTokenRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refreshToken'];
  const decodedToken: jwt.JwtPayload = jwt.decode(refreshToken) as jwt.JwtPayload;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refresh token is missing"
      })
    }

    if (!JWT_Sign) throw new Error('JWT_SIGN is not defined')

    try {
      if(refreshToken) {
        const accessToken= jwt.sign(decodedToken, JWT_Sign)
  
        res.cookie("accessToken", accessToken, {
          maxAge: 10 * 60 * 1000,
          httpOnly: true,
          path: '/'
        })
  
        return res.status(200).json({
          success: true,
          message: "access token refresh successfully",
          data: { accessToken }
        })
      }
    } catch (error) {
      next(error)
    }
};


//------ log out ------
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
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
      })
  } catch (error: any) {
      next(error)
  }
}

//------ Get all users ------
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find({})
 
    return res.status(200).json({
      success: true,
      message: "success get all user",
      users: user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "failed to get all users"
    });
  }
};

//------ Get one user by id ------
const getOneUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await userModel.findById(id);
      if(!user) {
        return res.status(404).json({
          message: "user not found"
        })
      }

      return res.status(200).json({
        success: true,
        message: "success get user",
        user: user,
      });
    } catch (err) {
    console.log('Error get user:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while get the user or userId wrong format'
    });
  }
};


export { getAllUsers, getOneUser, regUser, login, update, logoutUser, resetPass, resetPassReq, accessTokenRefresh}

