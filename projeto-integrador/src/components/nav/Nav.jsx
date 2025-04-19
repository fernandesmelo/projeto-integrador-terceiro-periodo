import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiToothFill, RiFileShield2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.nav}>
        <div className={styles.image}>
          <img src={logo} alt="Logo" />
        </div>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/inicio")}>
            <CgScreen size={31} strokeWidth={1} style={{ color: "var(--icons)" }}/>Início
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/casos")}>
            <RiFileShield2Fill size={32} style={{ color: "var(--icons)" }} />Casos Periciais
        </p>
        <p className={styles.item} tabIndex={0} role="button">
            <RiToothFill size={32} style={{ color: "var(--icons)" }} />Banco Odonto-Legal
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/cadastrar-usuario")}>
            <MdAdminPanelSettings size={32} style={{ color: "var(--icons)" }} />Admin
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/")}>
          <FiLogOut size={32} style={{ color: "var(--icons)" }} /> Sair
        </p>
      </div>
    </div>
  );
};

export default Nav;
