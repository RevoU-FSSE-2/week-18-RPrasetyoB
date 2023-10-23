import express from 'express';
import authRoute from './authRoutes';
import userRoute from './userRoutes';
import todoRoutes from './todoRoutes';
import authentication from '../middlewares/authentication';

const routes = express.Router()

routes.use('/v1', authRoute);
routes.use('/v1', authentication, userRoute);
routes.use('/v1', authentication, todoRoutes);

export default routes