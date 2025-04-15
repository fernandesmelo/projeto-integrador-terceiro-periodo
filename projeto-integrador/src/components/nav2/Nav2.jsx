import styles from './Nav2.module.css'

const Nav2 = ({content, onClick}) => {
    return (
        <div className={styles.navContainer}>
            <nav className={styles.nav}>
                <a onClick={onClick}>{content}</a>
            </nav>
            <hr />
        </div>

       

    )
}

export default Nav2