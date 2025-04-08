import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Swal from "sweetalert2";
import styles from "./CaseDetails.module.css";
import axios from "axios";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
};

const CaseDetails = () => {
  const { protocol } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
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

        setCaseDetails(response.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: `Erro`,
          text: err.response?.data?.message || "Tente novamente mais tarde.",
          confirmButtonColor: "#d33",
        });
      }
    };

    fetchCaseDetails();
  }, [protocol]);

  const getOrNA = (value) => (value ? value : "N/A");

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.marginContent}>
          <h1 className={styles.title}>Detalhes do caso</h1>

          {caseDetails ? (
            <div className={styles.caseDetails}>
              {/* Informações Gerais */}
              <div className={styles.caseSection}>
                <h2>Informações Gerais</h2>
                <p>
                  <strong>Protocolo:</strong> {getOrNA(caseDetails.protocol)}
                </p>
                <p>
                  <strong>Título:</strong> {getOrNA(caseDetails.title)}
                </p>
                <p>
                  <strong>Status:</strong> {getOrNA(caseDetails.status)}
                </p>
                <p>
                  <strong>Tipo de Caso:</strong> {getOrNA(caseDetails.caseType)}
                </p>
                <p>
                  <strong>Data de Abertura:</strong>{" "}
                  {formatDate(caseDetails.openedAt)}
                </p>
                <p>
                  <strong>Observações:</strong>{" "}
                  {getOrNA(caseDetails.observations)}
                </p>
                <p>
                  <strong>Número de Inquérito:</strong>{" "}
                  {getOrNA(caseDetails.inquiryNumber)}
                </p>
                <p>
                  <strong>BO:</strong> {getOrNA(caseDetails.BO)}
                </p>
              </div>

              {/* Paciente */}
              <div className={styles.caseSection}>
                <h2>Paciente</h2>
                <p>
                  <strong>Nome:</strong> {getOrNA(caseDetails.patient?.name)}
                </p>
                <p>
                  <strong>NIC:</strong> {getOrNA(caseDetails.patient?.nic)}
                </p>
                <p>
                  <strong>Idade:</strong> {getOrNA(caseDetails.patient?.age)}
                </p>
                <p>
                  <strong>Status de Identificação:</strong>{" "}
                  {getOrNA(caseDetails.patient?.identificationStatus)}
                </p>
              </div>

              {/* Localização */}
              <div className={styles.caseSection}>
                <h2>Localização</h2>
                <p>
                  <strong>Rua:</strong> {getOrNA(caseDetails.location?.street)}
                </p>
                <p>
                  <strong>Bairro:</strong>{" "}
                  {getOrNA(caseDetails.location?.district)}
                </p>
                <p>
                  <strong>Cidade:</strong> {getOrNA(caseDetails.location?.city)}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {getOrNA(caseDetails.location?.state)}
                </p>
                <p>
                  <strong>CEP:</strong> {getOrNA(caseDetails.location?.zipCode)}
                </p>
              </div>

              {/* Responsável pela abertura */}
              <div className={styles.caseSection}>
                <h2>Responsável pela abertura</h2>
                <p>
                  <strong>Nome:</strong> {getOrNA(caseDetails.openedBy?.name)}
                </p>
                <p>
                  <strong>Cargo:</strong> {getOrNA(caseDetails.openedBy?.role)}
                </p>
              </div>

              {/* Envolvidos */}
              <div className={styles.caseSection}>
                <h2>Envolvidos</h2>
                <div className={styles.cardList}>
                  {caseDetails.involved.length > 0 ? (
                    caseDetails.involved.map((pessoa) => (
                      <div key={pessoa._id} className={styles.card}>
                        <p>
                          <strong>Nome:</strong> {getOrNA(pessoa.name)}
                        </p>
                        <p>
                          <strong>Cargo:</strong> {getOrNA(pessoa.role)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum envolvido registrado.</p>
                  )}
                </div>
              </div>

              {/* Evidências */}
              <div className={styles.caseSection}>
                <h2>Evidências</h2>
                <div className={styles.cardList}>
                  {caseDetails.evidence.length > 0 ? (
                    caseDetails.evidence.map((evid) => (
                      <div key={evid._id} className={styles.card}>
                        <p>
                          <strong>Título:</strong> {getOrNA(evid.title)}
                        </p>
                        <p>
                          <strong>Depoimento:</strong> {getOrNA(evid.testimony)}
                        </p>
                        <p>
                          <strong>Descrição Técnica:</strong>{" "}
                          {getOrNA(evid.descriptionTechnical)}
                        </p>
                        <p>
                          <strong>Condição:</strong> {getOrNA(evid.condition)}
                        </p>
                        <p>
                          <strong>Coletor:</strong>{" "}
                          {getOrNA(evid.collector?.name)}
                        </p>
                        <p>
                          <strong>Categoria:</strong> {getOrNA(evid.category)}
                        </p>
                        <p>
                          <strong>Observações:</strong> {getOrNA(evid.obs)}
                        </p>
                        <p>
                          <strong>Latitude:</strong> {getOrNA(evid.latitude)}
                        </p>
                        <p>
                          <strong>Longitude:</strong> {getOrNA(evid.longitude)}
                        </p>
                        {evid.photo ? (
                          <div className={styles.imageWrapper}>
                            <p>
                              <strong>Foto:</strong>
                            </p>
                            <img
                              src={`data:image/jpeg;base64,${evid.photo}`}
                              alt="Foto da evidência"
                              className={styles.imagePreview}
                            />
                          </div>
                        ) : (
                          <p>
                            <strong>Foto:</strong> Não disponível
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma evidência registrada.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Carregando detalhes do caso...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
