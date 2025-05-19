import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import InputSearch from "../../components/input_search/InputSearch";
import Nav from "../../components/nav/Nav";
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
  const role = localStorage.getItem("role")

  const token = localStorage.getItem("token");
  localStorage.getItem("token");
  const casesPerPage = 8;


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
      console.log(response.data)
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
        const errorMessage = error.response.data.message || "Erro desconhecido";

        Swal.fire({
          icon: "warning",
          title: "Nenhum caso encontrado!",
          text: errorMessage,
        });
        setStatusFilter("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Não foi possível se conectar ao servidor.",
        });
      }
    }
  };

  const applyFilterDate = async () => {
    const urlApi =
      "https://sistema-odonto-legal.onrender.com/api/cases/search/date";
    try {
      const response = await axios.get(urlApi, {
        headers: {
          Authorization: `bearer ${token}`,
        },
        params: {
          date: dateFilter,
        },
      });
      setCases(response.data);

      if (response.data.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Nenhum caso com essa data foi encontrado",
          title: "Nenhum caso encontrado!",
        });
        getData();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
        title: "Erro!",
      });
    }
  };

  const protocolSearch = async () => {
    const apiProtocol =
      "https://sistema-odonto-legal.onrender.com/api/cases/search/protocol";
    try {
      console.log(protocoloFilter);
      const response = await axios.get(apiProtocol, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          protocol: protocoloFilter,
        },
      });
      console.log(response.data);
      setCases([response.data]);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Nenhum caso encontrado!",
        "Nenhum caso com esse protocolo foi encotrado.",
        "warning"
      );
    }
  };

  const handleCaseCreated = () => {
    if (role === "ASSISTENTE") {
      Swal.fire({
        icon: "warning",
        title: "Voce nao tem acesso",
        text: "Seu usuario nao tem acesso a criar casos"

      })
    } else {
      navigate("/casos/cadastrar")
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
          <h1 className={styles.title}>Casos Periciais</h1>
          <div className={styles.buttons}>
            <Button
              type="button"
              variant="button-table"
              onClick={handleCaseCreated}
              disabled={false}
            >
              Adicionar caso
            </Button>
            <Button
              type="button"
              variant="small-secondary"
              disabled={false}
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </div>
          <div className={styles.inputArea}>
            <InputSearch
              
              placeholder="Pesquisar protocolo"
              variant="InputSearch"
              value={protocoloFilter}
              onChange={(e) => {
                setProtocoloFilter(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  protocolSearch();
                }
              }}
            />
            <div className={styles.filterArea}>
              <select
                value={statusFilter}
                className={styles.filter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                
              >
                <option value="">Filtrar por: </option>
                <option value="">Todos</option>
                <option value="ABERTO">Aberto</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="ARQUIVADO">Arquivo</option>
              </select>
              <input
                type="date"
                className={styles.inputDate}
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilterDate();
                  }
                }}
              />
            </div>
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
