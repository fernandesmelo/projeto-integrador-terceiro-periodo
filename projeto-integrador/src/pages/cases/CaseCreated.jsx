import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import styles from "./CaseCreated.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import ToGoBack from "../../components/togoback/ToGoBack";

const CaseCreated = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [requestingInstitution, setRequestingInstitution] = useState("");
  const [requestingAuthority, setRequestingAuthority] = useState("");
  const [caseType, setCaseType] = useState("");
  const [observations, setObservations] = useState("");
  const [questions, setQuestions] = useState([{ question: "N/A" }]);
  const [nic, setNic] = useState(['']);

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


  const adicionarCampo = () => {
    setNic([...nic, '']);
  }


  const handleChange = (i, valor) => {
    const novosCampos = [...nic];
    novosCampos[i] = valor;
    setNic(novosCampos);
  }

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
      setNic(parsedData.nic || "");
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

    Swal.fire({
      title: "Cadastrando...",
      text: "Por favor, aguarde enquanto o caso é cadastrado.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    await delay(1500);
    try {
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
          confirmButtonColor: "#EB5757",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data?.message || "Tente novamente mais tarde.",
        confirmButtonColor: "#EB5757",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    const cep = location.zipCode;

    if (cep && cep.length === 8 && /^[0-9]{8}$/.test(cep)) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            Swal.fire("Erro", "CEP não encontrado", "error");
            return;
          }

          setLocation((prev) => ({
            ...prev,
            street: data.logradouro || "",
            district: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        })
        .catch(() => {
          Swal.fire("Erro", "Não foi possível consultar o CEP", "error");
        });
    }
  }, [location.zipCode]);

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.margin}>
          <div className={styles.marginContent}>
            <h1>Cadastrar Novo Caso</h1>
            <ToGoBack onClick={() => navigate(-1)} />
            <form onSubmit={handleSubmit}>
              <div>
                <label>NIC*:</label>
                <div>
                  {nic.map((valor, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Campo opcional ${i + 1}`}
                      value={valor}
                      onChange={(e) => handleChange(i, e.target.value)}
                      style={{ display: 'block', marginBottom: '10px' }}
                    />
                  ))}

                  <Button className={styles.addBtn} variant="generic-secondary" onClick={adicionarCampo} type="button">
                    Adicionar outro Nic
                  </Button>
                </div>
                <label htmlFor="Título">TÍtulo*:</label>
                <input
                  className={styles.input}
                  id="Título"
                  type="text"
                  placeholder="Título"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="Número do Inquérito">
                  Número do Inquérito*:
                </label>
                <input
                  required
                  className={styles.input}
                  id="Número do Inquérito"
                  type="text"
                  placeholder="Número do Inquérito"
                  value={inquiryNumber}
                  onChange={(e) => setInquiryNumber(e.target.value)}
                />
                <label htmlFor="Instituição requisitante">
                  Instituição Requisitante*:
                </label>
                <input
                  required
                  className={styles.input}
                  id="Instituição requisitante"
                  type="text"
                  placeholder="Instituição requisitante"
                  value={requestingInstitution}
                  onChange={(e) => setRequestingInstitution(e.target.value)}
                />
                <label htmlFor="Autoridade requisitante">
                  Autoridade Requisitante*:
                </label>
                <input
                  required
                  className={styles.input}
                  id="Autoridade requisitante"
                  type="text"
                  placeholder="Autoridade requisitante"
                  value={requestingAuthority}
                  onChange={(e) => setRequestingAuthority(e.target.value)}
                />
                <label htmlFor="Tipo de caso">Tipo de Caso*:</label>
                <select
                  required
                  className={styles.input}
                  id="Tipo de caso"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                >
                  <option value="">Selecione o tipo de caso:</option>
                  <option value="IDENTIFICAÇÃO">IDENTIFICAÇÃO</option>
                  <option value="AVALIAÇÃO DE LESÕES CORPORAIS">
                    AVALIAÇÃO DE LESÕES CORPORAIS
                  </option>
                  <option value="COLETA DE PROVA">
                    COLETA DE PROVA
                  </option>
                  <option value="PERÍCIA DE RESPONSABILIDADE">PERÍCIA DE RESPONSABILIDADE</option>
                  <option value="EXAME DE VIOLÊNCIA">EXAME DE VIOLÊNCIA</option>
                  <option value="ANÁLISE MULTIVÍTIMA">ANÁLISE MULTIVÍTIMA</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
                <label htmlFor="Observações">Observações:</label>
                <textarea
                  className={styles.input}
                  id="Observações"
                  placeholder="Observações"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
                <h3>Perguntas do Requisitante*:</h3>
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
                        className={styles.removeBtn}
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
                  className={styles.addBtn}
                >
                  Adicionar nova pergunta
                </Button>
                <fieldset>
                  <label htmlFor="CEP">CEP:</label>
                  <input
                    className={styles.input}
                    id="CEP"
                    type="text"
                    maxLength="8"
                    placeholder="Digite o CEP (apenas números)"
                    value={location.zipCode}
                    onChange={(e) =>
                      handleLocationChange("zipCode", e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <legend>Local do Ocorrido</legend>
                  <label htmlFor="Rua">Rua</label>
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
                  <label htmlFor="Estado">Estado:</label>
                  <select
                    className={styles.input}
                    id="Estado"
                    type="text"
                    placeholder="Digite o estado"
                    value={location.state}
                    onChange={(e) =>
                      handleLocationChange("state", e.target.value)
                    }
                  >
                    <option value="">Selecione um estado</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                  <label htmlFor="Cidade">Cidade:</label>
                  <input
                    className={styles.input}
                    id="Cidade"
                    type="text"
                    placeholder="Digite a cidade"
                    value={location.city}
                    onChange={(e) =>
                      handleLocationChange("city", e.target.value)
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
                  />{" "}
                </fieldset>
                <fieldset className={styles.professionalsFieldset}>
                  <legend>Profissionais Envolvidos</legend>
                  <Button
                    className={styles.button}
                    type="button"
                    variant="generic-secondary"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Selecionar profissionais
                  </Button>
                  {dropdownOpen && (
                    <ul className={styles.professionalsList}>
                      {users.map((user) => (
                        <li
                          key={user._id}
                          className={styles.professionalOption}
                        >
                          <label>
                            <input
                              className={styles.check}
                              type="checkbox"
                              checked={envolved.includes(user._id)}
                              onChange={() => toggleUser(user._id)}
                            />
                            {user.name} ({user.role})
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.selectedProfessionals}>
                    <strong>Profissionais selecionados:</strong>
                    <ul className={styles.selectedList}>
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
              </div>
              <Button type="submit" variant="generic-primary">
                Cadastrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCreated;
