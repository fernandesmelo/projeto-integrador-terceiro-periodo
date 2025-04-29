import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./AddVictim.module.css";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";
import ToGoBack from "../../components/togoback/ToGoBack";

const CreateVictim = () => {
  const navigate = useNavigate();
  const [isSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    const defaultData = {
      nic: "",
      name: "N/A",
      age: Number,
      cpf: "",
      gender: "",
      location: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        houseNumber: Number,
        district: "",
        complement: "",
      },
      identificationStatus: "",
    };

    const savedData = localStorage.getItem("victimFormData");

    if (savedData) {
      const parsed = JSON.parse(savedData);

      return {
        ...defaultData,
        ...parsed,
        location: {
          ...defaultData.location,
          ...(parsed.location || {}),
        },
      };
    }

    return defaultData;
  });

  const cleanObject = (obj) => {
    const cleaned = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedCleaned = cleanObject(value);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else if (typeof value === "string" && value.trim() !== "") {
        cleaned[key] = value.trim();
      } else if (typeof value === "number" && !isNaN(value)) {
        cleaned[key] = value;
      }
    });

    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "location.zip") {
      newValue = value.replace(/\D/g, ""); // mantém apenas dígitos
    }

    if (name === "age" || name === "location.houseNumber") {
      newValue = value === "" ? "" : parseInt(value);
    }

    let updatedData;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      updatedData = {
        ...formData,
        location: {
          ...formData.location,
          [field]: newValue,
        },
      };
    } else {
      updatedData = {
        ...formData,
        [name]: newValue,
      };
    }

    setFormData(updatedData);

    const cleanedData = cleanObject(updatedData);
    localStorage.setItem("victimFormData", JSON.stringify(cleanedData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nic.trim() || !formData.identificationStatus) {
      Swal.fire(
        "Erro",
        "Os campos NIC e Status de Identificação são obrigatórios",
        "error"
      );
      return;
    }

    const cleanedData = cleanObject(formData);
    localStorage.setItem("victimFormData", JSON.stringify(cleanedData));
    navigate("/casos/cadastrar");
  };

  useEffect(() => {
    const cep = formData.location.zip;

    if (cep && cep.length === 8 && /^[0-9]{8}$/.test(cep)) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            Swal.fire("Erro", "CEP não encontrado", "error");
            return;
          }

          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              street: data.logradouro || "",
              district: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || "",
            },
          }));
        })
        .catch(() => {
          Swal.fire("Erro", "Não foi possível consultar o CEP", "error");
        });
    }
  }, [formData.location.zip]);

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.margin}>
          <div className={styles.marginContent}>
            <h1>Cadastro da Vítima</h1>
            <ToGoBack onClick={() => navigate(-1)} />
            <form onSubmit={handleSubmit}>
              <label>NIC:*</label>
              <input
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                required
                placeholder="Número de identificação criminal"
              />
              <label>Nome:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome da vítima"
              />
              <label>Idade:</label>
              <input
                type="number"
                name="age"
                value={formData.age === "" ? "" : Number(formData.age)}
                onChange={handleChange}
                placeholder="Idade da vítima"
              />
              <label>CPF:</label>
              <input
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="CPF da vítima"
              />
              <label>Gênero:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO"> Feminino</option>
                <option value="NAO-BINARIO">Não-Binario</option>
                <option value="OUTRO">Outro</option>
              </select>
              <fieldset>
                <legend>Endereço da Vítima</legend>
                <label>CEP:</label>
                <input
                  type="text"
                  maxLength="8"
                  name="location.zip"
                  value={formData.location.zip}
                  onChange={handleChange}
                  placeholder="CEP da vítima (apenas números)"
                />
                <label>Rua:</label>
                <input
                  name="location.street"
                  value={formData.location.street}
                  onChange={handleChange}
                  placeholder="Rua da vítima"
                />
                <label>Número:</label>
                <input
                  type="number"
                  name="location.houseNumber"
                  value={
                    formData.location.houseNumber === ""
                      ? ""
                      : Number(formData.location.houseNumber)
                  }
                  onChange={handleChange}
                  placeholder="Número da residência da vítima"
                />
                <label>Bairro:</label>
                <input
                  name="location.district"
                  value={formData.location.district}
                  onChange={handleChange}
                  placeholder="Bairro da vítima"
                />
                <label>Cidade:</label>
                <input
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="Cidade da vítima"
                />
                <label>Estado:</label>
                <select
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="Estado da vítima"
                >
                  <option value="">Selecione um estado:</option>
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
                <label>Complemento:</label>
                <input
                  name="location.complement"
                  value={formData.location.complement}
                  onChange={handleChange}
                  placeholder="Complemento do endereço da vítima"
                />
              </fieldset>
              <label>Status de Identificação:*</label>
              <select
                className={styles.status}
                name="identificationStatus"
                value={formData.identificationStatus}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o status:</option>
                <option value="IDENTIFICADO">Identificado</option>
                <option value="NÃO IDENTIFICADO">Não identificado</option>
                <option value="PARCIALMENTE IDENTIFICADO">
                  Parcialmente identificado
                </option>
              </select>
              <Button
                type="button"
                variant="generic-primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Aguarde..." : "Avançar para criar caso"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVictim;
