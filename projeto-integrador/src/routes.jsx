import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import HomePage from "./pages/home_page/HomePage";
import NewPassword from "./pages/new_password/NewPassword";
import UserRegistrationPage from "./pages/admin/UserRegistrationPage";
import Cases from "./pages/cases/Cases";
import CaseCreated from "./pages/cases/CaseCreated";
import CaseDetails from "./pages/cases/CaseDetails";
import EvidenceRegistrationPage from "./pages/evidence_registration_page/EvidenceRegistrationPage";
import UsersAdmin from "./pages/admin/UsersAdmin";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/nova-senha" element={<NewPassword />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/admin/cadastrar-usuario" element={<UserRegistrationPage />}/>
        <Route path="/casos" element={<Cases />}/>
        <Route path="/casos/cadastrar" element={<CaseCreated />}/>
        <Route path="/casos/detalhes/:protocol" element={<CaseDetails />}/>
        <Route path="/casos/evidencia/:protocol" element={<EvidenceRegistrationPage />}/>
        <Route path="/admin/usuarios" element={<UsersAdmin/>}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;