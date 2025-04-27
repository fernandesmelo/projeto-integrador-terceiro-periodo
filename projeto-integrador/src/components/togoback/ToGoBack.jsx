import styles from "./ToGoBack.module.css";
import { FaArrowLeftLong } from "react-icons/fa6";

const ToGoBack = ({ onClick }) => {
  const handleClick = () => {
    onClick();
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