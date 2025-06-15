import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import styles from "./VictimDetails.module.css"; // você pode criar seus estilos aqui

const VictimDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { victim } = location.state || {};


  if (!victim) {
    return (
      <div className={styles.container}>
        <h2>Vítima não encontrada.</h2>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Detalhes da Vítima</h1>
      <div className={styles.details}>
        <p><strong>Nic:</strong> {victim.nic}</p>
        <p><strong>Nome:</strong> {victim.name || "N/A"}</p>
        <p><strong>Idade:</strong> {victim.age || "N/A"}</p>
        <p><strong>Gênero:</strong> {victim.gender || "N/A"}</p>
        <p><strong>CPF:</strong> {victim.cpf || "N/A"}</p>
        <p><strong>Status do Caso:</strong> {victim.idCase?.status || "N/A"}</p>
        <p><strong>Id do Caso:</strong> {victim.idCase?._id || "N/A"}</p>
        <p><strong>Data de Criação:</strong> {new Date(victim.createdAt).toLocaleDateString("pt-BR")}</p>
        <p><strong>Estado de Identificação:</strong> {victim.identificationStatus || "N/A"}</p>
      </div>
      <Button onClick={() => navigate(-1)}>Voltar</Button>
    </div>
  );
};

export default VictimDetails;