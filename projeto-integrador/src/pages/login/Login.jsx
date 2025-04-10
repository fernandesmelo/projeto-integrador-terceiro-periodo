import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";

const API_URL = "https://sistema-odonto-legal.onrender.com/api/login";

const Login = () => {
  const [role, setRole] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!role || !cpf || !password) {
      Swal.fire("Erro!", "Preencha todos os campos!", "error");
      return;
    }

    Swal.fire({
      title: "Entrando...",
      text: "Verificando credenciais.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(API_URL, {
        cpf,
        password,
        role: role.toUpperCase(), // 🔥 Corrigindo o problema
      });
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toUpperCase());
      Swal.fire("Sucesso!", "Login bem-sucedido!", "success");
      navigate("/inicio");
    } catch (error) {
      console.error("Erro no login", error.response?.data || error);
      Swal.fire(
        "Erro!",
        "Erro ao fazer login. Verifique suas credenciais.",
        "error"
      );
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo" />
        <h3>Nome do sistema</h3>

        <p>Faça login</p>
        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="perito">PERITO</option>
          <option value="admin">ADMIN</option>
          <option value="assistente">ASSISTENTE</option>
        </select>

        <input
          type="number"
          placeholder="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button} onClick={handleLogin}>
          Entrar
        </button>
        <Link to="/about" className={styles.link}>
          Esqueceu a senha?
        </Link>
      </div>
    </div>
  );
};

export default Login;
