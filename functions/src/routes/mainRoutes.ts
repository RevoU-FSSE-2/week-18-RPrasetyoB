import express from 'express'
import { Request, Response } from 'express'

const mainRoutes = express.Router()

mainRoutes.get('/', (req: Request, res : Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to RPB rest API'
    })
})

export default mainRoutes;