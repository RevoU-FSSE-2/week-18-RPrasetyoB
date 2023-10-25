import React, { ReactEventHandler, useContext, useEffect, useState } from "react";
import { Button, Table, TableBody, TableContainer, TableHead, TableRow, Typography, dividerClasses } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useGetToken, useAuthChecker } from "../../hook";
import { StyledTableCell, StyledTableRow, mainDivStyle, secondSubStyle, subDivStyle, subDivStyleMobile, mainDivStyleMobile } from "../../component/TableStyle";
import { AppContext } from "../../provider/AppProvider";
import useFetchApi from "../../utils/FetchApi";
import Swal from "sweetalert2";
import { Card, CardContent } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import  EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format } from 'date-fns';
import Backdrop from '@mui/material/Backdrop';
import { EditModal } from "../../component";

interface Todo {
  _id: string;
  todo:string;
  dueDate:string;
}

const TableList: React.FC = () => {
  const token = useGetToken();
  useAuthChecker(token);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchList, deleteTask, handleLogout } = useFetchApi();
  const { todolist, setTodolist } = useContext(AppContext);
  const initialCheckedState = todolist.map((todo) => todo.status === 'done');
  const [checked, setChecked] = useState(initialCheckedState);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState({ _id: "", todo: "", dueDate: "" });
  const openEditModal = () => {
    setEditModalOpen(true);
  };
  
  const getList = async () => {
    const response = await fetchList();
    if (response?.ok) {
      const data = await response.json();
      console.log('data',data )
      setTodolist(data.result.data);
      const newData = data.result.data;
      const newCheckedState = newData.map((todo: any) => todo.status === 'done');
      setChecked(newCheckedState);
      setTodolist(newData);
    } else {
      console.error("Failed to fetch categories");
    }
  };
  
  useEffect(() => {
    getList();
  }, []);
  
  const deleteList = async (id: string) => {
    const response = await deleteTask(id);
    if (response?.ok) {
      setTodolist((categories) =>
        categories.filter((category) => category._id !== id)
      );
      Swal.fire({
        icon: "success",
        title: "Task Delete",
        text: "Successfully deleting task",
      });
    } else if (response?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "You don't have authorization to delete the current task",
      });
    }
  };
  
  const handleToggle = (value: number) => () => {
    const newChecked = [...checked];
    newChecked[value] = !newChecked[value];
    setChecked(newChecked);
  };
  
  const formatDueDate = (dueDate: string) => {
    const parsedDueDate = new Date(dueDate);
    parsedDueDate.setDate(parsedDueDate.getDate());
    return format(parsedDueDate, 'MMM dd');
  };


  const handleEditInputChange = (event: any) => {
    const { name, value } = event.target;
    setEditTodo({
      ...editTodo,
      [name]: value,
    });
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleOpenBackdrop = () => {
    setOpenBackdrop(true);
  };

  const editClick = (todo: Todo) => {
    setEditTodo({_id: todo._id, todo: todo.todo, dueDate: todo.dueDate})
    handleOpenBackdrop()
    openEditModal()
  }

  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobileView = windowWidth < 450;

  return (
    <div style={isMobileView ? mainDivStyleMobile : mainDivStyle}>
      <div style={subDivStyle}>
        <List sx={{ width: '100%', minWidth: 450, bgcolor: 'background.paper', margin: 'auto', borderRadius: 5 }}>
          <table style={{ width: '95%', overflow: 'auto' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width:"40%", paddingLeft:50}}>Task</th>
                <th style={{ textAlign: 'center', width:"20%", paddingRight:10 }}>Priority</th>
                <th style={{ textAlign: 'center', width:"20%" }}>DueDate</th>
                <th style={{ textAlign: 'center', width:"20%" }}>Maker</th>
                <th style={{ textAlign: 'center', width:"20%" }}>&nbsp;Action</th>
              </tr>
            </thead>
            <tbody>
              {todolist.map((todo, index) => {
                const labelId = `checkbox-list-label-${todo._id}`;
                const priorityColorStyle = {
                  color: todo.priority === 'high' ? 'red' :
                    todo.priority === 'medium' ? 'orange' : 'black'
                };
                const priorityBGstyle = {
                  background: todo.priority === 'high' ? 'red' :
                    todo.priority === 'medium' ? 'orange' : 'black'
                };

                return (
                  <tr key={todo._id}>
                    <td>
                      <ListItem disablePadding>
                        <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked[index]}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            style={{ ...priorityColorStyle, textDecoration: checked[index] ? 'line-through' : '' }}
                            id={labelId}
                            primary={todo.todo}
                          />
                        </ListItemButton>
                      </ListItem>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ ...priorityBGstyle, color: 'white', padding: 5, paddingTop: 2, borderRadius: 10, textDecoration: checked[index] ? 'line-through' : '', marginRight: 20 }}>{todo.priority}</span>
                    </td>
                    <td style={{ textDecoration: checked[index] ? 'line-through' : '', paddingLeft: 5}}>{formatDueDate(todo.dueDate)}</td>
                    <td style={{ textDecoration: checked[index] ? 'line-through' : '', paddingLeft: 5}}>{todo.maker}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton edge="end" onClick={() => editClick(todo)}>
                          <EditTwoToneIcon />
                        </IconButton>
                        <EditModal
                          open={editModalOpen}
                          onClose={() => setEditModalOpen(false)}
                          editTodo={editTodo}
                          handleEditInputChange={handleEditInputChange}
                          handleCloseBackDrop={handleCloseBackdrop}/>
                        <IconButton edge="end">
                          <DeleteTwoToneIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </List>
      </div>
      <Backdrop
        sx={{ color: "black", zIndex: (theme:any) => theme.zIndex.drawer + 0.5 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      ></Backdrop>
    </div>
  );
};

export default TableList;
