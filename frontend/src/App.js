import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppstoreOutlined, FormOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";
import AddLeads from "./Components/Leads/AddLeads";
import GetLeads from "./Components/Leads/GetLeads";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import { logout } from "./features/auth/authSlice";
import ViewLeads from "./Components/Leads/ViewLeads";
import EditLeads from "./Components/Leads/EditLead";

const App = () => {
  const [current, setCurrent] = useState("home");
  const token = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const locToken = localStorage.getItem('token')

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if(!locToken){
      dispatch(logout());
    }
  }, [locToken, dispatch])
  

  useEffect(() => {
    console.log('Token in app.js', token)
}, [token])
  

  return (
    <Router>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="home" icon={<FormOutlined />}>
            <Link to="/">Create Leads</Link>
          </Menu.Item>
          
          <Menu.Item key="allLeads" icon={<AppstoreOutlined />}>
          <Link to="/viewLeads">View Leads</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AddLeads /></ProtectedRoute>} />
        <Route path="/viewLeads" element={<ProtectedRoute><ViewLeads /></ProtectedRoute>} />
        <Route path="/getLeads" element={<ProtectedRoute><GetLeads /></ProtectedRoute>} />
        <Route path="/getLeads" element={<ProtectedRoute><EditLeads /></ProtectedRoute>} />
        <Route path="*" element={token ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;