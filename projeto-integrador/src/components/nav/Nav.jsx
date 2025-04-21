import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiToothFill, RiFileShield2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";
import { BiMenu } from "react-icons/bi";
import { useState } from "react";

const Nav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleAdmin = () => {
    const role = localStorage.getItem("role")
    console.log(role)
    if (role === 'ADMIN') {
      navigate("/admin/usuarios-cadastrados")
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'voce nao tem acesso a area de admin',
        title: 'atencao'
      })
    }
  }

  return (
    <div>
      <div className={styles.nav}>
        <div className={styles.image}>
          <img src={logo} alt="Logo" />
        </div>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/inicio")}>
          <CgScreen size={31} strokeWidth={1} style={{ color: "var(--icons)" }} />Início
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/casos")}>
          <RiFileShield2Fill size={32} style={{ color: "var(--icons)" }} />Casos Periciais
        </p>
        <p className={styles.item} tabIndex={0} role="button">
          <RiToothFill size={32} style={{ color: "var(--icons)" }} />Banco Odonto-Legal
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={handleAdmin}>
          <MdAdminPanelSettings size={32} style={{ color: "var(--icons)" }} />Admin
        </p>
        <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate("/")}>
          <FiLogOut size={32} style={{ color: "var(--icons)" }} /> Sair
        </p>
        <p className={styles.itemMenu} tabIndex={0} role="button" onClick={toggleMenu}>
          <BiMenu size={32} style={{ color: "var(--icons)" }} />

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                width: "220px",
                right: "0",
                backgroundColor: "#000",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                zIndex: 1000
              }}
            >
              <a  className={styles.itemH}  onClick={() => navigate("/inicio")}>Início</a>
              <a className={styles.itemH} onClick={() => navigate("/casos")}>Casos Periciais</a>
              <a className={styles.itemH} >Banco Odonto-Legal</a> 
              <a className={styles.itemH} onClick={handleAdmin}>Admin</a>
              <a className={styles.itemH} onClick={() => navigate("/")}>Sair</a>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default Nav;
