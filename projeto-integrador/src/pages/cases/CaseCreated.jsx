import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import styles from "./CaseCreated.module.css";
import Swal from "sweetalert2";
import axios from "axios";

const CaseCreated = () => {
  const navigate = useNavigate();
  const [nic, setNic] = useState("");
  const [title, setTitle] = useState("");
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [requestingInstitution, setRequestingInstitution] = useState("");
  const [requestingAuthority, setRequestingAuthority] = useState("");
  const [caseType, setCaseType] = useState("");
  const [observations, setObservations] = useState("");
  const [questions, setQuestions] = useState([{ question: "" }]);

  const [location, setLocation] = useState({
    street: "",
    houseNumber: Number,
    district: "",
    city: "",
    state: "",
    zipCode: "",
    complement: "",
  });

  const [users, setUsers] = useState([]);
  const [envolved, setEnvolved] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "" }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const limparCampos = () => {
    setNic("");
    setTitle("");
    setInquiryNumber("");
    setCaseType("ACIDENTE");
    setObservations("");
    setLocation({
      street: "",
      houseNumber: Number,
      district: "",
      city: "",
      state: "",
      zipCode: "",
      complement: "",
    });
    setEnvolved([]);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://sistema-odonto-legal.onrender.com/api/search/button",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = res.data;
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
    const victimFormData = localStorage.getItem("victimFormData");
    if (victimFormData) {
      const parsedData = JSON.parse(victimFormData);
      // Definindo o estado de 'nic' com o valor recuperado
      setNic(parsedData.nic || "");
      // Defina outros estados se necessário
      // Exemplo: setTitle(parsedData.title || "");
    }
  }, []);

  const toggleUser = (userId) => {
    setEnvolved((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleLocationChange = (field, value) => {
    setLocation((prev) => ({
      ...prev,
      [field]: field === "houseNumber" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = {
      nic,
      title,
      inquiryNumber,
      requestingInstitution,
      requestingAuthority,
      caseType,
      observations,
      location,
      questions,
      professional: envolved,
    };
    const victimFormData = localStorage.getItem("victimFormData");
    console.log("Payload enviado pro back:", data);

    try {
      Swal.fire({
        title: "Enviando...",
        text: "Por favor, aguarde enquanto a vítima é cadastrada.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await delay(1500);

      const patientResponse = await axios.post(
        "https://sistema-odonto-legal.onrender.com/api/patient/create",
        victimFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.removeItem("victimFormData");
      Swal.close();

      if (patientResponse.status === 201) {
        // Vítima cadastrada com sucesso, agora cadastrar o caso

        const data = {
          nic,
          title,
          inquiryNumber,
          requestingInstitution,
          requestingAuthority,
          caseType,
          observations,
          location,
          questions,
          professional: envolved,
        };

        Swal.fire({
          title: "Cadastrando...",
          text: "Por favor, aguarde enquanto o caso é cadastrado.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await delay(1500);
        // Passo 2: Cadastrar o caso
        const caseResponse = await axios.post(
          "https://sistema-odonto-legal.onrender.com/api/cases/create",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (caseResponse.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Caso cadastrado!",
            text: "Clique em ok e seja redirecionado para a página de casos.",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            navigate("/casos");
          });
          limparCampos();
        } else {
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar o caso",
            text:
              caseResponse.err.response?.data?.message ||
              "Tente novamente mais tarde.",
            confirmButtonColor: "#d33",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro ao cadastrar a vítima",
          text:
            patientResponse.err.response?.data?.message ||
            "Tente novamente mais tarde.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data?.message || "Tente novamente mais tarde.",
        confirmButtonColor: "#d33",
      });
      console.error(err);
    }
  };

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.marginContent}>
          <h1>Cadastrar Novo Caso</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>NIC:</label>
              <input
                className={styles.input}
                name="nic"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
                readOnly
                placeholder="Número de identificação civil"
              />
              <label htmlFor="Título">TÍtulo:</label>
              <input
                className={styles.input}
                id="Título"
                type="text"
                placeholder="Título do caso"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="Número do Inquérito">Número do Inquérito:</label>
              <input
                className={styles.input}
                id="Número do Inquérito"
                type="text"
                placeholder="Número do inquérito"
                value={inquiryNumber}
                onChange={(e) => setInquiryNumber(e.target.value)}
              />
              <label htmlFor="Instituição requisitante">
                Instituição Requisitante:
              </label>
              <input
                className={styles.input}
                id="Instituição requisitante"
                type="text"
                placeholder="Instituição requisitante"
                value={requestingInstitution}
                onChange={(e) => setRequestingInstitution(e.target.value)}
              />
              <label htmlFor="Autoridade requisitante">
                Autoridade Requisitante:
              </label>
              <input
                className={styles.input}
                id="Autoridade requisitante"
                type="text"
                placeholder="Autoridade requisitante"
                value={requestingAuthority}
                onChange={(e) => setRequestingAuthority(e.target.value)}
              />
              <label htmlFor="Tipo de caso">Tipo de Caso:</label>
              <select
                className={styles.input}
                id="Tipo de caso"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
              >
                <option value="">Selecione o tipo de caso</option>
                <option value="COLETA DNA">Coleta DNA</option>
                <option value="EXAME MARCA DE MORDIDA">
                  Exame marca de mordida
                </option>
                <option value="IDENTIFICAÇÃO DE VÍTIMA">
                  Identificação de vítma
                </option>
                <option value="LESÕES CORPORAIS">Exame cadavérico</option>
              </select>
              <label htmlFor="Observações">Observações:</label>
              <textarea
                className={styles.input}
                id="Observações"
                placeholder="Observações sobre o caso"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
              <h3>Perguntas do Requisitante:</h3>
              {questions.map((q, index) => (
                <div key={index} className={styles.questionContainer}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={`Pergunta ${index + 1}`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    required
                  />
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="small-secondary"
                      onClick={() => removeQuestion(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="generic-secondary"
                onClick={addQuestion}
              >
                Adicionar nova pergunta
              </Button>
              <fieldset>
                <legend>Local do Ocorrido</legend>
                <label htmlFor="Rua">Rua:</label>
                <input
                  className={styles.input}
                  id="Rua"
                  type="text"
                  placeholder="Digite o nome da rua"
                  value={location.street}
                  onChange={(e) =>
                    handleLocationChange("street", e.target.value)
                  }
                />
                <label htmlFor="Número">Número:</label>
                <input
                  className={styles.input}
                  id="Número"
                  type="number"
                  placeholder="Digite o número da casa"
                  value={location.houseNumber}
                  onChange={(e) =>
                    handleLocationChange("houseNumber", e.target.value)
                  }
                />
                <label htmlFor="Bairro">Bairro:</label>
                <input
                  className={styles.input}
                  id="Bairro"
                  type="text"
                  placeholder="Digite o bairro"
                  value={location.district}
                  onChange={(e) =>
                    handleLocationChange("district", e.target.value)
                  }
                />
                <label htmlFor="Cidade">Cidade:</label>
                <input
                  className={styles.input}
                  id="Cidade"
                  type="text"
                  placeholder="Digite a cidade"
                  value={location.city}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                />
                <label htmlFor="Estado">Estado:</label>
                <input
                  className={styles.input}
                  id="Estado"
                  type="text"
                  placeholder="Digite o estado"
                  value={location.state}
                  onChange={(e) =>
                    handleLocationChange("state", e.target.value)
                  }
                />
                <label htmlFor="CEP">CEP:</label>
                <input
                  className={styles.input}
                  id="CEP"
                  type="text"
                  placeholder="Digite o CEP"
                  value={location.zipCode}
                  onChange={(e) =>
                    handleLocationChange("zipCode", e.target.value)
                  }
                />
                <label htmlFor="Complemento">Complemento:</label>
                <input
                  className={styles.input}
                  id="Complemento"
                  type="text"
                  placeholder="Digite o complemento"
                  value={location.complement}
                  onChange={(e) =>
                    handleLocationChange("complement", e.target.value)
                  }
                />
              </fieldset>
            </div>
            <fieldset>
              <legend>Profissionais Envolvidos</legend>
              <div className={styles.professionalsList}>
                {users.map((user) => (
                  <div key={user._id} className={styles.professionalOption}>
                    <label>
                      <input
                        type="checkbox"
                        checked={envolved.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                      />
                      {user.name} ({user.role})
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <strong>Profissionais selecionados:</strong>
                <ul>
                  {users
                    .filter((u) => envolved.includes(u._id))
                    .map((u) => (
                      <li key={u._id}>
                        {u.name} ({u.role})
                      </li>
                    ))}
                </ul>
              </div>
            </fieldset>
            <button type="submit" className={styles.button}>
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaseCreated;
