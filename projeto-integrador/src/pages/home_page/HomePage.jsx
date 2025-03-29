import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./HomePage.module.css";


const Inicio = () => {
    return (
        <div className={styles.container}>
            <Header />
            <div>
                <Nav />
            </div>
        </div>
    )
}

export default Inicio;