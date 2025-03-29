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
                    <h3>Insira as informações do usuário</h3>
                    <label htmlFor="name">Nome:</label>
                    <input type="text" id="name" placeholder="Insira o nome completo" className={styles.input}/>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Insira o email" className={styles.input}/>
                    <label htmlFor="dataNascimento">Data de Nascimento:</label>
                    <input type="date" id="dataNascimento" className={styles.input}/>
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" placeholder="Insira o CPF" className={styles.input}/>
                    <label htmlFor="cargo">Cargo:</label>
                    <select id="cargo" className={styles.input}>
                        <option value="">Selecione o cargo</option>
                        <option value="admin">Admin</option>
                        <option value="assistente">Assistente</option>
                        <option value="perito">Perito</option>
                    </select>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" placeholder="Insira a senha" className={styles.input}/>
                    <label htmlFor="confirmarSenha">Confirme a senha:</label>
                    <input type="password" id="confirmarSenha" placeholder="Confirme a senha" className={styles.input}/>
                    <label htmlFor="rua">Rua:</label>
                    <input type="text" id="rua" placeholder="Insira a rua" className={styles.input} />
                    <label htmlFor="numero">Número:</label>
                    <input type="text" id="numero" placeholder="Insira o número" className={styles.input}/>
                    <label htmlFor="bairro">Bairro:</label>
                    <input type="text" id="bairro" placeholder="Insira o bairro" className={styles.input}/>
                    <label htmlFor="cidade">Cidade:</label>
                    <input type="text" id="cidade" placeholder="Insira a cidade" className={styles.input}/>
                    <label htmlFor="estado">Estado:</label>
                    <input type="text" id="estado" placeholder="Insira o estado" className={styles.input}/>
                    <label htmlFor="cep">CEP:</label>
                    <input type="text" id="cep" placeholder="Insira o CEP" className={styles.input}/>
                    <label htmlFor="complemento">Complemento:</label>
                    <input type="text" id="complemento" placeholder="Insira o complemento" className={styles.input}/>
                </div>
            </div>
        </div>
    )
}

export default UserRegistrationPage;