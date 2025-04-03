import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import HomePage from "./pages/home_page/HomePage";
import NewPassword from "./pages/new_password/NewPassword";
import AdminRequest from "./pages/admin_request/AdminRequest";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/nova-senha" element={<NewPassword />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/administrador-do-sistema" element={<AdminRequest />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
