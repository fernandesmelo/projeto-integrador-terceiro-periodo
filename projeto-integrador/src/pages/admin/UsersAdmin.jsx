import { useNavigate } from "react-router-dom"
import Button from "../../components/button/Button"
import Header from "../../components/header/Header"
import Nav from "../../components/nav/Nav"
import TableUsers from "../../components/tableUsers/TableUsers"
import styles from "./UsersAdmin.module.css"
import { useEffect, useState } from "react"
import axios from "axios"

const UsersAdmin = () => {
    const url = 'https://sistema-odonto-legal.onrender.com/api/search/all'
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; // define quantos usuários por página

    // Calcular os índices de corte
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Mudar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
                setUsers(response.data)
                console.log(users)
            } catch (err) {
                console.error('erro na busca ', err)
            }
        }
        getUsers()
    }, [])

    return (
        <div>
            <Header />
            <div className={styles.content}>
                <Nav />
                <div className={styles.contentDiv}>
                    <h1 className={styles.title}>Usuarios cadastrados</h1>
                    <Button onClick={() => navigate('/admin/cadastrar-usuario')}>Cadastrar usuario</Button>
                    <TableUsers users={currentUsers} />
                    <div className={styles.pagination}>
                    {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={i + 1 === currentPage ? styles.activePage : ""}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                </div>

            </div>
        </div>
    )
}

export default UsersAdmin