import Button from "../../components/button/Button"
import Header from "../../components/header/Header"
import InputSearch from "../../components/input_search/InputSearch"
import Nav from "../../components/nav/Nav"
import NavCase from "../../components/nav_case/navCase"
import Table from "../../components/table/Table"
import styles from './Cases.module.css'
import { useState, useEffect } from 'react';
import axios from "axios"

const API_URL = `https://sistema-odonto-legal.onrender.com/api/cases/mycases`;

const Cases = () => {
    const [page, setPage] = useState(1);
    const [cases, setCases] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem('token')
    const getData = async (page = 1) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { page },
            });
            console.log(response)
            setCases(response.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    useEffect(() => {
        getData(page);
    }, [page]);

    return (
        <div>
            <Header />
            <div className={styles.content}>
                <Nav />
                <div className={styles.caseContent}>
                    <h1 className={styles.title}>Casos periciais</h1>
                    <NavCase />
                    <div className={styles.buttons}>
                        <div style={{ display: 'flex' }}>
                            <Button
                                type='button'
                                variant='primary'
                                disabled={false}
                            >
                                Adicionar caso
                            </Button>
                        </div>
                        <div>
                            <Button
                                type='button'
                                variant='secondary'
                                disabled={false}
                            >
                                Limpar filtros
                            </Button>
                        </div>

                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        <InputSearch
                            placeholder='pesquisar protocolo'
                            searchDisabled={true}
                            variant='secondary'
                        />
                        <select>
                            <option>Todos os status</option>
                        </select>
                        <input type="date" name="" id="" />
                    </div>
                    <Table
                        cases={cases}
                    />
                    <div>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index} onClick={() => setPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Cases;