import Header from '../../components/header/Header'
import NavAdmin from '../../components/nav_admin/NavAdmin'
import styles from './AdminRequest.module.css'
import Request from '../../components/card_request/Request';
import InputSearch from '../../components/input_search/InputSearch';
import { useState } from 'react';

//  
const allRequests = {
    pending: [<Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 2" name="Maria Souza" cpf="987.654.321-00" role="Gerente" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />, <Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />,<Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />,<Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />,<Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />,<Request title="Solicitação 1" name="João Silva" cpf="123.456.789-00" role="Analista" status="Pendente" />], 
    accepted: [<Request title="Solicitação 2" name="Maria Souza" cpf="987.654.321-00" role="Gerente" status="Aceito" />],
    denied: [<Request title="Solicitação 2" name="Maria Souza" cpf="987.654.321-00" role="Gerente" status="Negado" />]
}
const ITEMS_PER_PAGE = 8; // Ajuste conforme necessário


const AdminRequest = () => {

    const [activeCategory, setActiveCategory] = useState('pending')
    const [currentPage, setCurrentPage] = useState(1);
    
    const requests = allRequests[activeCategory] || []
    
    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

    const currentRequests = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className={styles.container}>
            <Header />
            <div style={{ display: 'flex' }}>
                <NavAdmin />
                <div>
                    <div className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.input}>
                                <button onClick={() => setActiveCategory('pending')} className={styles.title}>Solicitacoes Pendentes</button>                                                                            
                                <button onClick={() => setActiveCategory('accepted')} className={styles.title}>Solicitacoes Aceitas</button>
                                <button onClick={() => setActiveCategory('denied')} className={styles.title}>Solicitacoes Negadas</button>
                                <InputSearch />
                            </div>
                            <div className={styles.cards}>
                                    {currentRequests.map((request, index) => (
                                        <div key={index}>{request}</div>
                                    ))}

                                    <div className={styles.page}>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <button key={index} onClick={() => setCurrentPage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminRequest