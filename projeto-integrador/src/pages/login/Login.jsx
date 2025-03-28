import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/Inicio");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="#" alt="Logo" />
        <h3>Nome do sistema</h3>
        <p>Faça login</p>
        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Selecione o cargo</option>
          <option value="perito">Admin</option>
          <option value="admin">Assistente</option>
          <option value="assistente">Perito</option>
        </select>
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Senha" className={styles.input} />
        <button className={styles.button} onClick={handleLogin}>
          Entrar
        </button>
        <Link to="/nova-senha" className={styles.link}>
          Esqueceu a senha?
        </Link>
      </div>
    </div>
  );
};

export default Login;
