import Swal from "sweetalert2";
import styles from "./Nav2.module.css";

const Nav2 = ({ content, onClick }) => {
  const handleClick = () => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você realmente deseja voltar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1E88E5",
      cancelButtonColor: "#EB5757",
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
        <a onClick={handleClick}>{content}</a>
      </nav>
      <hr />
    </div>
  );
};

export default Nav2;
