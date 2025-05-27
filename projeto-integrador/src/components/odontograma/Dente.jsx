import React, { useState } from "react";
import DenteModal from "./DenteModal";
import DenteSVG from "../../assets/dente.svg";
import styles from "./Dente.module.css";

export default function Dente({ numero, estado, onUpdate }) {
  const [aberto, setAberto] = useState(false);

  const getClasseEstado = (estado) => {
    if (estado === "saudável") return styles.saudavel;
    if (estado === "ausente") return styles.ausente;
    if (estado === "restaurado") return styles.restaurado;
    if (estado === "fraturado") return styles.fraturado;
    if (estado === "cariado") return styles.cariado;
    if (estado === "implante") return styles.implante;
    return styles.outro;
  };

  return (
    <>
      <button type="button"
        className={`${styles.botao} ${getClasseEstado(estado)}`}
        onClick={() => setAberto(true)}
        title={`Dente ${numero} - Estado: ${estado || "não definido"}`}
      >
        {/* Aqui o SVG como imagem */}
        <img src={DenteSVG} alt={`Dente ${numero}`} className={styles.imagemDente} />
        <span className={styles.numeroDente}>{numero}</span>
      </button>

      {aberto && (
        <DenteModal
          numero={numero}
          estadoAtual={estado}
          onFechar={() => setAberto(false)}
          onSalvar={onUpdate}
        />
      )}
    </>
  );
}