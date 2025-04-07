import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import InputSearch from "../../components/input_search/InputSearch";
import Nav from "../../components/nav/Nav";
import NavCase from "../../components/nav_case/navCase";
import Table from "../../components/table/Table";
import styles from "./Cases.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cases = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [protocoloFilter, setProtocoloFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const token = localStorage.getItem("token");
  const casesPerPage = 2;

  const paginatedCase = cases.slice(
    (page - 1) * casesPerPage,
    page * casesPerPage
  );
  const lengthPag = Math.ceil(cases.length / casesPerPage);
  const arrayPag = [...Array(lengthPag)];

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://sistema-odonto-legal.onrender.com/api/cases/search/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCases(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const applyFilters = async () => {
    const FILTER_URL = `https://sistema-odonto-legal.onrender.com/api/cases/search/status`;
    try {
      const response = await axios.get(FILTER_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: statusFilter || undefined,
          protocolo: protocoloFilter || undefined,
          date: dateFilter || undefined,
        },
      });
      setCases(response.data);
    } catch (error) {
      console.error("Erro na busca de filtros:", error);
    }
  };

  const clearFilters = () => {
    setStatusFilter("");
    setProtocoloFilter("");
    setDateFilter("");
    setPage(1);
    getData();
  };

  useEffect(() => {
    if (statusFilter || protocoloFilter || dateFilter) {
      applyFilters();
    } else {
      getData();
    }
  }, [statusFilter, protocoloFilter, dateFilter]);

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.caseContent}>
          <h1 className={styles.title}>Casos periciais</h1>
          <NavCase />
          <div className={styles.buttons}>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/casos/cadastrar")}
              disabled={false}
            >
              Adicionar caso
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={false}
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <InputSearch
              placeholder="pesquisar protocolo"
              variant="secondary"
              value={protocoloFilter}
              onChange={(e) => {
                setProtocoloFilter(e.target.value);
                setPage(1);
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">TODOS OS STATUS</option>
              <option value="ABERTO">ABERTO</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="ARQUIVADO">ARQUIVADO</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Table cases={paginatedCase} />
          <div>
            {arrayPag.map((_, i) => (
              <button
                key={i}
                className={styles.pag}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;
