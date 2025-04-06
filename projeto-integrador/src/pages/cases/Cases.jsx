import Button from "../../components/button/Button"
import Header from "../../components/header/Header"
import InputSearch from "../../components/input_search/InputSearch"
import Nav from "../../components/nav/Nav"
import NavCase from "../../components/nav_case/navCase"
import Table from "../../components/table/Table"
import styles from './Cases.module.css'
import { useState, useEffect } from 'react';
import axios from "axios"



const Cases = () => {
    const [page, setPage] = useState(1);
    const [cases, setCases] = useState([]);
    const casesPerPage = 2

    const API_URL = `https://sistema-odonto-legal.onrender.com/api/cases/mycases`;

    const paginatedCase = cases.slice((page - 1) * casesPerPage, page * casesPerPage)
    const lengthPag = Math.ceil(cases.length / casesPerPage)
    const arrayPag = [...Array(lengthPag)]


    const token = localStorage.getItem('token')
    const getData = async (page) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { page },
            });
            console.log(response)
            setCases(response.data);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const filterStatus = async (status, page = 1) => {
        console.log(status)
        const FILTER_URL = `https://sistema-odonto-legal.onrender.com/api/cases/search`
        console.log(FILTER_URL)

        try {
            const response = await axios.get(FILTER_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { 
                    status,
                    page
                }
            })
            setCases(response.data)
        } catch (error) {
            console.error('Erro na busca de filtros', error)
        }
    }

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
                                onClick={() => getData(1)}
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
                        <select onChange={(e) => filterStatus(e.target.value)}>
                            <option>TODOS OS STATUS</option>
                            <option value="ABERTO">ABERTO</option>
                            <option value='FINALIZADO'>FINALIZADO</option>
                            <option value='ARQUIVADO'>ARQUIVADO</option>
                        </select>
                        <input type="date" name="" id="" />
                    </div>
                    <Table
                        cases={paginatedCase}
                    />
                    <div>
                        {arrayPag.map((_, i) => (
                            <button key={i} className={styles.pag} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Cases;
