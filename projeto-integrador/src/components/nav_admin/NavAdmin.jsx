import { useNavigate } from "react-router-dom";
import styles from "./NavAdmin.module.css";

const NavAdmin = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.nav}>
        <p className={styles.item}>Solicitações</p>
        <p className={styles.item} onClick={() => navigate("/cadastrar-usuario")}>Cadastrar usuário</p>
        <p className={styles.item} onClick={() => navigate("/inicio")}>Voltar</p>
      </div>
    </div>
  );
};

export default NavAdmin;
