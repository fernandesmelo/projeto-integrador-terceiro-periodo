import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { FaBell } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import axios from "axios";

const API_URL = "https://sistema-odonto-legal.onrender.com/api/profile";

const Header = () => {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUserData(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error("Erro ao buscar os dados do perfil", error);
        setLoading(false);
        alert("Erro ao buscar os dados.");
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.content}>
      <p>Bem-vindo(a) ao Dentalysis</p>
      <div className={styles.info}>
        <FaBell />
        <div>
          <p className={styles.role}>{userData.role}</p>
          <p className={styles.name}>{userData.name}</p>
        </div>
        <MdOutlineKeyboardArrowDown size={30} />
      </div>
    </div>
  );
};

export default Header;
