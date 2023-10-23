import express from 'express'
import { login, logoutUser, regUser } from '../controllers/userController'

const authRoutes = express.Router()

authRoutes.post('/auth/register', regUser)
authRoutes.post('/auth/login', login)
authRoutes.post('/logout', logoutUser)

export default authRoutes