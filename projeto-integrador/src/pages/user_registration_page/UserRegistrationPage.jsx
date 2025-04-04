import { useState } from "react";
import Header from "../../components/header/Header";
import NavAdmin from "../../components/nav_admin/NavAdmin";
import styles from "./UserRegistrationPage.module.css";

const UserRegistrationPage = () => {

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDate] = useState('')
    const [cpf, setCpf] = useState('')
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [road, setRoad] = useState('')
    const [number, setNumber] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [cep, setCep] = useState('')
    const [complement, setComplement] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const dados = {
            name,
            lastName,
            email,
            dateOfBirth: date,
            cpf,
            role,
            password,
            address: {
                street: road,
                houseNumber: number,
                district: neighborhood,
                city,
                state
            }
        };

        console.log('Payload enviado pro back:', dados); // 👈 debug

        try {
            const response = await fetch('https://sistema-odonto-legal.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Cadastro realizado com sucesso!', result);
            } else {
                console.error('❌ Erro no cadastro. Resposta do back:', result);
            }

        } catch (err) {
            console.error('🚨 Erro na requisição:', err);
        }
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.nav_container}>
                <NavAdmin />
                <div className={styles.user_registration}>
                    <h3>Insira as informações do usuário</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insira o nome completo"
                            className={styles.input}
                        />
                         <label htmlFor="lastName">Sobrenome:</label>
                        <input
                            type="text"
                            placeholder="Sobrenome"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={styles.input}
                        />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Insira o email"
                            className={styles.input}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <input
                            type="date"
                            id="dataNascimento"
                            className={styles.input}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <label htmlFor="cpf">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            placeholder="Insira o CPF"
                            className={styles.input}
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                        <label htmlFor="cargo">Cargo:</label>
                        <select
                            id="cargo"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={styles.input}
                        >
                            <option value="">Selecione o cargo</option>
                            <option value="ADMIN">Admin</option>
                            <option value="ASSISTENTE">Assistente</option>
                            <option value="PERITO">Perito</option>
                        </select>
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            placeholder="Insira a senha"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="confirmarSenha">Confirme a senha:</label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme a senha"
                            className={styles.input}
                        />
                        <label htmlFor="rua">Rua:</label>
                        <input
                            type="text"
                            id="rua"
                            placeholder="Insira a rua"
                            value={road}
                            onChange={(e) => setRoad(e.target.value)}
                            className={styles.input}
                        />
                        <label htmlFor="numero">Número:</label>
                        <input
                            type="number"
                            id="numero"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Insira o número"
                            className={styles.input}
                        />
                        <label htmlFor="bairro">Bairro:</label>
                        <input
                            type="text"
                            id="bairro"
                            placeholder="Insira o bairro"
                            className={styles.input}
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                        />
                        <label htmlFor="cidade">Cidade:</label>
                        <input
                            type="text"
                            id="cidade"
                            placeholder="Insira a cidade"
                            className={styles.input}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <label htmlFor="estado">Estado:</label>
                        <input
                            type="text"
                            id="estado"
                            placeholder="Insira o estado"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={styles.input}
                        />
                        <label htmlFor="cep">CEP:</label>
                        <input
                            type="text"
                            id="cep"
                            placeholder="Insira o CEP"
                            className={styles.input}
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                        />
                        <label htmlFor="complemento">Complemento:</label>
                        <input
                            type="text"
                            id="complemento"
                            placeholder="Insira o complemento"
                            className={styles.input}
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                        />
                        <button type="submit" className={styles.button}>Cadastrar</button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default UserRegistrationPage;