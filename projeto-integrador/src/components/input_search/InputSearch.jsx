import styles from './InputSearch.module.css'
import { FaSearch } from "react-icons/fa";
import clsx from 'clsx';


const InputSearch = ({placeholder, variant, value, onChange, onKeyDown}) => {
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
        }} className={styles.searchContainer}>
            <input
                className={clsx(styles.input, styles[variant])}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </form>



    )
}

export default InputSearch