import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./addVictim.module.css";
import Swal from "sweetalert2";

const CreateVictim = () => {
  const navigate = useNavigate();
  const [isSubmitting] = useState(false);

  // Recupera dados do localStorage se existirem
  const [formData, setFormData] = useState(() => {
    const defaultData = {
      nic: "",
      name: "N/A",
      age: Number,
      cpf: "",
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
      // Faz merge com os dados padrão, garantindo que location e outros campos existam
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

    // Converte para número se o campo for 'age' ou algum campo numérico
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

  return (
    <div className={styles.caseCreated}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.marginContent}>
          <h1>Cadastro da vítima</h1>
          <form onSubmit={handleSubmit}>
            <label>NIC*:</label>
            <input
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              required
            />

            <label>Nome:</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>Idade:</label>
            <input
              type="number"
              name="age"
              value={formData.age === "" ? "" : Number(formData.age)}
              onChange={handleChange}
            />

            <label>CPF:</label>
            <input name="cpf" value={formData.cpf} onChange={handleChange} />

            <fieldset>
              <legend>Endereço da vítima (opcional)</legend>

              <label>Rua:</label>
              <input
                name="location.street"
                value={formData.location.street}
                onChange={handleChange}
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
              />

              <label>Bairro:</label>
              <input
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
              />

              <label>Cidade:</label>
              <input
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              />

              <label>Estado:</label>
              <input
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
              />

              <label>CEP:</label>
              <input
                name="location.zip"
                value={formData.location.zip}
                onChange={handleChange}
              />

              <label>Complemento:</label>
              <input
                name="location.complement"
                value={formData.location.complement}
                onChange={handleChange}
              />
            </fieldset>

            <label>Status de Identificação*:</label>
            <select
              name="identificationStatus"
              value={formData.identificationStatus}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="IDENTIFICADO">IDENTIFICADO</option>
              <option value="NÃO IDENTIFICADO">NÃO IDENTIFICADO</option>
              <option value="PARCIALMENTE IDENTIFICADO">
                PARCIALMENTE IDENTIFICADO
              </option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: 20 }}
            >
              {isSubmitting ? "Aguarde..." : "Avançar para criar caso"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVictim;
