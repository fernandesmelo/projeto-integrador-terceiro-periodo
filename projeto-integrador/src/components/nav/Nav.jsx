import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiFileShield2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";
import { BiExit, BiMenu } from "react-icons/bi";
import { useState } from "react";
import { IoIosExit } from "react-icons/io";

const Nav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAdmin = () => {
    const role = localStorage.getItem("role");
    console.log(role);
    if (role === "ADMIN") {
      navigate("/admin/usuarios-cadastrados");
    } else {
      Swal.fire({
        icon: "warning",
        text: "Você não tem acesso a área de Admin",
        title: "Atenção",
      });
    }
  };

   const handleClick = () => {
      Swal.fire({
        title: "Tem certeza?",
        text: "Você realmente deseja sair?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, sair",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/")
        }
      });
    };

  return (
    <div>
      <div className={styles.nav}>
        <div className={styles.image}>
          <img src={logo} alt="Logo" />
        </div>
        <p
          className={styles.item}
          tabIndex={0}
          role="button"
          onClick={() => navigate("/inicio")}
        >
          <CgScreen className={styles.icon} />
          Início
        </p>
        <p
          className={styles.item}
          tabIndex={0}
          role="button"
          onClick={() => navigate("/casos")}
        >
          <RiFileShield2Fill className={styles.icon} />
          Casos Periciais
        </p>
        <p
          className={styles.item}
          tabIndex={0}
          role="button"
          onClick={handleAdmin}
        >
          <MdAdminPanelSettings className={styles.icon} />
          Admin
        </p>
        <p
          className={styles.item}
          tabIndex={0}
          role="button"
          onClick={handleClick}
        >
          <FiLogOut size={32} style={{ color: "var(--icons)" }} /> Sair
        </p>
        <p
          className={styles.itemMenu}
          tabIndex={0}
          role="button"
          onClick={toggleMenu}
        >
          <BiMenu className={styles.menuIcon} />
          {menuOpen && (
            <div className={styles.menu}>
              <a  className={styles.itemH}  onClick={() => navigate("/inicio")}>Início</a>
              <a className={styles.itemH} onClick={() => navigate("/casos")}>Casos Periciais</a>
              <a className={styles.itemH} onClick={handleAdmin}>Admin</a>
              <a className={styles.itemH} onClick={handleClick}>Sair</a>
            </div>
          )}
        </p>
      </div>
    </div>
  );
};

export default Nav;
