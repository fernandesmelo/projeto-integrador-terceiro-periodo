import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiFileShield2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";
import { BiExit, BiMenu } from "react-icons/bi";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";

const Nav = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "ADMIN");
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAdmin = () => {
    navigate("/admin/usuarios-cadastrados");
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
        navigate("/");
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
          onClick={() => navigate("/vitima")}
          
        >
          <FaUser className={styles.icon} size={26}/> Banco de dados da vitima
        </p>
        {isAdmin && (
          <p
            className={styles.item}
            tabIndex={0}
            role="button"
            onClick={handleAdmin}
          >
            <MdAdminPanelSettings className={styles.icon} />
            Admin
          </p>
        )}
        <p
          className={styles.item}
          tabIndex={0}
          role="button"
          onClick={handleClick}
        >
          <BiExit size={32} style={{ color: "var(--icons)" }} /> Sair
        </p>
       {/* Botão de abrir menu */}
<p
  className={styles.itemMenu}
  tabIndex={0}
  role="button"
  onClick={toggleMenu}
>
  <BiMenu className={styles.menuIcon}  />
</p>

{/* Menu deslizante animado */}
<div className={`${styles.menu} ${menuOpen ? styles.ativo : styles.inativo}`}>
  <div className={styles.headerMenu}>
    <p className={styles.title}>Dentalisys</p>
    <BiMenu
      className={styles.menuIcon}
      style={{ color: "var(--white)" }}
      onClick={toggleMenu} // Esse fecha o menu
    />
  </div>
  <a className={styles.itemH} onClick={() => navigate("/inicio")}>
    <CgScreen size={26} /> Início
  </a>
  <a className={styles.itemH} onClick={() => navigate("/casos")}>
    <RiFileShield2Fill size={25} /> Casos Periciais
  </a>
  <a className={styles.itemH} onClick={() => navigate("/vitima")}>
    <FaUser size={23} /> Banco de dados da vítima
  </a>
  {isAdmin && (
    <a className={styles.itemH} onClick={handleAdmin}>
      <MdAdminPanelSettings size={27} /> Admin
    </a>
  )}
  <a className={styles.itemH} onClick={handleClick}>
    <BiExit size={25} /> Sair
  </a>
  <img className={styles.imageMenu} src={logo} alt="logo" />
</div>
      </div>
    </div>
  );
};

export default Nav;