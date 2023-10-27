## Postmant API documentation

- Documentation link:  https://us-central1-milestone3-rpb.cloudfunctions.net/milestone3_rpb](https://www.postman.com/interstellar-escape-967474/workspace/rpb-mileston-3/documentation/29092304-86a6992f-527d-4aa6-b837-a2eaacb35cdc)

- Fork documentation

- Set variable {{based_url}} to:  https://us-central1-milestone3-rpb.cloudfunctions.net/milestone3_rpb

- Consume the API

## ## API End Point

|                                                                    | Endpoint               | Req body                  | Authorization |
|:------------------------------------------------------------------ |:----------------------:|:-------------------------:|:-------------:|
| Login                                                              | POST<br>/v1/auth/login    | username, password        | -             |
| Register                                                           | POST<br>/v1/auth/register | username, Email, password | -             |
| Get all todolist (admin)<br/>Get logged in user's todolist (guest) | GET<br/>/v1/todos      | -                         | by role       |
| Add new todo                                                       | POST<br/>/v1/todos     | todo, priority            | -             |
| Update todo                                                        | PUT<br/>/v1/todos/:id  | todo, status, dueDate     | by username   |
| Delete todo                                                        | DEL<br/>/v1/todos/:id  |                           | by username   |

## Back-end Authorization

#### By Role :

```js
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
```

#### By Username :

- update Todolist authorization

```js
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
```

## Security test

- Front-end :
  
  ![2023-10-27-12-08-11-image.png](D:\bootcamp-revou\week18%20ML3\week-18-RPrasetyoB\assets\img\README\2023-10-27-12-08-11-image.png)

- Back-end:
  
  ![2023-10-27-12-08-59-image.png](D:\bootcamp-revou\week18%20ML3\week-18-RPrasetyoB\assets\img\README\2023-10-27-12-08-59-image.png)
  
  ## Users for test

- admin
  
  ```json
  {
  "username":"rpb"
  "password":"rpb123"
  }
  ```

- guest
  
  ```json
  {
  "username":"rpb2"
  "password":"rpb123"
  }
  ```
  
  ## Deployment

- Front-end: https://milestone3-rpb.web.app

- Back-end: https://us-central1-milestone3-rpb.cloudfunctions.net/milestone3_rpb

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/-Z3-Ss4P)
