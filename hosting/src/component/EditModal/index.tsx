import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { ApiUrl } from '../../utils/api';
import { useGetToken } from '../../hook';
import { AppContext } from "../../provider/AppProvider";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  editTodo: {
    _id: string;
    todo: string;
    status: string;
    dueDate: string;
    priority: string;
    maker: string;
  };
  handleEditInputChange: (event: EditInputChangeEvent) => void;
  handleCloseBackDrop: () => void;
}

interface Todo {
  _id: string;
  todo: string;
  status: string;
  dueDate: string;
}
interface EditInputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

const EditModal: React.FC<EditModalProps> = (props) => {
  const { open, onClose, editTodo, handleEditInputChange, handleCloseBackDrop } = props;
  const { todolist, setTodolist } = useContext(AppContext);
  const [newDueDate, setNewDueDate] = useState<Date | null>(null);

  useEffect(() => {
    if (editTodo.dueDate) {
      const parsedDueDate = new Date(editTodo.dueDate);
      setNewDueDate(parsedDueDate);
    }
  }, [editTodo.dueDate]);
  
  const handleDatePickerChange = (date: Date | null) => {
    setNewDueDate(date);
  };
  
  const todoItem = todolist.find((item) => item._id === editTodo._id)
  const editTodoDueDate = new Date(editTodo.dueDate);
  
  const handleEditSubmit = async () => {
    const token = useGetToken()
    const formattedDueDate = newDueDate ? format(newDueDate, "yyyy-MM-dd") : "";
    const newTodo = editTodo.todo ? editTodo.todo : todoItem?.todo;
    const newStatus = editTodo.status ? editTodo.status : todoItem?.status;
    const newDate = formattedDueDate ? formattedDueDate : todoItem?.dueDate;
    const body = { todo: newTodo, status: newStatus, dueDate: newDate };
    const Url = ApiUrl + `/v1/todos/${editTodo._id}`;
  console.log(' editodo', editTodo)
    try {
      const response = await fetch(Url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });
      console.log('body', body);
      console.log(' res', response);
      if (response?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Edit",
          text: "Todo edited successfully",
        });
        const updatedTodo = {
          _id: editTodo._id,
          todo: newTodo || editTodo.todo,
          status: newStatus || editTodo.status,
          dueDate: formattedDueDate || editTodo.dueDate,
          priority: editTodo.priority, 
          maker: editTodo.maker,
        };
        setTodolist((prevTodolist) =>
          prevTodolist.map((task) =>
            task._id === updatedTodo._id ? updatedTodo : task
          )
        );        
      } else if(response?.status === 403){
        Swal.fire({
          icon: "error",
          title: "Edit Failed",
          text: "You Unauthorized to edit todo",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred while processing your request. Please try again later.",
      });
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      style: {
        boxShadow: 'none',
      },
    }} hideBackdrop>
      <div>
        <DialogTitle>Edit Todo</DialogTitle>
      </div>
      <DialogContent style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
      >
        <div>
          <TextField
            label="Todo Name"
            fullWidth
            name="todo"
            defaultValue={todoItem?.todo}
            onChange={handleEditInputChange}
            required
          />
        </div>
        <FormControl>
          <InputLabel htmlFor="status">Status</InputLabel>
          <Select
            labelId="status"
            name= "status"
            label="status"
            defaultValue={todoItem?.status}
            onChange={handleEditInputChange}
            value={editTodo.status}
            fullWidth
            required
            >
            <MenuItem value={'in progress'}>in progress</MenuItem>
            <MenuItem value={'done'}>done</MenuItem>
          </Select>
        </FormControl>
        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Set New Due-date"
                format="yyyy-MM-dd"
                defaultValue={editTodoDueDate}
                value={newDueDate}
                onChange={handleDatePickerChange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose();
          handleCloseBackDrop();
        }}>Cancel</Button>
        <Button onClick={() => {
          handleEditSubmit();
          onClose();
          handleCloseBackDrop()
        }} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
