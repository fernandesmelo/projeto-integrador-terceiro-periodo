import styles from './NavCase.module.css'

const NavCase = () => {
    return (
        <div className={styles.navContainer}>
            <nav className={styles.nav}>
                <a href="">link</a>
                <a href="">link</a>
                <a href="">link</a>         
            </nav>
            <hr />
        </div>

       

    )
}

export default NavCase