import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import styles from "./CaseReport.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import ToGoBack from "../../components/togoback/ToGoBack";

const CaseReportForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const caseData = location.state?.caseDetails || {};
  console.log("Dados do caso no report:", caseData);

  const [description, setDescription] = useState("");
  const [conclusion, setConclusion] = useState("");
  const numQuestions = caseData.questions?.length || 0;
  const [answers, setAnswers] = useState(() => Array(numQuestions).fill(""));
  const [status, setStatus] = useState("");
  const [editVictim, setEditVictim] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [victimData, setVictimData] = useState({
    name: caseData.patient?.name || "",
    age: caseData.patient?.age || "",
    cpf: caseData.patient?.cpf || "",
    identificationStatus:
      caseData.patient?.identificationStatus || "NÃO IDENTIFICADO",
    address: {
      street: caseData.patient?.address?.street || "",
      houseNumber: caseData.patient?.address?.houseNumber || "",
      district: caseData.patient?.address?.district || "",
      city: caseData.patient?.address?.city || "",
      state: caseData.patient?.address?.state || "",
      zipCode: caseData.patient?.address?.zipCode || "",
      complement: caseData.patient?.address?.complement || "",
    },
  });

  const handleGenerateConclusion = async () => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://sistema-odonto-legal.onrender.com/api/llm/generate/case`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            case: caseData.protocol,
          },
        }
      );
      console.log(response.data);
      setConclusion(response.data);
    } catch (error) {
      error.message;
    }
  };
  useEffect(() => {
    if (!caseData || !caseData.id) {
      Swal.fire("Erro", "Dados do caso não encontrados!", "error");
      navigate("/casos");
    }
  }, [caseData, navigate]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const confirmEdit = async () => {
    const { value: response } = await Swal.fire({
      title: "Editar dados da vítima?",
      text: "Deseja alterar alguma informação da vítima antes de finalizar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, editar",
      cancelButtonText: "Não, continuar",
      confirmButtonColor: "#1E88E5",
      cancelButtonColor: "#EB5757",
    });

    if (response) {
      setShowEditModal(true);
    } else {
      setEditVictim(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showEditModal) {
      Swal.fire(
        "Atenção",
        "Finalize a edição dos dados da vítima antes de enviar",
        "warning"
      );
      return;
    }

    if (!description || !conclusion || answers.some((a) => !a) || !status) {
      Swal.fire("Aviso", "Preencha todos os campos obrigatórios!", "warning");
      return;
    }

    const token = localStorage.getItem("token");

    const updateData = {
      name: victimData.name,
      cpf: victimData.cpf || "",
      identificationStatus: victimData.identificationStatus,
      address: {
        street: victimData.address.street || "",
        district: victimData.address.district || "",
        city: victimData.address.city || "",
        state: victimData.address.state || "",
        zipCode: victimData.address.zipCode || "",
        complement: victimData.address.complement || "",
      },
    };

    if (victimData.age !== "" && !isNaN(Number(victimData.age))) {
      updateData.age = Number(victimData.age);
    }

    if (
      victimData.address.houseNumber !== "" &&
      !isNaN(Number(victimData.address.houseNumber))
    ) {
      updateData.address.houseNumber = Number(victimData.address.houseNumber);
    }

    Swal.fire({
      title: "Aguarde...",
      text: "Gerando relatorio.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      if (editVictim && caseData.patient?.nic) {
        await axios.put(
          `https://sistema-odonto-legal.onrender.com/api/patient/update`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              nic: caseData.patient.nic,
            },
          }
        );
      }

      await axios.post(
        "https://sistema-odonto-legal.onrender.com/api/case/report/case",
        {
          description,
          conclusion,
          answers: answers.map((answer) => ({ answer })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            case: caseData.id,
          },
        }
      );

      await axios.patch(
        `https://sistema-odonto-legal.onrender.com/api/cases/edit/status/protocol`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            protocol: caseData.protocol,
          },
        }
      );
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Relatorio salvo com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate(`/casos/detalhes/${caseData.protocol}`);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Swal.fire(
        "Erro",
        error.response?.data?.message || "Erro ao enviar o relatório",
        "error"
      );
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  };

  const getOrNA = (value) => (value ? value : "N/A");

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.margin}>
          <div className={styles.marginContent}>
            <h1>Gerar Relatório do Caso</h1>
            <ToGoBack onClick={() => navigate(-1)} content="voltar" />
            <section className={styles.caseDetails}>
              <div className={styles.caseSection}>
                <h1>Informações Gerais</h1>
                <p>
                  <strong>Protocolo:</strong> {getOrNA(caseData.protocol)}
                </p>
                <p>
                  <strong>Título:</strong> {getOrNA(caseData.title)}
                </p>
                <p>
                  <strong>Status:</strong> {getOrNA(caseData.status)}
                </p>
                <p>
                  <strong>Tipo de Caso:</strong> {getOrNA(caseData.caseType)}
                </p>
                <p>
                  <strong>Data de Abertura:</strong>{" "}
                  {formatDate(caseData.openedAt)}
                </p>
                <p>
                  <strong>Observações:</strong> {getOrNA(caseData.observations)}
                </p>
                <p>
                  <strong>Número de Inquérito:</strong>{" "}
                  {getOrNA(caseData.inquiryNumber)}
                </p>
                <p>
                  <strong>Autoridade Requisitante:</strong>{" "}
                  {getOrNA(caseData.requestingAuthority)}
                </p>
                <p>
                  <strong>Instituição Requisitante:</strong>{" "}
                  {getOrNA(caseData.requestingInstitution)}
                </p>
              </div>
              <div className={styles.caseSection}>
                {caseData.questions && caseData.questions.length > 0 && (
                  <div>
                    <h2>Perguntas</h2>
                    <ul>
                      {caseData.questions.map((item, index) => (
                        <li key={index}>{item.question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className={styles.caseSection}>
                <h2>Dados da Vítima</h2>
                <p>
                  <strong>Nome:</strong> {getOrNA(caseData.patient?.name)}
                </p>
                <p>
                  <strong>NIC:</strong> {getOrNA(caseData.patient?.nic)}
                </p>
                <p>
                  <strong>Idade:</strong> {getOrNA(caseData.patient?.age)}
                </p>
                <p>
                  <strong>Status de Identificação:</strong>{" "}
                  {getOrNA(caseData.patient?.identificationStatus)}
                </p>
                <Button
                  variant="generic-secondary"
                  type="button"
                  onClick={confirmEdit}
                  className={`${styles.editButton} ${
                    editVictim ? styles.edited : ""
                  }`}
                >
                  {editVictim
                    ? "Dados da vítima editados"
                    : "Editar dados da vítima"}
                </Button>
              </div>
              <div className={styles.caseSection}>
                <h2>Localização do Ocorrido</h2>
                <p>
                  <strong>Rua:</strong> {getOrNA(caseData.location?.street)}
                </p>
                <p>
                  <strong>Bairro:</strong>{" "}
                  {getOrNA(caseData.location?.district)}
                </p>
                <p>
                  <strong>Cidade:</strong> {getOrNA(caseData.location?.city)}
                </p>
                <p>
                  <strong>Estado:</strong> {getOrNA(caseData.location?.state)}
                </p>
                <p>
                  <strong>CEP:</strong> {getOrNA(caseData.location?.zipCode)}
                </p>
              </div>
              <div className={styles.caseSection}>
                <h2>Responsável pela Abertura</h2>
                <p>
                  <strong>Nome:</strong> {getOrNA(caseData.openedBy?.name)}
                </p>
                <p>
                  <strong>Cargo:</strong> {getOrNA(caseData.openedBy?.role)}
                </p>
              </div>
              <div className={styles.caseSection}>
                <h2>Profissionais</h2>
                <div>
                  {caseData.professional.length > 0 ? (
                    caseData.professional.map((pessoa) => (
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
              <div className={styles.caseSection}>
                <h2>Evidências</h2>
                <div className={styles.cardList}>
                  {caseData.evidence.length > 0 ? (
                    caseData.evidence.map((evid) => (
                      <div key={evid._id} className={styles.card}>
                        <p>
                          <strong>Título:</strong> {getOrNA(evid.title)}
                        </p>
                        <p>
                          <strong>Depoimentos:</strong>{" "}
                          {getOrNA(evid.testimony)}
                        </p>
                        <p>
                          <strong>Descrição Técnica:</strong>{" "}
                          {getOrNA(evid.descriptionTechnical)}
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
                        <fieldset>
                          <legend>Laudo Gerado</legend>
                          <p>
                            <strong>Conclusão do Laudo:</strong>{" "}
                            {getOrNA(evid.reportEvidence.note)}
                          </p>
                          <p>
                            <strong>Análise Técnica:</strong>{" "}
                            {getOrNA(evid.reportEvidence.descriptionTechnical)}
                          </p>
                          <p>
                            <strong>Concluído por:</strong>{" "}
                            {getOrNA(evid.reportEvidence.responsible.name)}
                          </p>
                          <p>
                            <strong>Data do Laudo:</strong>{" "}
                            {formatDate(evid.reportEvidence.createdAt)}
                          </p>
                        </fieldset>
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma evidência registrada.</p>
                  )}
                </div>
              </div>
            </section>
            {showEditModal && (
              <div
                className={styles.modalOverlay}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowEditModal(false);
                  }
                }}
              >
                <div className={styles.modalContent}>
                  <h2>Editar Dados da Vítima</h2>
                  <div className={styles.formGroup}>
                    <label>Nome completo:*</label>
                    <input
                      value={victimData.name}
                      onChange={(e) =>
                        setVictimData({ ...victimData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Idade:</label>
                    <input
                      type="number"
                      value={victimData.age}
                      onChange={(e) => {
                        const value = e.target.value;
                        setVictimData({
                          ...victimData,
                          age: value === "" ? undefined : Number(value),
                        });
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CPF:</label>
                    <input
                      value={victimData.cpf}
                      onChange={(e) =>
                        setVictimData({ ...victimData, cpf: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Gênero:</label>
                    <select
                      value={victimData.gender}
                      onChange={(e) =>
                        setVictimData({
                          ...victimData,
                          gender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO"> Feminino</option>
                      <option value="NAO-BINARIO">Não-Binario</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Status de Identificação:*</label>
                    <select
                      value={victimData.identificationStatus}
                      onChange={(e) =>
                        setVictimData({
                          ...victimData,
                          identificationStatus: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="IDENTIFICADO">Identificado</option>
                      <option value="NÃO IDENTIFICADO">Não Identificado</option>
                      <option value="PARCIALMENTE IDENTIFICADO">
                        Parcialmente Identificado
                      </option>
                    </select>
                  </div>
                  <fieldset>
                    <legend>Endereço</legend>
                    <div className={styles.formGroup}>
                      <label>Rua:</label>
                      <input
                        value={victimData.address.street}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              street: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Número:</label>
                      <input
                        type="number"
                        value={victimData.address.houseNumber}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              houseNumber: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Bairro:</label>
                      <input
                        value={victimData.address.district}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              district: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Cidade:</label>
                      <input
                        value={victimData.address.city}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Estado:</label>
                      <input
                        value={victimData.address.state}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              state: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CEP:</label>
                      <input
                        value={victimData.address.zipCode}
                        onChange={(e) =>
                          setVictimData({
                            ...victimData,
                            address: {
                              ...victimData.address,
                              zipCode: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </fieldset>
                  <div className={styles.modalButtons}>
                    <Button
                      variant="button-save"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditVictim(true);
                      }}
                      className={styles.saveButton}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="button-cancel"
                      onClick={() => setShowEditModal(false)}
                      className={styles.cancelButton}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <h2 className={styles.title}>Relatório Final do Caso</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>Descrição do Caso:*</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={styles.textarea}
              />
              <label>Conclusão:*</label>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                required
                className={styles.textarea}
              />
              <Button
                variant="generic-secondary"
                onClick={handleGenerateConclusion}
              >
                Conclusão com IA
              </Button>
              {answers.map((ans, idx) => (
                <div key={idx}>
                  <label>Pergunta {idx + 1}:*</label>
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
              ))}
              <label>Status do Caso:*</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Selecione o novo status do caso</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="ARQUIVADO">Arquivado</option>
              </select>
              <Button type="submit" variant="generic-primary">
                Salvar relatório
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReportForm;
