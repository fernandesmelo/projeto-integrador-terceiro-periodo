import Header from "../components/header"
import Nav from "../components/Nav"
import styles from "./Dashboard.module.css"


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

export default Inicio