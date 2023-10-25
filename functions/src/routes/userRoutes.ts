import express from 'express'
import { getAllUsers, update } from '../controllers/userController'
import authorization from '../middlewares/authorization'

const userRoutes = express.Router()

userRoutes.get('/users', getAllUsers)
userRoutes.patch('/users/:id', authorization(['admin']), update)

export default userRoutes