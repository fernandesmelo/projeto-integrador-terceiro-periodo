import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import Swal from "sweetalert2";
import styles from "./CaseDetails.module.css";
import axios from "axios";
import ToGoBack from "../../components/togoback/ToGoBack";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
};

const CaseDetails = () => {
  const navigate = useNavigate();
  const { protocol } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);

  const addEvidence = (protocol) => {
    navigate(`/casos/evidencia/${protocol}`);
  };

  useEffect(() => {
    const fetchCaseDetails = async () => {
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
        console.log("dados", response.data);

        setCaseDetails(response.data);
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
    };

    fetchCaseDetails();
  }, [protocol]);

  const getOrNA = (value) => (value ? value : "N/A");

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.margin}>
          <div className={styles.marginContent}>
            <h1 className={styles.title}>Detalhes do Caso</h1>
            <ToGoBack onClick={() => navigate(-1)} content="voltar" />
            {caseDetails ? (
              <div className={styles.caseDetails}>
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
                    <strong>Tipo de Caso:</strong>{" "}
                    {getOrNA(caseDetails.caseType)}
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
                    <strong>Autoridade Requisitante:</strong>{" "}
                    {getOrNA(caseDetails.requestingAuthority)}
                  </p>
                  <p>
                    <strong>Instituição Requisitante:</strong>{" "}
                    {getOrNA(caseDetails.requestingInstitution)}
                  </p>
                </div>
                <div className={styles.caseSection}>
                  {caseDetails.questions &&
                    caseDetails.questions.length > 0 && (
                      <div>
                        <h2>Perguntas do Caso</h2>
                        <ul>
                          {caseDetails.questions.map((item, index) => (
                            <li key={index}>{item.question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
                {caseDetails.caseReport && (
                  <div className={styles.caseSection}>
                    <h2>Relatório Final do Caso</h2>
                    <p>
                      <strong>Descrição:</strong>{" "}
                      {getOrNA(caseDetails.caseReport.description)}
                    </p>
                    <p>
                      <strong>Conclusão:</strong>{" "}
                      {getOrNA(caseDetails.caseReport.conclusion)}
                    </p>
                    <p>
                      <strong>Data de Conclusão:</strong>{" "}
                      {formatDate(caseDetails.caseReport.createdAt)}
                    </p>
                    <p>
                      <strong>Responsável:</strong>{" "}
                      {getOrNA(caseDetails.caseReport.responsible?.name)}
                    </p>
                    {caseDetails.caseReport.answers?.length > 0 && (
                      <div>
                        <strong className={styles.answers}>Respostas:</strong>
                        <ul>
                          {caseDetails.caseReport.answers.map((item, index) => (
                            <li key={item._id || index}>
                              Resposta {index + 1}: {getOrNA(item.answer)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.caseSection}>
                  <h2>Dados da Vítima</h2>
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
                    <strong>Gênero:</strong>{" "}
                    {getOrNA(caseDetails.patient?.gender || "N/A")}
                  </p>
                  <p>
                    <strong>Status de Identificação:</strong>{" "}
                    {getOrNA(caseDetails.patient?.identificationStatus)}
                  </p>
                </div>
                <div className={styles.caseSection}>
                  <h2>Localização do Ocorrido</h2>
                  <p>
                    <strong>Rua:</strong>{" "}
                    {getOrNA(caseDetails.location?.street)}
                  </p>
                  <p>
                    <strong>Bairro:</strong>{" "}
                    {getOrNA(caseDetails.location?.district)}
                  </p>
                  <p>
                    <strong>Cidade:</strong>{" "}
                    {getOrNA(caseDetails.location?.city)}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {getOrNA(caseDetails.location?.state)}
                  </p>
                  <p>
                    <strong>CEP:</strong>{" "}
                    {getOrNA(caseDetails.location?.zipCode)}
                  </p>
                </div>
                <div className={styles.caseSection}>
                  <h2>Responsável pela Abertura</h2>
                  <p>
                    <strong>Nome:</strong> {getOrNA(caseDetails.openedBy?.name)}
                  </p>
                  <p>
                    <strong>Cargo:</strong>{" "}
                    {getOrNA(caseDetails.openedBy?.role)}
                  </p>
                </div>
                <div className={styles.caseSection}>
                  <h2>Profissionais</h2>
                  <div className={styles.cardList}>
                    {caseDetails.professional.length > 0 ? (
                      caseDetails.professional.map((pessoa) => (
                        <div key={pessoa._id}>
                          <p>
                            <strong>Nome:</strong> {getOrNA(pessoa.name)}
                          </p>
                          <p>
                            <strong>Cargo:</strong> {getOrNA(pessoa.role)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Nenhum profissional registrado.</p>
                    )}
                  </div>
                </div>
                {caseDetails ? (
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
                              <strong>Depoimento:</strong>{" "}
                              {getOrNA(evid.testimony)}
                            </p>
                            <p>
                              <strong>Descrição Técnica:</strong>{" "}
                              {getOrNA(evid.descriptionTechnical)}
                            </p>
                            <p>
                              <strong>Condição:</strong>{" "}
                              {getOrNA(evid.condition)}
                            </p>
                            <p>
                              <strong>Coletor:</strong>{" "}
                              {getOrNA(evid.collector?.name)}
                            </p>
                            <p>
                              <strong>Categoria:</strong>{" "}
                              {getOrNA(evid.category)}
                            </p>
                            <p>
                              <strong>Observações:</strong> {getOrNA(evid.obs)}
                            </p>
                            <p>
                              <strong>Latitude:</strong>{" "}
                              {getOrNA(evid.latitude)}
                            </p>
                            <p>
                              <strong>Longitude:</strong>{" "}
                              {getOrNA(evid.longitude)}
                            </p>
                            {evid.photo ? (
                              <div className={styles.imageWrapper}>
                                <p>
                                  <strong>Foto:</strong>
                                </p>
                                <img
                                  src={evid.photo}
                                  alt="Foto da evidência"
                                  className={styles.imagePreview}
                                />
                              </div>
                            ) : (
                              <p>
                                <strong>Foto:</strong> Não disponível
                              </p>
                            )}
                            {evid.reportEvidence ? (
                              <fieldset>
                                <legend>Laudo Gerado</legend>
                                <p>
                                  <strong>Conclusão do Laudo:</strong>{" "}
                                  {getOrNA(evid.reportEvidence.note)}
                                </p>
                                <p>
                                  <strong>Análise Técnica:</strong>{" "}
                                  {getOrNA(
                                    evid.reportEvidence.descriptionTechnical
                                  )}
                                </p>
                                <p>
                                  <strong>Concluído por:</strong>{" "}
                                  {getOrNA(
                                    evid.reportEvidence.responsible?.name
                                  )}
                                </p>
                                <p>
                                  <strong>Data do Laudo:</strong>{" "}
                                  {formatDate(evid.reportEvidence.createdAt)}
                                </p>
                                <Button
                                  type="button"
                                  variant="generic-secondary"
                                  onClick={() =>
                                    navigate(`/casos/laudo/${evid._id}`, {
                                      state: { caseDetails, evidence: evid },
                                    })
                                  }
                                >
                                  Imprimir laudo
                                </Button>
                              </fieldset>
                            ) : (
                              <Button
                                type="button"
                                variant="generic-secondary"
                                onClick={() =>
                                  navigate("/casos/laudo/evidencia", {
                                    state: { evidence: evid, protocol },
                                  })
                                }
                              >
                                Gerar laudo
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>Nenhuma evidência registrada.</p>
                      )}
                      <Button
                        variant="generic-secondary"
                        onClick={() => addEvidence(caseDetails.protocol)}
                      >
                        Adicionar evidências
                      </Button>
                    </div>
                    {caseDetails.evidence.length > 0 &&
                      caseDetails.evidence.every(
                        (ev) =>
                          ev.reportEvidence &&
                          ev.reportEvidence.note?.trim() &&
                          ev.reportEvidence.descriptionTechnical?.trim() &&
                          ev.reportEvidence.responsible?.name?.trim() &&
                          ev.reportEvidence.createdAt
                      ) && (
                        <div className={styles.generateReportContainer}>
                          {caseDetails.caseReport ? (
                            <Button
                              type="button"
                              variant="generic-primary"
                              onClick={() =>
                                navigate("/casos/relatorio/imprimir", {
                                  state: { caseDetails },
                                })
                              }
                            >
                              Imprimir relatório
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="generic-primary"
                              onClick={() =>
                                navigate("/casos/relatorio/final", {
                                  state: { caseDetails },
                                })
                              }
                            >
                              Gerar relatório
                            </Button>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <p>Carregando detalhes do caso...</p>
                )}
              </div>
            ) : (
              <p>Carregando detalhes do caso...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
