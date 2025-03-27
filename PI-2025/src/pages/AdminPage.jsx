import Header from '../components/header'
import NavAdmin from '../components/NavAdmin'
import styles from './AdminPage.module.css'

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

export default AdminPage