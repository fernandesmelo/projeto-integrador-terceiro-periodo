import styles from "./Nav.module.css";
import { CgScreen } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiFileShield2Fill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
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

         <NavLink  
              className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link} 
              to="/inicio" 
            >
              <span className={styles.iconArea}> 
                <CgScreen size={29} className={styles.icon} />
              </span> <p className={styles.text}>Inicio</p>
            </NavLink>
             <NavLink  
              className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link} 
              to="/casos" 
            >
              <span className={styles.iconArea}>
                <RiFileShield2Fill size={29} className={styles.icon} />
              </span> <p className={styles.text}>Casos Periciais</p>
            </NavLink>
      <NavLink  
              className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link} 
              to="/vitima" 
            >
              <span className={styles.iconArea}>
                <FaUser size={26} className={styles.icon} />
              </span> <p className={styles.text}>Vitima</p>
            </NavLink>
     
    
        {isAdmin && (
         
            <NavLink  
              className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link} 
              to="/admin/usuarios-cadastrados" 
            >
              <span className={styles.iconArea}>
                <MdAdminPanelSettings className={styles.icon} />
              </span> <p className={styles.text}>Admin</p>
            </NavLink>
        
        )}

         <NavLink  
              className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link} 
              to="/" 
            >
              <span className={styles.iconArea}>
                <BiExit size={30} className={styles.icon} />
              </span> <p className={styles.text}>Sair</p>
            </NavLink>
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
    <FaUser size={23} /> Vítimas
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