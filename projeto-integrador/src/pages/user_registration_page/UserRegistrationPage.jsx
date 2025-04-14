import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./UserRegistrationPage.module.css";

const UserRegistrationPage = () => {

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [cpf, setCpf] = useState('')
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [road, setRoad] = useState('')
    const [houseNumber, setHouseNumber] = useState(0)
    const [neighborhood, setNeighborhood] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [cep, setCep] = useState('')
    const [complement, setComplement] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const [year, month, day] = dateOfBirth.split("-");  // Divide a data no formato YYYY-MM-DD

    // Formata a data no formato DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;


        const dados = {
            name,
            lastName,
            email,
            dateOfBirth : formattedDate,
            cpf,
            role,
            password,
            address: {
                street: road,
                houseNumber,
                district: neighborhood,
                city,
                zipCode: cep,
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
                <Nav />
                <div className={styles.user_registration}>
                    <h3>Insira as informações do usuário</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Nome:</label>
                        <div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Insira o nome completo"
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="lastName">Sobrenome:</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Sobrenome"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="email">Email:</label>
                        <div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder="Insira o email"
                                className={styles.input}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <div>
                            <input
                                type="date"
                                id="dataNascimento"
                                className={styles.input}
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <label htmlFor="cpf">CPF:</label>
                        <div>
                            <input
                                type="text"
                                id="cpf"
                                placeholder="Insira o CPF"
                                className={styles.input}
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                        </div>
                        <label htmlFor="cargo">Cargo:</label>
                        <div>
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
                        </div>
                        <label htmlFor="senha">Senha:</label>
                        <div>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Insira a senha"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <label htmlFor="confirmarSenha">Confirme a senha:</label>
                        <div>
                            <input
                                type="password"
                                id="confirmarSenha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirme a senha"
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="rua">Rua:</label>
                        <div>
                            <input
                                type="text"
                                id="rua"
                                placeholder="Insira a rua"
                                value={road}
                                onChange={(e) => setRoad(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="numero">Número:</label>
                        <div>
                            <input
                                type="number"
                                id="numero"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(Number(e.target.value))}
                                placeholder="Insira o número"
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="bairro">Bairro:</label>
                        <div>
                            <input
                                type="text"
                                id="bairro"
                                placeholder="Insira o bairro"
                                className={styles.input}
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                            />
                        </div>
                        <label htmlFor="cidade">Cidade:</label>
                        <div>
                            <input
                                type="text"
                                id="cidade"
                                placeholder="Insira a cidade"
                                className={styles.input}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <label htmlFor="estado">Estado:</label>
                        <div>
                            <input
                                type="text"
                                id="estado"
                                placeholder="Insira o estado"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <label htmlFor="cep">CEP:</label>
                        <div>
                            <input
                                type="text"
                                id="cep"
                                placeholder="Insira o CEP"
                                className={styles.input}
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                            /> 
                        </div>
                        <label htmlFor="complemento">Complemento:</label>
                        <div>
                            <input
                                type="text"
                                id="complemento"
                                placeholder="Insira o complemento"
                                className={styles.input}
                                value={complement}
                                onChange={(e) => setComplement(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles.button}>Cadastrar</button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default UserRegistrationPage;