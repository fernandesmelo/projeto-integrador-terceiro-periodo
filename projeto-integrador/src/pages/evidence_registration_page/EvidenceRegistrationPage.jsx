import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./EvidenceRegistrationPage.module.css";
import axios from "axios";

const EvidenceRegistrationPage = () => {
  const { protocol } = useParams();
  const [title, settitle] = useState("");
  const [testimony, settestimony] = useState("");
  const [descriptionTechnical, setdescriptionTechnical] = useState("");
  const [photo, setphoto] = useState(null);
  const [condition, setcondition] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [obs, setobs] = useState("");
  const [category, setcategory] = useState("");

  const sendEvidence = async (e) => {
    e.preventDefault();

    if (!title || !descriptionTechnical || !condition) {
      alert(
        "Título, descrição técnica e condição da evidência são campos obrigatórios!"
      );
      return;
    }

    const apiURL =
      "https://sistema-odonto-legal.onrender.com/api/evidence/create";

    const dados = {
      protocol,
      title,
      testimony,
      descriptionTechnical,
      photo,
      condition,
      latitude,
      longitude,
      obs,
      category,
    };

    try {
      const response = await axios.post(apiURL, dados, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert("Evidência cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error.response?.data || error);
      console.log("Detalhes dos erros:", error.response?.data?.errors);

      alert(
        `Erro ao enviar os dados: ${
          error.response?.data?.message || "Tente novamente mais tarde."
        }`
      );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setphoto(reader.result); // Armazena a imagem em base64 no estado `photo`
      };
      reader.readAsDataURL(file); // Converte o arquivo para base64
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.nav_container}>
        <Nav />
        <div className={styles.evidence_registration}>
          <h3>Insira as informações das evidências</h3>
          <form onSubmit={sendEvidence}>
            <label htmlFor="title">Título:</label>
            <input
              type="text"
              id="title"
              placeholder="Insira o título"
              className={styles.input}
              value={title}
              onChange={(e) => settitle(e.target.value)}
              required
            />
            <label htmlFor="descriptionTechnical">Descrição Técnica:</label>
            <input
              type="text"
              id="descriptionTechnical"
              placeholder="Insira a descrição técnica"
              className={styles.input}
              value={descriptionTechnical}
              onChange={(e) => setdescriptionTechnical(e.target.value)}
              required // Campo obrigatório
            />
            <label htmlFor="testimony">testimony:</label>
            <input
              type="text"
              id="testimony"
              placeholder="Insira a testimony"
              className={styles.input}
              value={testimony}
              onChange={(e) => settestimony(e.target.value)}
            />
            <label htmlFor="imagem">
              Imagem (radiografias, fotografias intraorais):
            </label>
            <input
              type="file"
              id="imagem"
              className={styles.input}
              onChange={handleImageChange}
              accept="image/*"
              required // Campo obrigatório
            />
            {photo && (
              <div>
                <img
                  src={photo}
                  alt="Imagem selecionada"
                  style={{ maxWidth: "200px" }}
                  value={photo}
                  onChange={(e) => setphoto(e.target.value)}
                />
              </div>
            )}
            <label htmlFor="condicaoEvidencia">Condição da evidência:</label>
            <select
              id="condicaoEvidencia"
              onChange={(e) => setcondition(e.target.value)}
              required
              className={styles.input}
            >
              <option value="">Selecione a condição</option>
              <option value="INTEGRA">Íntegra</option>
              <option value="ALTERADA">Alterada</option>
              <option value="DANIFICADA">Danificada</option>
              <option value="CORROMPIDO">Corrompido</option>
              <option value="APAGADA">Apagada</option>
              <option value="VOLATIL">Volátil</option>
              <option value="INACESSIVEL">Inacessível</option>
            </select>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              id="latitude"
              placeholder="Insira a latitude"
              className={styles.input}
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))} // Converte para número
            />
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              id="longitude"
              placeholder="Insira a longitude"
              className={styles.input}
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))} // Converte para número
            />
            <label htmlFor="obs">Observação:</label>
            <textarea
              id="obs"
              placeholder="Insira a observação"
              className={styles.input}
              value={obs}
              onChange={(e) => setobs(e.target.value)}
            />
            <label htmlFor="category">category:</label>
            <select
              id="category"
              className={styles.input}
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            >
              <option value="">Selecione a category</option>
              <option value="DENTAL">Dental</option>
              <option value="RADIOGRAFICA">Radiográfica</option>
              <option value="FOTOGRAFICA">Fotográfica</option>
              <option value="DOCUMENTAL">Documental</option>
              <option value="BIOLOGICA">BIOLOGICA</option>
              <option value="LESIONAL">Lesional</option>
              <option value="DIGITAL">Digital</option>
            </select>
            <button type="submit" className={styles.button}>
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvidenceRegistrationPage;
