import React from "react";
import styles from "./DenteModal.module.css";

const estados = ["saudável", "restaurado", "ausente", "cariado", "fraturado", "implante"];

export default function DenteModal({ numero, estadoAtual, onFechar, onSalvar }) {
  const selecionar = (estado) => {
    onSalvar(numero, estado);
    onFechar();
  };

  return (
    <div className={styles.fundo} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Dente {numero}</h3>
        <p>Estado atual: <strong>{estadoAtual || "não definido"}</strong></p>
        <div className={styles.lista}>
          {estados.map((e) => (
            <button key={e} className={styles.botao} onClick={() => selecionar(e)}>
              {e}
            </button>
          ))}
        </div>
        <br />
        <button className={styles.botao} onClick={onFechar}>Cancelar</button>
      </div>
    </div>
  );
}