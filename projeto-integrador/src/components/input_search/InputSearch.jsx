import styles from './InputSearch.module.css'
import { FaSearch } from "react-icons/fa";


const InputSearch = () => {
    return (
        <form className={styles.searchContainer}>
            <input
                className={styles.input}
                type="text"
                placeholder="Pesquise por nome, data ou cpf"
            />
            <FaSearch className={styles.search} />
        </form>



    )
}

export default InputSearch