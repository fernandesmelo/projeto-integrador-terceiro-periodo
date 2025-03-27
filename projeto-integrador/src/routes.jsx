import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import NewPassword from "./pages/NewPassword";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/nova-senha" element={<NewPassword />} />
        <Route path="/inicio" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
