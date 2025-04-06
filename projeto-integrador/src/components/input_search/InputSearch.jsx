import styles from './InputSearch.module.css'
import { FaSearch } from "react-icons/fa";
import clsx from 'clsx';


const InputSearch = ({placeholder, variant}) => {
    return (
        <form className={styles.searchContainer}>
            <input
                className={clsx(styles.input, styles[variant])}
                type="text"
                placeholder={placeholder}
            />
        </form>



    )
}

export default InputSearch