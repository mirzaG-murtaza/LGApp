import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppstoreOutlined, FormOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import AddLeads from "./Components/Leads/AddLeads";
import GetLeads from "./Components/Leads/GetLeads";

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

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Router>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <Routes>
        <Route path="/" element={<AddLeads />} />
        <Route path="/getLeads" element={<GetLeads key={current} />} />
      </Routes>
    </Router>
  );
};

export default App;
