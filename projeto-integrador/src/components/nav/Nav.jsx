import styles from './Nav.module.css';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();

    function handleAdmin() {
        navigate('/admin')
    }

    return (
        <div>
            <div className={styles.nav}>
                <p className={styles.item} tabIndex={0} role="button" onClick={() => navigate('/')}>Início</p>
                <p className={styles.item} tabIndex={0} role="button" onClick={handleAdmin}>Admin</p>
            </div>
        </div>
    );
};

export default Nav;