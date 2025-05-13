import styles from './modalVictim.module.css'

const ModalVictim = ({isOpen ,onClose, children}) => {

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                <button onClick={onClose} className={styles['modal-close']}>X</button>
                {children}
            </div>
        </div>
    )
}

export default ModalVictim