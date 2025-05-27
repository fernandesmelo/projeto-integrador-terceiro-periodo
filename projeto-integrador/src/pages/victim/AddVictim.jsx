import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./AddVictim.module.css";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";
import ToGoBack from "../../components/togoback/ToGoBack";
import axios from "axios";
import Odontograma from "../../components/odontograma/Odontograma";

const CreateVictim = () => {
  const navigate = useNavigate()

  const APIVICTIM = "https://sistema-odonto-legal.onrender.com/api/patient/create"
  const token = localStorage.getItem("token")

  const [formData, setFormData] = useState({
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
    odontogram: [],
  })
  const [status, setStatus] = useState(false)

  const handleToothUpdate = (toothStates) => {
    setFormData((prevData) => ({
      ...prevData,
      odontogram: toothStates,
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value
      }))
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedOdontogram = Object.entries(formData.odontogram)
      .map(([tooth, note]) => ({
        tooth: String(tooth),     // certifique-se de que é string
        note: note || '',         // note no lugar de condition
      }))
      .filter(item => item.note !== '');

      
    const dataToSend = {
      ...formData,
      odontogram: formattedOdontogram,

    };

    try {
      console.log("Enviando:", dataToSend); // debug
      const response = await axios.post(APIVICTIM, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("criado com sucesso!", response.data)
      Swal.fire({
        text: "Vitima cadastrada com sucesso.",
        icon: "success",
        title: "Sucesso!"
      })
      navigate('/vitima')
    } catch (err) {
      console.error("erro ao criar", err)
      Swal.fire({
        text: err.response?.data?.message || "Algo deu errado.",
        icon: "error",
        title: "Erro!"
      })
    }
  }



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
              <label>Status de Identificação:*</label>
              <select
                className={styles.status}
                name="identificationStatus"
                value={formData.identificationStatus}
                onChange={(e) => {
                  handleChange(e)
                  setStatus(e.target.value === "IDENTIFICADO" || e.target.value === "PARCIALMENTE IDENTIFICADO" ? true : false)
                }}
                required
              >
                <option value="">Selecione o status:</option>
                <option value="IDENTIFICADO">Identificado</option>
                <option value="NÃO IDENTIFICADO">Não identificado</option>
                <option value="PARCIALMENTE IDENTIFICADO">
                  Parcialmente identificado
                </option>
              </select>
              {status && (

                <div className={styles.details}>
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
                    required
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
                  <div style={{ marginTop: "20px" }}>
                    <h3 className={styles.odontograma}>Odontograma</h3>
                    <Odontograma
                      onChange={handleToothUpdate}
                    />
                  </div>
                </div>)}


              <Button
                type="submit"
                variant="generic-primary"
              >
                Cadastrar vitima
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVictim;
