import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./EvidenceRegistrationPage.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EvidenceRegistrationPage = () => {
  const navigate = useNavigate();
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
        navigate("/casos");
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
            <input
              type="text"
              id="title"
              placeholder="Insira um título"
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
              required
            />
            <label htmlFor="testimony">Testemunhas (Relatos/Depoimentos):</label>
            <input
              type="text"
              id="testimony"
              placeholder="Insira os relatos/depoimentos das testemunhas"
              className={styles.input}
              value={testimony}
              onChange={(e) => settestimony(e.target.value)}
            />
            <label htmlFor="imagem">
              Imagens (Radiografias/Fotografias Intraorais):
            </label>
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
            <label htmlFor="condicaoEvidencia">Condição da Evidência:</label>
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
              <option value="CORROMPIDO">Corrompida</option>
              <option value="APAGADA">Apagada</option>
              <option value="VOLATIL">Volátil</option>
              <option value="INACESSIVEL">Inacessível</option>
            </select>
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
            <input
              type="number"
              id="longitude"
              placeholder="Insira a longitude"
              className={styles.input}
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
            />
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLatitude(position.coords.latitude);
                      setLongitude(position.coords.longitude);
                    },
                    (error) => {
                      console.error(error);
                      Swal.fire({
                        icon: "error",
                        title: "Erro ao obter localização",
                        text: "Não foi possível obter sua localização. Verifique se você concedeu permissão.",
                      });
                    }
                  );
                } else {
                  Swal.fire({
                    icon: "warning",
                    title: "Geolocalização não suportada",
                    text: "Seu navegador não suporta essa funcionalidade.",
                  });
                }
              }}
              className={styles.button_location}
            >
              Usar minha localização
            </button>
            <label htmlFor="obs">Observação:</label>
            <textarea
              id="obs"
              placeholder="Insira uma observação"
              className={styles.input}
              value={obs}
              onChange={(e) => setobs(e.target.value)}
            />
            <label htmlFor="category">Categoria:</label>
            <select
              id="category"
              className={styles.input}
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            >
              <option value="">Selecione a categoria</option>
              <option value="RADIOGRAFICA">Radiográfica</option>
              <option value="FOTOGRAFICA">Fotográfica</option>
              <option value="DOCUMENTAL">Documental</option>
              <option value="BIOLOGICA">Biológica</option>
              <option value="LESIONAL">Lesional</option>
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
