import { useNavigate } from "react-router-dom";
import styles from "./NewPassword.module.css";
import logo from "../../assets/logo.png";

const NewPassword = () => {
  const navigate = useNavigate();

  function handleNewPassword() {
    alert("Nova senha cadastrada com sucesso! Aguarde o seu novo acesso ser aprovado.");
    navigate("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
      <img src={logo} alt="Logo" />
        <p className={styles.login}>Cadastre sua nova senha</p>
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Senha" className={styles.input} />
        <input
          type="password"
          placeholder="Confirme sua senha"
          className={styles.input}
        />
        <button className={styles.button} onClick={handleNewPassword}>Cadastrar</button>
      </div>
    </div>
  );
};

export default NewPassword;