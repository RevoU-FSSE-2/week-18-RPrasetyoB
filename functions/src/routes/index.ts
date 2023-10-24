import express from 'express';
import userRoute from './userRoute';
import authRoutes from './authRoutes';

const routes = express.Router()

routes.use('/v1', authRoutes);
routes.use('/v1', userRoute);
routes.use('/v1', authRoutes);

export default routes