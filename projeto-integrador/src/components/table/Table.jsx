import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import { BiPencil, BiSearch, BiTrash, BiFile } from "react-icons/bi";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Table = ({ cases }) => {
  const navigate = useNavigate();

  // Estado interno que armazena os casos exibidos
  const [tableCases, setTableCases] = useState(cases);

  // Sincroniza o estado interno quando a prop 'cases' mudar
  useEffect(() => {
    setTableCases(cases);
  }, [cases]);

  const verDetalhes = (protocol) => {
    navigate(`/casos/detalhes/${protocol}`);
  };

  const addEvidence = (protocol) => {
    navigate(`/casos/evidencia/${protocol}`);
  };

  const gerarRelatorio = (protocol) => {
    navigate(`/casos/laudo/evidencia/${protocol}`);
  };

  const excluirCaso = async (protocol) => {
    const confirm = await Swal.fire({
      title: "Deseja excluir este caso?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB5757",
      cancelButtonColor: "#1E88E5",
      confirmButtonText: "Sim, excluir!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `https://sistema-odonto-legal.onrender.com/api/cases/delete/protocol`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { protocol },
          }
        );

        Swal.fire("Excluído!", "O caso foi excluído com sucesso.", "success");

        // Atualiza o estado interno: remove o caso excluído
        setTableCases((prev) =>
          prev.filter((item) => item.protocol !== protocol)
        );
      } catch (error) {
        console.error("Erro ao excluir caso:", error);
        Swal.fire(
          "Erro!",
          error.response?.data?.message || "Erro ao excluir o caso.",
          "error"
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Título do Caso</th>
            <th>Tipo de Caso</th>
            <th>Nick Paciente</th>
            <th>Status</th>
            <th>Data</th>
            <th>Evidências</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tableCases.map((item, index) => (
            <tr key={index}>
              <td>{item.protocol}</td>
              <td>{item.title}</td>
              <td>{item.caseType}</td>
              <td>{item.patient.nic}</td>
              <td>{item.status}</td>
              <td>
                {new Date(item.openedAt).toLocaleDateString("pt-BR")}
              </td>
              <td>
                {item.evidence?.length || 0}
                <Button
                  type="button"
                  variant="small-primary"
                  onClick={() => addEvidence(item.protocol)}
                >
                  Adicionar evidência
                </Button>
              </td>
              <td>
                <BiSearch
                  className={styles.icon}
                  title="Ver detalhes"
                  style={{
                    cursor: "pointer",
                    marginRight: 10,
                    color: "#012130",
                  }}
                  onClick={() => verDetalhes(item.protocol)}
                />
                <BiPencil
                  className={styles.icon}
                  title="Editar"
                  style={{
                    cursor: "pointer",
                    marginRight: 10,
                    color: "#012130",
                  }}
                />
                <BiFile
                  className={styles.icon}
                  title="Gerar relatório"
                  style={{
                    cursor: "pointer",
                    marginRight: 10,
                    color: "#012130",
                  }}
                  onClick={() => gerarRelatorio(item.protocol)}
                />
                {item.evidence?.length === 0 && (
                  <BiTrash
                    className={styles.icon}
                    title="Excluir caso"
                    style={{
                      cursor: "pointer",
                      marginRight: 10,
                      color: "#012130",
                    }}
                    onClick={() => excluirCaso(item.protocol)}
                  />
                )}
              </td>
            </tr>
          ))}
          {tableCases.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "1rem" }}>
                Nenhum caso encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
