import Button from '../button/Button'
import styles from './modalVictim.module.css'

const ModalVictim = ({ isOpen, children }) => {

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                {children}
                
            </div>
        </div>
    )
}

export default ModalVictim