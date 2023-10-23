import express from 'express'
import { getAllUsers, update } from '../controllers/userController'

const userRoutes = express.Router()

userRoutes.get('/users', getAllUsers)
userRoutes.patch('/users', update)

export default userRoutes