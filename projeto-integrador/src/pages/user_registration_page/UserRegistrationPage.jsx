import Header from "../../components/header/Header";
import NavAdmin from "../../components/nav_admin/NavAdmin";
import styles from "./UserRegistrationPage.module.css";

const UserRegistrationPage = () => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.nav_container}>
                <NavAdmin />
                <div className={styles.user_registration}>
                    <h3>Insira as informações de perfil</h3>
                    <label htmlFor="name">Nome:</label>
                    <input type="text" id="name" placeholder="Insira o nome completo" className={styles.imput}/>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Insira o email" className={styles.imput}/>
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input type="date" id="dataNascimento" className={styles.imput}/>
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" placeholder="Insira o CPF" className={styles.imput}/>
                    <label htmlFor="cargo">Cargo:</label>
                    <select id="cargo" className={styles.imput}>
                        <option value="">Selecione o cargo</option>
                        <option value="admin">Admin</option>
                        <option value="assistente">Assistente</option>
                        <option value="perito">Perito</option>
                    </select>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" placeholder="Insira a senha" className={styles.imput}/>
                    <label htmlFor="confirmarSenha">Confirme a senha:</label>
                    <input type="password" id="confirmarSenha" placeholder="Confirme a senha" className={styles.imput}/>
                </div>
            </div>
        </div>
    )
}

export default UserRegistrationPage;