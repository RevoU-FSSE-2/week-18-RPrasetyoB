import { todoModel } from "../config/schemas/schema";
import ErrorCatch from "../utils/errorCatch";

//------ get todos ------
const getMakerTodos = async (username?: string) => {
  try {
    const query = username
      ? { maker: username, isDeleted: { $exists: false } }
      : { isDeleted: { $exists: false } };
    const todo = await todoModel.find(query);
    return {
      status: 200,
      data: todo,
    };
  } catch (error: any) {
    throw new ErrorCatch({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// ------ update todo ------
const updateMakerTodos = async (id: string, todo:string, status: string, priority: string, dueDate: Date) => {
  try {
    const todoUpdate = await todoModel.findByIdAndUpdate(id, { todo: todo, status: status, priority: priority, dueDate: dueDate },{new:true});

    return {
      success: true,
      status: 200,
      message: "Successfully updated todo",
      data: todoUpdate,
    };
  } catch (error: any) {
    throw new ErrorCatch({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

const deleteMakerTodos = async (id: string) => {
    try {   
      const deletedTodo = await todoModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } },
        { new: true }
      );
  
      return {
        status: 200,
        data: deletedTodo,
      };
    } catch (error: any) {
      throw new ErrorCatch({
        success: false,
        message: error.message,
        status: 500,
      });
    }
  };

export { getMakerTodos, updateMakerTodos, deleteMakerTodos };
