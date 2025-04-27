import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import { BiPencil, BiSearch, BiTrash, BiFile } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { IoMdAddCircleOutline } from "react-icons/io";
import EditModal from "./EditModal";
import EditModalStepTwo from "./EditModalStepTwo";

const Table = ({ cases }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tableCases, setTableCases] = useState(cases);
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModalStepTwo, setShowModalStepTwo] = useState(false);
  const [stepTwoFormData, setStepTwoFormData] = useState(null);

  useEffect(() => {
    setTableCases(cases);
  }, [cases]);


  const fetchCaseDetails = async (protocol) => {
    Swal.fire({
      title: "Carregando...",
      text: "Buscando detalhes do caso.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.get(
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
      setSelectedCase(response.data);
      handleEdit()

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `Erro`,
        text: err.response?.data?.message || "Tente novamente mais tarde.",
        confirmButtonColor: "#EB5757",
      });
    } finally {
      Swal.close();
    }
  }

  const verDetalhes = (protocol) => {
    navigate(`/casos/detalhes/${protocol}`);
  };

  const addEvidence = (protocol) => {
    navigate(`/casos/evidencia/${protocol}`);
  };

  const handleEdit = () => {
    setShowModal(true);
  };


  const handleNextStep = (formData) => {
    setShowModal(false); // fecha o primeiro modal
    setStepTwoFormData(formData); // salva os dados pra usar no segundo
    setShowModalStepTwo(true); // abre o segundo modal
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
              Authorization: `Bearer ${token}`,
            },
            params: { protocol },
          }
        );

        Swal.fire("Excluído!", "O caso foi excluído com sucesso.", "success");
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
              <td>
                <span
                  className={
                    item.status === "ABERTO"
                      ? styles["status-aberto"]
                      : item.status === "FINALIZADO"
                      ? styles["status-finalizado"]
                      : styles["status-arquivado"]
                  }
                >
                  {item.status}
                </span>
              </td>
              <td>{new Date(item.openedAt).toLocaleDateString("pt-BR")}</td>
              <td>
                {item.evidence?.length || 0}
                <IoMdAddCircleOutline
                  className={styles.add}
                  title="Adicionar evidência"
                  onClick={() => addEvidence(item.protocol)}
                />
              </td>
              <td>
                <BiSearch
                  className={styles.icon}
                  title="Ver detalhes"
                  onClick={() => verDetalhes(item.protocol)}
                />

                {
                  <BiPencil
                    className={styles.icon}
                    title="Editar"
                    style={{ cursor: "pointer", marginRight: 10, color: "#012130" }}
                    onClick={() => fetchCaseDetails(item.protocol)}
                  />
                }

                {item.evidence?.length === 0 && (
                  <BiTrash
                    className={styles.icon}
                    title="Excluir caso"
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
      {showModal && selectedCase && (
        <EditModal
          protocol={selectedCase.protocol}
          currentTitle={selectedCase.title}
          currentCaseType={selectedCase.caseType}
          currentObservations={selectedCase.observations}
          currentLocation={selectedCase.location}
          currentInquiryNumber={selectedCase.inquiryNumber}
          currentRequestingInstitution={selectedCase.requestingInstitution}
          currentRequestingAuthority={selectedCase.requestingAuthority}
          onClose={() => setShowModal(false)}
          onNextStep={handleNextStep} // <<< passa essa função aqui
          onUpdate={() => window.location.reload()}
        />
      )}

      {showModalStepTwo && stepTwoFormData && (
        <EditModalStepTwo
          formData={stepTwoFormData}
          onClose={() => setShowModalStepTwo(false)}
          onUpdate={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default Table;
