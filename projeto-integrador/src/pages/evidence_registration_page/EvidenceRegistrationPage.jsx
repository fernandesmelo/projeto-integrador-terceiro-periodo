import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./EvidenceRegistrationPage.module.css";
import axios from "axios";
import Swal from "sweetalert2";

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

  const resetForm = () => {
    settitle("");
    settestimony("");
    setdescriptionTechnical("");
    setphoto(null);
    setcondition("");
    setLatitude("");
    setLongitude("");
    setobs("");
    setcategory("");
  };

  const sendEvidence = async (e) => {
    e.preventDefault();

    console.log("Protocolo recebido:", protocol);

    if (!title || !descriptionTechnical || !condition) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Título, descrição técnica e condição da evidência são obrigatórios!",
      });
      return;
    }

    const apiURL =
      "https://sistema-odonto-legal.onrender.com/api/evidence/create";

    const dados = {
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
      Swal.fire({
        title: "Enviando evidência...",
        text: "Por favor, aguarde",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await axios.post(apiURL, dados, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        params: { protocol },
      });

      Swal.fire({
        icon: "success",
        title: "Evidência cadastrada!",
        text: "Os dados foram enviados com sucesso.",
      }).then(() => {
        resetForm();
      });
    } catch (error) {
      console.error("Erro ao enviar os dados:", error.response?.data || error);
      console.log("Detalhes dos erros:", error.response?.data?.errors);

      Swal.fire({
        icon: "error",
        title: "Erro ao enviar evidência",
        text: error.response?.data?.message || "Tente novamente mais tarde.",
      });
    }
  };

  // Função para comprimir a imagem
  const compressImage = (file, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // redimensiona exemplo para reduzir um pouco)
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convertendo para Base64 com qualidade
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Função de mudança da imagem
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      compressImage(file, 0.7).then((compressedImage) => {
        setphoto(compressedImage);
      });
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
            <div>
              <input
                type="text"
                id="title"
                placeholder="Insira o título"
                className={styles.input}
                value={title}
                onChange={(e) => settitle(e.target.value)}
                required
              />
            </div>
            <label htmlFor="descriptionTechnical">Descrição Técnica:</label>
            <div>
              <input
                type="text"
                id="descriptionTechnical"
                placeholder="Insira a descrição técnica"
                className={styles.input}
                value={descriptionTechnical}
                onChange={(e) => setdescriptionTechnical(e.target.value)}
                required
              />
            </div>
            <label htmlFor="testimony">Relatos/Depoimentos das Testemunhas:</label>
            <div>
              <input
                type="text"
                id="testimony"
                placeholder="Insira a testimony"
                className={styles.input}
                value={testimony}
                onChange={(e) => settestimony(e.target.value)}
              />
            </div>
            <label htmlFor="imagem">Imagem (radiografias, fotografias intraorais):</label>
            <div>
              <input
                type="file"
                id="imagem"
                className={styles.input}
                onChange={handleImageChange}
                accept="image/*"
                required
              />
              {photo && (
                <div>
                  <img
                    src={photo}
                    alt="Imagem selecionada"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
            </div>
            <label htmlFor="condicaoEvidencia">Condição da evidência:</label>
            <div>
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
            </div>
            <label htmlFor="latitude">Latitude:</label>
            <div>
              <input
                type="number"
                id="latitude"
                placeholder="Insira a latitude"
                className={styles.input}
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
              />
            </div>
            <label htmlFor="longitude">Longitude:</label>
            <div>
              <input
                type="number"
                id="longitude"
                placeholder="Insira a longitude"
                className={styles.input}
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
              />
            </div>
            <label htmlFor="obs">Observação:</label>
            <div>
              <textarea
                id="obs"
                placeholder="Insira a observação"
                className={styles.input}
                value={obs}
                onChange={(e) => setobs(e.target.value)}
              />
            </div>
            <label htmlFor="category">category:</label>
            <div>
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

export default EvidenceRegistrationPage;
