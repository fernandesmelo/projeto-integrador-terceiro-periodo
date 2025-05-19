import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import InputSearch from "../../components/input_search/InputSearch";
import Nav from "../../components/nav/Nav";
import Table from "../../components/table/Table";
import styles from "./Victim.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TableVictims from "../../components/tableVictims/TableVictims";

const Cases = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [victims, setVictims] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [nicFilter, setNicFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const role = localStorage.getItem("role")

  const token = localStorage.getItem("token");
  localStorage.getItem("token");
  const victimPerPage = 8;

  const paginatedVictim = victims.slice(
    (page - 1) * victimPerPage,
    page * victimPerPage
  );
  const lengthPag = Math.ceil(victims.length / victimPerPage);
  const arrayPag = [...Array(lengthPag)];

  console.log(victims)

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://sistema-odonto-legal.onrender.com/api/patient/all/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVictims(response.data);
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

      setVictims(response.data);
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
      setVictims(response.data);

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
      "https://sistema-odonto-legal.onrender.com/api/patient/search";
    try {
      console.log(nicFilter);
      const response = await axios.get(apiProtocol, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          nic: nicFilter,
        },
      });
      console.log(response.data);
      setVictims([response.data]);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Nenhum nic encontrado!",
        "Nenhum nic com esse protocolo foi encotrado.",
        "warning"
      );
    }
  };

  const handleVictimCreated = () => {
    if (role === "ASSISTENTE") {
      Swal.fire({
        icon: "warning",
        title: "Voce nao tem acesso",
        text: "Seu usuario nao tem acesso a criar casos"

      })
    } else {
      navigate("/casos/cadastrarVitima")
    }
  }

  const clearFilters = () => {
    setStatusFilter("");
    setNicFilter("");
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
          <h1 className={styles.title}>Banco de dados da Vitima</h1>
          <div className={styles.buttons}>
            <Button
              type="button"
              variant="button-table"
              onClick={handleVictimCreated}
              disabled={false}
            >
              Adicionar Vitima
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
              placeholder="Pesquisar Nic"
              variant="InputSearch"
              value={nicFilter}
              onChange={(e) => {
                setNicFilter(e.target.value);
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
          <TableVictims victims={paginatedVictim} />
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
