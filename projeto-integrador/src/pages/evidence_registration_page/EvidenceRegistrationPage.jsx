import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./EvidenceRegistrationPage.module.css";

const EvidenceRegistrationPage = () => {

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.nav_container}>
                <Nav />
                <div className={styles.user_registration}>
                    <h3>Insira as informações do usuário</h3>
                </div>
            </div>
        </div>
    );
}

export default EvidenceRegistrationPage;
