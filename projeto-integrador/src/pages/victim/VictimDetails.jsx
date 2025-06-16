import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import styles from "./VictimDetails.module.css"; // você pode criar seus estilos aqui
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";

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
    <div className={styles.caseCreated}>
      <Header/>
      <div className={styles.content}>
        <Nav />
        <div className={styles.margin}>
          <div className={styles.marginContent}>
            <h1 className={styles.title}>Detalhes da vitima</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDetails;