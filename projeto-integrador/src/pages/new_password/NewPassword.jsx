import { useNavigate } from "react-router-dom";
import styles from "./NewPassword.module.css";
import logo from "../../assets/logo.png";
import Button from "../../components/button/Button";
import Swal from "sweetalert2";
import { useState } from "react";

const NewPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  async function handleNewPassword() {
    if (senha !== confirmaSenha) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "As senhas não coincidem!",
      });
      return;
    }

    try {
      const response = await fetch("https://sistema-odonto-legal.onrender.com/api/alter/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Nova senha cadastrada com sucesso! Aguarde o seu novo acesso ser aprovado.",
        }).then(() => {
          navigate("/");
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: data.message || "Erro ao cadastrar nova senha.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo" />
        <p className={styles.login}>Cadastre sua nova senha</p>
        <input 
          type="cpf" 
          placeholder="Email" 
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className={styles.input}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme sua senha"
          className={styles.input}
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleNewPassword}
          disabled={false}
        >
          Cadastrar nova senha
        </Button>
      </div>
    </div>
  );
};

export default NewPassword;
