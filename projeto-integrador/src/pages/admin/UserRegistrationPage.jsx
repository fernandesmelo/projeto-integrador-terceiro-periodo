import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./UserRegistrationPage.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Nav2 from "../../components/nav2/Nav2";


const UserRegistrationPage = () => {

    const [name, setName] = useState('')
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
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const [year, month, day] = dateOfBirth.split("-");  // Divide a data no formato YYYY-MM-DD

        // Formata a data no formato DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;


        const dados = {
            name,
            email,
            dateOfBirth: formattedDate,
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
                Swal.fire({
                    icon: 'confirm',
                    text: 'Cadastro realizado com sucesso!',
                    title: 'Sucesso!'
                })
                console.log('✅ Cadastro realizado com sucesso!', result);
                navigate('/admin/usuarios-cadastrados')
            } else {
                console.error('❌ Erro no cadastro. Resposta do back:', result);
                Swal.fire({
                    text: 'erro no cadastro!',
                    icon: 'error',
                    title: 'Erro!'
                })
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
                    <div className={styles.registration}>
                        <h3>Insira as informações do usuário</h3>
                        <Nav2 onClick={() => navigate(-1)} content='voltar' />

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
                                    required

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
                                    required

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
                                    required
                                    max={new Date().toISOString().split("T")[0]} // Impede datas futuras
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
                                    required
                                    pattern="\d{11}" // Só aceita 11 dígitos
                                    title="Digite um CPF válido com 11 números"
                                    maxLength={11}

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
                                    required
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
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="state">Estado:</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={state}
                                    required
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="">Selecione um estado</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>

                                </select>


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
                                    required

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
            </div >
        </div >
    )
}

export default UserRegistrationPage;