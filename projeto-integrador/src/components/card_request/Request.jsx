import styles from './Request.module.css'

const Request = ({title, name, cpf, role, status}) => {
    return (
        <div className={styles.request}>
            <h1 className={styles.titleRequest}>{title}</h1>
            <p className={styles.detailsRequest}>Nome: {name}</p>
            <p className={styles.detailsRequest}>Cpf: {cpf}</p>
            <p className={styles.detailsRequest}>Cargo: {role}</p>
            <p className={styles.detailsRequest}>Status: {status}</p>
            
            {status === 'Pendente' && (<div className={styles.button}>
                <button className={styles.approvedRequest}>
                    APROVAR
                </button>
                <button className={styles.deniedRequest}>
                    NEGAR
                </button>
            </div>)}

        </div>
    )
}
export default Request