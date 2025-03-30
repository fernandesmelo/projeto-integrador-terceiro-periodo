import styles from "./RegisterButton.module.css";

interface RegisterButtonProps {
  onClick?: () => void;
  label?: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick, label = "Cadastrar" }) => {
  return (
    <button className={styles.registerButton} onClick={onClick}>
      {label}
    </button>
  );
}

export default RegisterButton;