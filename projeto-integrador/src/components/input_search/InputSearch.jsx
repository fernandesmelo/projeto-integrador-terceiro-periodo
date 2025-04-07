import styles from './InputSearch.module.css'
import { FaSearch } from "react-icons/fa";
import clsx from 'clsx';



const InputSearch = ({placeholder, variant}) => {
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className={styles.searchContainer}>
            <input
                className={clsx(styles.input, styles[variant])}
                type="text"
                placeholder={placeholder}
            />
        </form>



    )
}

export default InputSearch