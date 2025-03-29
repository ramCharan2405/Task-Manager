import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";

import Login from "./pages/Auth/Login";

import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import Dashboard from "./pages/Admin/Dashboard";
import UserDashBoard from "./pages/User/UserDashBoard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./pages/Admin/PrivateRoute";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashBoard/>} />
            <Route path="/user/my-tasks" element={<MyTasks/>} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails/>} />
          
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
