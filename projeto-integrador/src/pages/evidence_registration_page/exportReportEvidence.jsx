import React from "react";
import logo from "../../assets/logo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./exportReportEvidence.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const LaudoEvidenciaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { caseDetails, evidence } = location.state || {};
  const { protocol, patient } = caseDetails || {};
  console.log("Dados do caso:", caseDetails);
  console.log("Dados da evidência:", evidence);

  if (!evidence || !caseDetails || !protocol || !patient) {
    return <p>Dados insuficientes para gerar o laudo.</p>;
  }

  const formatDate = (iso) => new Date(iso).toLocaleString("pt-BR");

  const gerarPDF = () => {
    const input = document.getElementById("laudo-pdf");
    html2canvas(input, { scale: 1}).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`laudo-${protocol}.pdf`);
      }
    );
  };

  return (
    <div>
      <div className={styles["laudo-container"]} id="laudo-pdf">
        <header className={styles["laudo-header"]}>
          <img src={logo} alt="Logo" className={styles["laudo-logo"]} />
          <h1>Dentalysis Odonto Legal</h1>
          <h2>Laudo Técnico - Protocolo do caso Nº {protocol.toUpperCase()}</h2>
        </header>
        <div className={styles["section-row"]}>
          <div className={styles["section-column"]}>
            <section className={styles["laudo-section"]}>
              <h3>Dados do Caso</h3>
              <p>
                <strong>Insituição requisitante </strong>
                {caseDetails.requestingInstitution || "N/A"}
              </p>
              <p>
                <strong>Autoridade requisitante:</strong>{" "}
                {caseDetails.requestingAuthority || "N/A"}
              </p>
              <p>
                <strong>Número do inquerito:</strong>
                {caseDetails.inquiryNumber || "N/A"}
              </p>
              <p>
                <strong>Tipo de Caso:</strong> {caseDetails.caseType}
              </p>
              <p>
                <strong>Responsável pelo caso:</strong>{" "}
                {caseDetails.openedBy.name}
              </p>
              <p>
                <strong>Cargo:</strong> {caseDetails.openedBy.role}
              </p>
              <p>
                <strong>Data do Caso:</strong>{" "}
                {formatDate(caseDetails.openedAt)}
              </p>
            </section>
          </div>
          <div className={styles["section-column"]}>
            <section className={styles["laudo-section"]}>
              <h3>Dados da Vítima</h3>
              <div className={styles["paragraph-row"]}>
                <p>
                  <strong>Nome:</strong> {patient.name || "N/A"}
                </p>
                <p>
                  <strong>Idade:</strong> {patient.age || "N/A"}
                </p>
              </div>

              <p>
                <strong>Status de Identificação:</strong>{" "}
                {patient.identificationStatus}
              </p>
            </section>
          </div>
        </div>
        <div className={styles["section-row"]}>
          <div className={styles["section-column"]}>
            <section className={styles["laudo-section"]}>
              <h3>Dados da Evidência</h3>

              <p>
                <strong>Título:</strong> {evidence.title}
              </p>
              <p>
                <strong>Categoria:</strong> {evidence.category}
              </p>
              <p>
                <strong>Condição:</strong> {evidence.condition}
              </p>

              <p>
                <strong>Latitude:</strong> {evidence.latitude || "N/A"}
              </p>
              <p>
                <strong>Longitude:</strong> {evidence.longitude || "N/A"}
              </p>

              <p>
                <strong>Observações:</strong> {evidence.obs}
              </p>
              <p>
                <strong>Coletor:</strong> {evidence.collector.name} (
                {evidence.collector.role})
              </p>
              <p>
                <strong>Depoimento de testemunha:</strong>{" "}
                {evidence.testimony || "N/A"}
              </p>
              <p>
                <strong>Descrição Técnica:</strong>{" "}
                {evidence.descriptionTechnical}
              </p>
              <div className={styles["laudo-foto"]}>
                <p>
                  <strong>Foto da evidência:</strong>
                </p>
                <img src={evidence.photo} alt="Foto da evidência" />
              </div>
            </section>
          </div>
        </div>

        <section className={styles["laudo-section"]}>
          <h3>Laudo Gerado</h3>
          <p>
            <strong>Conclusão do Laudo:</strong> {evidence.reportEvidence?.note}
          </p>
          <p>
            <strong>Análise Técnica:</strong>{" "}
            {evidence.reportEvidence?.descriptionTechnical}
          </p>
          <p>
            <strong>Concluído por:</strong>{" "}
            {evidence.reportEvidence?.responsible?.name} (
            {evidence.reportEvidence?.responsible?.role})
          </p>
          <p>
            <strong>Data do Laudo:</strong>{" "}
            {formatDate(evidence.reportEvidence?.createdAt)}
          </p>
        </section>

        <footer className={styles["laudo-footer"]}>
          <p>
            <strong>Assinatura:</strong>{" "}
            ____________________________________________
          </p>
          <p>
            <small>Emitido em: {formatDate(new Date())}</small>
          </p>
        </footer>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.buttonToBack} onClick={() => navigate(-1)}>
          Voltar
        </button>
        <button className={styles.buttonDownload} onClick={gerarPDF}>
          Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default LaudoEvidenciaPage;
