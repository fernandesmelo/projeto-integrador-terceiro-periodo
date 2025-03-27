import styles from './NewPassword.module.css';
import Header from '../components/Header';

const NewPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Header/>
        <h2>Login</h2>

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