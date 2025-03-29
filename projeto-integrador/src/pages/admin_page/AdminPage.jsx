import Header from '../../components/header/Header';
import NavAdmin from '../../components/nav_admin/NavAdmin';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    return (
        <div className={styles.container}>
            <Header />
            <div>
                <NavAdmin />
            </div>
        </div>
    )
}

export default AdminPage;