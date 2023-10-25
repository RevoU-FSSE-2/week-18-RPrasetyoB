import express from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import todoRoutes from './todoRoutes';
import authentication from '../middlewares/authentication';

const routes = express.Router()

routes.use('/v1', authRoutes);
routes.use('/v1', authentication, userRoutes);
routes.use('/v1', authentication, todoRoutes);

export default routes