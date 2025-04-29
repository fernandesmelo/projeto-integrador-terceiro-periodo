import { useNavigate } from "react-router-dom";
import styles from "./NewPassword.module.css";
import logo from "../../assets/logo.png";
import Button from "../../components/button/Button";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";

const NewPassword = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");  // Alterado de "email" para "cpf"
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
      await axios.post("https://sistema-odonto-legal.onrender.com/api/alter/password", {
        cpf: cpf,
        password: senha,
      });

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Nova senha cadastrada com sucesso! Aguarde o seu novo acesso ser aprovado.",
      }).then(() => {
        navigate("/");
      });

    } catch (error) {
      const message = error.response?.data?.message || "Erro ao cadastrar nova senha.";
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: message,
      });
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo" />
        <p className={styles.login}>Cadastre sua nova senha</p>
        <input
          type="text"  // Alterado de "cpf" para "text", porque estamos lidando com o CPF, que é um número
          placeholder="CPF"
          className={styles.input}
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}  // Atualizado para "cpf"
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