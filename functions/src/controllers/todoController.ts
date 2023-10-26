import { Request, Response } from "express";
import { todoModel } from "../config/schemas/schema";
import { deleteMakerTodos, getMakerTodos, updateMakerTodos } from "../services/todoService";
import { getToken, loggedUser } from "../utils/getToken";

//------ getTodo ------
const getAllTodo = async (req: Request, res: Response) => {
  const decodedToken = getToken(req)
  const { userRole, username } = loggedUser(decodedToken);
console.log('test', userRole, username )
  
  try {
    if (userRole == "admin") {
      const todo = await getMakerTodos();
      return res.status(200).json({
        success: true,
        message: "Successfully fetched all todo",
        result: todo,
        user: username,
        role: userRole
      });
    } else if(userRole == "guest") {
      const todo = await getMakerTodos(username);
      return res.status(200).json({
        success: true,
        message: "Successfully fetched todos for the user",
        result: todo,
        user: username,
        role: userRole
      });
    }
    else {
      return res.status(403).json({
        success: false,
        message: "Please login first"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get todos",
    });
  }
};

const getOneTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const todo = await todoModel.findById(id);
    if(!todo) {
      return res.status(404).json({
        message: "Todo not found"
      })
    }
      
    return res.status(200).json({
      success: true,
      message: "success get todo",
      user: todo,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal server erro while get Todo or Todo id wrong format"
    });
  }
};

const createTodo = async (req: Request, res: Response) => {
  const decodedToken = getToken(req)
  const { username } = loggedUser(decodedToken);
  if(!decodedToken){
    return res.status(401).json({
      success: false,
      message: "Unauthorized please login"
    })
  }
  try {
    const { todo, priority } = req.body;

    const newTodo = await todoModel.create({ todo, priority, maker: username });
    return res.status(200).json({
      success: true,
      message: "Add new todo success",
      data: newTodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const decodedToken = getToken(req)
  const { username } = loggedUser(decodedToken);
  if(!decodedToken){
    return res.status(401).json({
      success: false,
      message: "Unauthorized please login"
    })
  }
  try {
    const { id } = req.params;
    const todoId = await todoModel.findOne({_id:id});
    if (!todoId) {
      return {
        success: false,
        status: 404,
        message: "Todo name not found",
        data: null,
      };
    }

    const { todo, status, priority, dueDate } = req.body;
    if (!todo && !status && !dueDate && !priority) {
      return res.status(400).json({
        success: false,
        message: "At least one of 'todo', 'status', 'priority' or 'dueDate' is required for update todo",
      });
    }

    if(todoId.maker == username){
      const updatedStatus = await updateMakerTodos(id , todo, status, priority, dueDate);
      if (updatedStatus.success) {
        return res.status(200).json({
          success: true,
          message: "Successfully updated status",
          updatedData: {todo, status, dueDate}
        });
      } else {
        return res.status(updatedStatus.status).json({
          success: false,
          message: updatedStatus.message,
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this todo",
      });
    }
    
  } catch (err) {
    console.log("Error updating status:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the status",
    });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  const decodedToken = getToken(req)
  const { username } = loggedUser(decodedToken);
  if(!decodedToken){
    return res.status(401).json({
      success: false,
      message: "Unauthorized please login"
    })
  }
  try {
    const { id } = req.params;
    const todo = await todoModel.findOne({ _id: id });
    if (!todo) {
      return {
        success: false,
        status: 404,
        message: "Todo not found",
        data: null,
      };
    }
    if (todo && todo.maker == username) {
      const deletedTodo = await deleteMakerTodos(id);
      if (deletedTodo.status = 200) {
        return res.status(200).json({
          success: true,
          message: "Todo deleted successfully",
          data: deletedTodo,
        });
      } else {
        return res.status(deletedTodo.status).json({
          success: false,
          message: 'Failed deteted todo',
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this todo",
      });
    }
  } catch (err) {
    console.log("Error deleting todo:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the todo",
    });
  }
};

export { createTodo, getAllTodo, updateTodo, deleteTodo, getOneTodo  };
