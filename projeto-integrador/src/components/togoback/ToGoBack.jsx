import Swal from "sweetalert2";
import styles from "./ToGoBack.module.css";
import { FaArrowLeftLong } from "react-icons/fa6";

const ToGoBack = ({ onClick }) => {
  const handleClick = () => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você realmente deseja voltar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, voltar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onClick();
      }
    });
  };

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <a onClick={handleClick}>
          <FaArrowLeftLong size={22} />
        </a>
      </nav>
    </div>
  );
};

export default ToGoBack;
