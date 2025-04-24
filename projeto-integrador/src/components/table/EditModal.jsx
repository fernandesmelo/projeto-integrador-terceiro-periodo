import React, { useState } from "react";
import styles from "./EditModal.module.css"; // você pode criar esse CSS depois
import axios from "axios";

const EditModal = ({ protocol, currentTitle, currentCaseType, onClose, onUpdate }) => {
  const [title, setTitle] = useState(currentTitle);
  const [caseType, setCaseType] = useState(currentCaseType)
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        "https://sistema-odonto-legal.onrender.com/api/cases/data/protocol",
        {
          title,
          caseType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { protocol },
        }
      );
      console.log("Sucesso:", response.data);
      onUpdate(); // recarrega os dados
      onClose(); // fecha o modal
    } catch (err) {
      console.error("Erro ao atualizar:", err.response?.data || err.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Caso</h2>
        <label htmlFor="">titulo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="">tipo de caso</label>
        <select
          name=""
          id=""
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
        >
          <option value="">Selecione o tipo de caso:</option>
          <option value="COLETA DNA">Coleta DNA</option>
          <option value="EXAME MARCA DE MORDIDA">
            Exame marca de mordida
          </option>
          <option value="IDENTIFICAÇÃO DE VÍTIMA">
            Identificação de vítma
          </option>
          <option value="LESÕES CORPORAIS">Exame cadavérico</option>
        </select>
        <div className={styles.actions}>
          <button className={styles.save} onClick={handleSubmit}>Salvar</button>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;