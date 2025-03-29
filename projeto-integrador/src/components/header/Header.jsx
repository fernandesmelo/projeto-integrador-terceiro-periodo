import { useState } from "react";
import styles from "./Header.module.css";
import { FaBell } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Header = () => {
  const [ativarMenu, setAtivarMenu] = useState(false);

  return (
    <div className={styles.content}>
      <p>Nome do sistema</p>
      <div className={styles.info}>
        <FaBell />
        <div>
          <p className={styles.role}>Cargo</p>
          <p className={styles.name}>Nome do usuário</p>
        </div>
        <MdOutlineKeyboardArrowDown size={30} onClick={() => setAtivarMenu(!ativarMenu)} />
      </div>
    </div>
  );
};

export default Header;
