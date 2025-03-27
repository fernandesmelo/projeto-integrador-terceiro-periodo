import { useNavigate } from 'react-router-dom'
import styles from './nav.module.css'

const NavAdmin = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div className={styles.nav}>
                <p className={styles.item}>
                   Solicitacoes
                </p>
                <p className={styles.item}>
                     Cadastrar Usuario
                </p>
                <p className={styles.item} onClick={() => navigate('/inicio')}>
                     Voltar
                </p>
            </div>
        </div>
    )
}

export default NavAdmin