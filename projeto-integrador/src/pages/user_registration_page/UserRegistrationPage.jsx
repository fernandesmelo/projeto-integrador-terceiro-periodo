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
                    < h1>ashdgasgusd</h1>
                </div>
            </div>
        </div>
    )
}

export default UserRegistrationPage;