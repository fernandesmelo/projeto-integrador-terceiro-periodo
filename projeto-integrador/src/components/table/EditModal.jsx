import React, { useState } from "react";
import styles from "./EditModal.module.css"; // você pode criar esse CSS depois

const EditModal = ({
  protocol,
  currentLocation,
  currentObservations,
  currentTitle,
  currentCaseType,
  currentInquiryNumber,
  currentRequestingInstitution,
  currentRequestingAuthority,
  onClose,
  onNextStep,
 }) => {
  const [title, setTitle] = useState(currentTitle);
  const [caseType, setCaseType] = useState(currentCaseType)
  const [observations, setObservations] = useState(currentObservations)
  const [location] = useState(currentLocation)
  const [inquiryNumber, setInquiryNumber] = useState(currentInquiryNumber)
  const [requestingInstitution, setRequestingInstitution] = useState(currentRequestingInstitution) 
  const [requestingAuthority, setRequestingAuthority] = useState(currentRequestingAuthority)
 




  const handleContinue = () => {
    onNextStep({
      protocol,
      title,
      caseType,
      observations,
      location,
      inquiryNumber,
      requestingInstitution,
      requestingAuthority,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Caso</h2>
        <label htmlFor="title">titulo</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="inquiryNumber">Numero de inquerito</label>
        <input
          id="inquiryNumber"
          type="text"
          value={inquiryNumber}
          onChange={(e) => setInquiryNumber(e.target.value)}
        />
        <label htmlFor="typeCase">tipo de caso</label>
        <select
          name=""
          id="typeCase"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
        >
          <option value="">Selecione o tipo de caso:</option>
          <option value="COLETA DNA">Coleta DNA</option>
          <option value="EXAME MARCA DE MORDIDA">Exame marca de mordida</option>
          <option value="IDENTIFICAÇÃO DE VÍTIMA">Identificação de vítma</option>
          <option value="LESÕES CORPORAIS">Exame cadavérico</option>
        </select>
        <label htmlFor="observations">Observações:</label>
        <textarea
          className={styles.input}
          id="observations"
          placeholder="Observações"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
        <label htmlFor="requestingInstitution">Instituição Requisitante</label>
        <input
          type="text"
          id="requestingInstitution"
          value={requestingInstitution}
          onChange={(e) =>
            setRequestingInstitution(e.target.value)
          }
        />
        <label htmlFor="requestingAuthority">Autoridade Requisitante</label>
        <input
          type="text"
          id="requestingAuthority"
          value={requestingAuthority}
          onChange={(e) =>
            setRequestingAuthority(e.target.value)
          }
        />
        <div className={styles.actions}>
          <button className={styles.save} onClick={handleContinue}>Continuar</button>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
