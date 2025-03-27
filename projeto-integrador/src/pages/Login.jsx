import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css'

const Login = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate()

  function handleLogin() {
    navigate('/Inicio')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login</h2>

        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="perito">Perito</option>
          <option value="admin">Admin</option>
          <option value="assistente">Assistente</option>
        </select>

        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Senha" className={styles.input} />

        <button 
          className={styles.button}
          onClick={handleLogin}
        >
            Entrar
        </button>
        <Link to="/about" className={styles.link}>Esqueceu a senha?</Link>
      </div>
    </div>
  );
};

export default Login;