import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppstoreOutlined, FormOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";
import AddLeads from "./Components/Leads/AddLeads";
import GetLeads from "./Components/Leads/GetLeads";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import { logout } from "./features/auth/authSlice"; // Import the logout action

const App = () => {
  const [current, setCurrent] = useState("home");
  const token = useSelector((state) => state.auth.token); // Get token from state
  const dispatch = useDispatch();

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  useEffect(() => {
  }, [token])
  

  return (
    <Router>
      {token && ( // Conditionally render Navbar if the user is logged in
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="home" icon={<FormOutlined />}>
            <Link to="/">Create Leads</Link>
          </Menu.Item>
          <Menu.Item key="getLeads" icon={<AppstoreOutlined />}>
            <Link to="/getLeads">View Leads</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createLeads" element={<ProtectedRoute><AddLeads /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><GetLeads /></ProtectedRoute>} />
        <Route path="*" element={token ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;