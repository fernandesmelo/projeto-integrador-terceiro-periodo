import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./CaseReport.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import Nav2 from "../../components/nav2/Nav2";

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
  const [editVictim, setEditVictim] = useState(false); // Controla se está editando
  const [showEditModal, setShowEditModal] = useState(false); // Controla o modal de confirmação
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (response) {
      setShowEditModal(true);
    } else {
      // Continua sem editar
      setEditVictim(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o modal está aberto
    if (showEditModal) {
      Swal.fire(
        "Atenção",
        "Finalize a edição dos dados da vítima antes de enviar",
        "warning"
      );
      return;
    }

    // Validação dos campos obrigatórios
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

    // Só adiciona age se for preenchido
    if (victimData.age !== "" && !isNaN(Number(victimData.age))) {
      updateData.age = Number(victimData.age);
    }

    // Só adiciona houseNumber se for preenchido
    if (
      victimData.address.houseNumber !== "" &&
      !isNaN(Number(victimData.address.houseNumber))
    ) {
      updateData.address.houseNumber = Number(victimData.address.houseNumber);
    }

    try {
      // Primeiro atualiza os dados da vítima se foram editados
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

      // Depois envia o relatório do caso
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

      // Finalmente atualiza o status do caso
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

      Swal.fire("Sucesso!", "Relatório salvo com sucesso!", "success");
      navigate(`/casos/detalhes/${caseData.protocol}`);
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
        <div className={styles.marginContent}>
          <section>
            <div className={styles.caseSection}>
              <h2>Informações Gerais</h2>
              <Nav2 onClick={() => navigate(-1)} content='voltar'/>
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
                <strong>Autoridade requisitante:</strong>{" "}
                {getOrNA(caseData.requestingAuthority)}
              </p>
              <p>
                <strong>Instituição requisitante:</strong>{" "}
                {getOrNA(caseData.requestingInstitution)}
              </p>
            </div>
          </section>

          <section>
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
          </section>

          <section>
            <div className={styles.caseSection}>
              <h2>Dados da vítima</h2>
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
            </div>
          </section>

          <section>
            <div className={styles.caseSection}>
              <h2>Localização do ocorrido</h2>
              <p>
                <strong>Rua:</strong> {getOrNA(caseData.location?.street)}
              </p>
              <p>
                <strong>Bairro:</strong> {getOrNA(caseData.location?.district)}
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
          </section>

          <section>
            <div className={styles.caseSection}>
              <h2>Responsável pela abertura</h2>
              <p>
                <strong>Nome:</strong> {getOrNA(caseData.openedBy?.name)}
              </p>
              <p>
                <strong>Cargo:</strong> {getOrNA(caseData.openedBy?.role)}
              </p>
            </div>
          </section>

          <section>
            <div className={styles.caseSection}>
              <h2>Profissionais </h2>
              <div className={styles.cardList}>
                {caseData.professional.length > 0 ? (
                  caseData.professional.map((pessoa) => (
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
                  <p>Nenhum profissional registrado.</p>
                )}
              </div>
            </div>
          </section>

          <section>
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
                        <strong>Depoimento:</strong> {getOrNA(evid.testimony)}
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

                      <div>
                        <h3>Laudo Gerado</h3>
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
                      </div>
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
                <h3>Editar Dados da Vítima</h3>

                <div className={styles.formGroup}>
                  <label>Nome completo:</label>
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
                  <label>Genero:</label>
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
                  <label>Status de Identificação:</label>
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

                <h4>Endereço</h4>
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

                {/* Adicione os outros campos de endereço conforme necessário */}

                <div className={styles.modalButtons}>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditVictim(true);
                    }}
                    className={styles.saveButton}
                  >
                    Salvar Alterações
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={confirmEdit}
            className={`${styles.editButton} ${
              editVictim ? styles.edited : ""
            }`}
          >
            {editVictim
              ? "✓ Dados da Vítima Editados"
              : "✎ Editar Dados da Vítima"}
          </button>

          <h2 className={styles.title}>Relatório Final do Caso</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Descrição do Caso:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={styles.textarea}
            />

            <label>Conclusão:</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              required
              className={styles.textarea}
            />

            {answers.map((ans, idx) => (
              <div key={idx}>
                <label>Pergunta {idx + 1}:</label>
                <input
                  type="text"
                  value={ans}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            ))}

            <label>Status do Caso:</label>
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

            <button type="submit" className={styles.button}>
              Salvar Relatório
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseReportForm;
