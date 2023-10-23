import express from 'express'
import { getAllTodo, createTodo, updateTodo, deleteTodo } from '../controllers/todoController'

const todoRoutes = express.Router()

todoRoutes.get('/todos', getAllTodo)
todoRoutes.post('/todos', createTodo)
todoRoutes.put('/todos/:id', updateTodo)
todoRoutes.delete('/todos/:id', deleteTodo)

export default todoRoutes