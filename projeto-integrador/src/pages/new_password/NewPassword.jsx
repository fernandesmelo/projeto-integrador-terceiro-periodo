import styles from './NewPassword.module.css';

const NewPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.login}>Login</h2>

        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Senha" className={styles.input} />
        <input type="password" placeholder="Nova Senha" className={styles.input} />

        <button 
          className={styles.button}
        >
            Entrar
        </button>
      </div>
    </div>
  );
}

export default NewPassword;