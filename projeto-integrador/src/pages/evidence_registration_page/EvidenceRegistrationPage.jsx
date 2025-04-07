import React, { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./EvidenceRegistrationPage.module.css";

const EvidenceRegistrationPage = () => {
  const [titulo, setTitulo] = useState("");
  const [descricaoTecnica, setDescricaoTecnica] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [observacao, setObservacao] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !descricaoTecnica || !condicaoDaEvidencia) {
      alert("Título, descrição técnica e condição da evidência são campos obrigatórios!");
      return;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.nav_container}>
        <Nav />
        <div className={styles.evidence_registration}>
          <h3>Insira as informações das evidências</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              placeholder="Insira o título"
              className={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
             <label htmlFor="descricaoTecnica">Descrição Técnica:</label>
            <input
              type="text"
              id="descricaoTecnica"
              placeholder="Insira a descrição técnica"
              className={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required // Campo obrigatório
            />
            <label htmlFor="imagem">Imagem (radiografias, fotografias intraorais):</label>
            <input
              type="file"
              id="imagem"
              className={styles.input}
              onChange={handleImageChange}
              accept="image/*"
              required // Campo obrigatório
            />
            {selectedImage && (
              <div>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Imagem selecionada"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            <label htmlFor="condicaoEvidencia">Condição da evidência:</label>
            <select id="condicaoEvidencia" required className={styles.input}>
              <option value="">Selecione a condição</option>
              <option>Íntegra</option>
              <option>Alterada</option>
              <option>Danificada</option>
              <option>Corrompido</option>
              <option>Apagada</option>
              <option>Volátil</option>
              <option>Inacessível</option>
            </select>
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="text"
              id="latitude"
              placeholder="Insira a latitude"
              className={styles.input}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="text"
              id="longitude"
              placeholder="Insira a longitude"
              className={styles.input}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <label htmlFor="observacao">Observação:</label>
            <textarea
              id="observacao"
              placeholder="Insira a observação"
              className={styles.input}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            <label htmlFor="categoria">Categoria:</label>
            <select
              id="categoria"
              className={styles.input}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione a categoria</option>
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