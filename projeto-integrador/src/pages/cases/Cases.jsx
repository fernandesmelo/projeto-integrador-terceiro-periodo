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
import Swal from "sweetalert2";

const Cases = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [protocoloFilter, setProtocoloFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const token = localStorage.getItem("token");
  localStorage.getItem('token')
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
      if (error.response) {
        // Aqui você pega a mensagem do servidor
        const errorMessage = error.response.data.message || 'Erro desconhecido';

        // Exibindo o erro com SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: errorMessage, // Mensagem de erro do servidor
        });
        setStatusFilter('')
      } else {
        // Se não houver resposta do servidor (erro de rede, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível se conectar ao servidor.',
        });
      }
    }
  };

  const applyFilterDate = async () => {
    const urlApi = 'https://sistema-odonto-legal.onrender.com/api/cases/search/date'
    try {
      const response = await axios.get(urlApi, {
        headers: {
          Authorization: `bearer ${token}`
        },
        params: {
          date : dateFilter
        }
      })
      setCases(response.data)

      if (response.data.length === 0) {
        Swal.fire({
          icon: 'error',
          text: 'nenhum caso com essa data foi encontrado',
          title: 'Erro!'
        })
        getData()
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err,
        title: 'Erro!'
      })
    }
  }

  const protocolSearch = async () => {
    const apiProtocol = 'https://sistema-odonto-legal.onrender.com/api/cases/search/protocol'
    try {
      console.log(protocoloFilter)
      const response = await axios.get(apiProtocol, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          protocol: protocoloFilter
        }
      })
      console.log(response.data)
      setCases([response.data])
    } catch (err) {
      console.error(err)
      Swal.fire('Erro!', 'nenhum caso com esse protocolo foi encotrado', 'error')
    }
  }

  const clearFilters = () => {
    setStatusFilter("");
    setProtocoloFilter("");
    setDateFilter("");
    setPage(1);
    getData();
  };

  useEffect(() => {
    if (statusFilter) {
      applyFilters();
    } else {
      getData();
    }
  }, [statusFilter]);

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  protocolSearch()
                }
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }} // adiciona o filtro para buscar meus casos no botão de satus
            >
              <option value="">FILTRAR POR: </option>
              <option value="">MEUS CASOS: </option>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilterDate()
                }
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
