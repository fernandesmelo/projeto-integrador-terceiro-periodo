import React from "react";
import styles from "./Table.module.css";
import { BiPencil, BiSearch, BiTrash, BiFile } from "react-icons/bi";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Table = ({ cases }) => {
  const navigate = useNavigate();

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
    });

    if (confirm.isConfirmed) {
      try {
        console.log("Excluindo caso com protocolo:", protocol);
        await axios.delete(
          `https://sistema-odonto-legal.onrender.com/api/cases/search/protocol`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              protocol,
            },
          }
        );
        Swal.fire("Excluído!", "O caso foi excluído com sucesso.", "success");
        // Aqui você pode chamar uma função para atualizar a lista de casos
      } catch (error) {
        console.log("Erro ao excluir caso:", error);
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
            <th>protocolo</th>
            <th>titulo do caso</th>
            <th>tipo de caso</th>
            <th>nick paciente</th>
            <th>status caso</th>
            <th>Data</th>
            <th>Evidencia</th>
            <th>ações</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item, index) => (
            <tr key={index}>
              <td>{item.protocol}</td>
              <td>{item.title}</td>
              <td>{item.caseType}</td>
              <td>{item.patient.nic}</td>
              <td>{item.status}</td>
              <td>{new Date(item.openedAt).toLocaleDateString("pt-BR")}</td>
              <td>{item.evidence?.length || 0}</td>
              <td>
                <BiSearch
                  className={styles.icon}
                  title="Ver detalhes"
                  style={{ cursor: "pointer", marginRight: 10 }}
                  onClick={() => verDetalhes(item.protocol)}
                />
                <BiPencil
                  className={styles.icon}
                  title="Editar"
                  style={{ marginRight: 10 }}
                />

                {/* Botão de gerar relatório */}
                <BiFile
                  className={styles.icon}
                  title="Gerar Relatório"
                  style={{ cursor: "pointer", marginRight: 10 }}
                  onClick={() => gerarRelatorio(item.protocol)}
                />

                {/* Botão de excluir caso - só aparece se não houver evidências */}
                {item.evidence?.length === 0 && (
                  <BiTrash
                    className={styles.icon}
                    title="Excluir caso"
                    style={{ cursor: "pointer", color: "red", marginRight: 10 }}
                    onClick={() => excluirCaso(item.protocol)}
                  />
                )}

                <Button onClick={() => addEvidence(item.protocol)}>
                  Adicionar evidencia
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
