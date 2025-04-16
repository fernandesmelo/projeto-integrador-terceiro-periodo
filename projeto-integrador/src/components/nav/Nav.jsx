import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiToothFill, RiFileShield2Fill } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Nav = ({ onBack }) => {
  const navigate = useNavigate();

  function handleAdmin() {
    navigate("/cadastrar-usuario");
  }

  return (
    <div>
      <div className={styles.nav}>
        <div className={styles.image}>
          <img src={logo} alt="Logo" />
        </div>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/inicio")}>
            <CgScreen size={31} strokeWidth={1} style={{ color: "var(--icons)" }}/>Início
        </p>
        <p onClick={() => navigate("/casos")} className={styles.item} tabIndex={0} role="button">
            <RiFileShield2Fill size={32} style={{ color: "var(--icons)" }} />Casos Periciais
        </p>
        <p className={styles.item} tabIndex={0} role="button">
            <RiToothFill size={32} style={{ color: "var(--icons)" }} />Banco Odonto-Legal
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={handleAdmin}>
            <MdAdminPanelSettings size={32} style={{ color: "var(--icons)" }} />Admin
        </p>
        <p className={styles.back} tabIndex={0} role="button" onClick={onBack}>
            <IoArrowBack size={32} style={{ color: "var(--icons)" }} /> Voltar
        </p>
      </div>
    </div>
  );
};

export default Nav;
