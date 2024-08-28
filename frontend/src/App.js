import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { AppstoreOutlined, FormOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import AddLeads from "./Components/Leads/AddLeads";
import GetLeads from "./Components/Leads/GetLeads";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/ProtectedRoute";

const items = [
  {
    label: <Link to="/">Create Leads</Link>,
    key: "home",
    icon: <FormOutlined />,
  },
  {
    label: <Link to="/getLeads">View Leads</Link>,
    key: "getLeads",
    icon: <AppstoreOutlined />,
  },
];

const App = () => {
  const [current, setCurrent] = useState("home");
  const token = useSelector((state) => state.auth.token);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Router>
      {token && (
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          style={{ borderBottom: "none" }} // Removes the blue border
        />
      )}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><AddLeads /></ProtectedRoute>} />
          <Route 
            path="/getLeads" 
            element={
              <ProtectedRoute>
                <GetLeads key={current} />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} /> {/* Public route for Login */}
          <Route 
            path="*"
            element={token ? <Navigate to="/" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;