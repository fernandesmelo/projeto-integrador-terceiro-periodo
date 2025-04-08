import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./CaseCreated.module.css";
import Swal from "sweetalert2";
import axios from "axios";

const CaseCreated = () => {
  const navigate = useNavigate();
  const [nic, setNic] = useState("");
  const [title, setTitle] = useState("");
  const [inquiryNumber, setInquiryNumber] = useState("");
  const [BO, setBO] = useState("");
  const [caseType, setCaseType] = useState("ACIDENTE");
  const [observations, setObservations] = useState("");

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

  const limparCampos = () => {
    setNic("");
    setTitle("");
    setInquiryNumber("");
    setBO("");
    setCaseType("ACIDENTE");
    setObservations("");
    setLocation({
      street: "",
      houseNumber: "",
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
          "https://sistema-odonto-legal.onrender.com/api/search/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              page: 1,
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
  }, []);

  const toggleUser = (userId) => {
    setEnvolved((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleLocationChange = (field, value) => {
    setLocation({ ...location, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = {
      nic,
      title,
      inquiryNumber,
      BO,
      caseType,
      observations,
      location,
      involved: envolved,
    };

    console.log("Payload enviado pro back:", data);

    try {
      Swal.fire({
        title: "Enviando...",
        text: "Por favor, aguarde enquanto o caso é cadastrado.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await axios.post(
        "https://sistema-odonto-legal.onrender.com/api/cases/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.close();

      if (res.status === 201) {
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
          title: "Erro ao cadastrar",
          text: res.data?.message || "Tente novamente mais tarde.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `Erro`,
        text: err.response?.data?.message || "Tente novamente mais tarde.",
        confirmButtonColor: "#d33",
      });
      console.error(err); // log no console para ajudar na depuração
    }
  };

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.marginContent}>
          <h1>Cadastre um novo caso</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Título">TÍtulo*:</label>
              <input
                className={styles.input}
                id="Título"
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="Número do Inquérito">Número do Inquérito:</label>
              <input
                className={styles.input}
                id="Número do Inquérito"
                type="text"
                placeholder="Número do Inquérito"
                value={inquiryNumber}
                onChange={(e) => setInquiryNumber(e.target.value)}
              />
              <label htmlFor="Boletim de ocorrência">
                Boletim de ocorrência:
              </label>
              <input
                className={styles.input}
                id="Boletim de ocorrência"
                type="text"
                placeholder="BO"
                value={BO}
                onChange={(e) => setBO(e.target.value)}
              />
              <label htmlFor="Tipo de caso">Tipo de caso*:</label>
              <select
                className={styles.input}
                id="Tipo de caso"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
              >
                {[
                  "ACIDENTE",
                  "IDENTIFICAÇÃO DE VÍTIMA",
                  "EXAME CRIMINAL",
                  "MORDIDA",
                  "AVALIAÇÃO DE LESÕES",
                  "FRAUDE ODONTOLÓGICA",
                  "DIREITOS HUMANOS",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label htmlFor="Observações">Observações:</label>
              <textarea
                className={styles.input}
                id="Observações"
                placeholder="Observações"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />

              <h3>Endereço</h3>
              <label htmlFor="Rua">Rua</label>
              <input
                className={styles.input}
                id="Rua"
                type="text"
                placeholder="Digite o nome da rua"
                value={location.street}
                onChange={(e) => handleLocationChange("street", e.target.value)}
              />

              <label htmlFor="Número">Número</label>
              <input
                className={styles.input}
                id="Número"
                type="text"
                placeholder="Digite o número da casa"
                value={location.houseNumber}
                onChange={(e) =>
                  handleLocationChange("houseNumber", e.target.value)
                }
              />

              <label htmlFor="Bairro">Bairro</label>
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

              <label htmlFor="Cidade">Cidade</label>
              <input
                className={styles.input}
                id="Cidade"
                type="text"
                placeholder="Digite a cidade"
                value={location.city}
                onChange={(e) => handleLocationChange("city", e.target.value)}
              />

              <label htmlFor="Estado">Estado</label>
              <input
                className={styles.input}
                id="Estado"
                type="text"
                placeholder="Digite o estado"
                value={location.state}
                onChange={(e) => handleLocationChange("state", e.target.value)}
              />

              <label htmlFor="CEP">CEP</label>
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

              <label htmlFor="Complemento">Complemento</label>
              <input
                className={styles.input}
                id="Complemento"
                type="text"
                placeholder="Digite o complemento (opcional)"
                value={location.complement}
                onChange={(e) =>
                  handleLocationChange("complement", e.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="NIC">NIC*</label>
              <input
                className={styles.input}
                id="NIC"
                type="text"
                placeholder="Número de Identificação do Paciente"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
            </div>

            <div>
              <button
                className={styles.button}
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Selecionar envolvidos ▼
              </button>
              {dropdownOpen && (
                <ul className={styles.input}>
                  {users.map((user) => (
                    <li key={user.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={envolved.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                        />
                        {user.name} ({user.role})
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <strong>Envolvidos selecionados:</strong>
              <ul>
                {users
                  .filter((u) => envolved.includes(u.id))
                  .map((u) => (
                    <li key={u.id}>
                      {u.name} ({u.role})
                    </li>
                  ))}
              </ul>
            </div>

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
