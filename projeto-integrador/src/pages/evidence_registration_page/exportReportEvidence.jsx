import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./exportReportEvidence.module.css"; // Importando o CSS modular

const LaudoEvidenciaPage = () => {
  const { evidenceId } = useParams();
  console.log("ID da evidência recebido:", evidenceId);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (evidenceId) {
      const token = localStorage.getItem("token");
      axios
        .get(`https://sistema-odonto-legal.onrender.com/api/evidence/search`, {
          headers: {
            Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
          },
          params: {
            evidenceId,
          },
        })
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    }
  }, [evidenceId]);

  const formatDate = (iso) => new Date(iso).toLocaleString("pt-BR");

  const gerarPDF = () => {
    const input = document.getElementById("laudo-pdf");
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Ajuste da imagem dentro do tamanho da página
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`laudo-${evidenceId}.pdf`);
    });
  };

  if (!data) return <p>Carregando laudo...</p>;

  return (
    <div>
      <div className={styles["laudo-container"]} id="laudo-pdf">
        <header className={styles["laudo-header"]}>
          <img src={logo} alt="Logo" className={styles["laudo-logo"]} />
          <h1>Dentalysis Odonto Legal</h1>
          <h2>Laudo Técnico Nº {data.id.slice().toUpperCase()}</h2>
        </header>

        <section className={styles["laudo-section"]}>
          <h3>Dados da Evidência</h3>
          <p>
            <strong>Título:</strong> {data.title}
          </p>
          <p>
            <strong>Categoria:</strong> {data.category}
          </p>
          <p>
            <strong>Condição:</strong> {data.condition}
          </p>
          <p>
            <strong>Latitude:</strong> {data.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {data.longitude}
          </p>
          <p>
            <strong>Observações:</strong> {data.obs}
          </p>
          <p>
            <strong>Coletor:</strong> {data.collector.name} (
            {data.collector.role})
          </p>
          <p>
            <strong>Depoimento:</strong> {data.testimony}
          </p>
          <p>
            <strong>Descrição Técnica:</strong> {data.descriptionTechnical}
          </p>
          <div className={styles["laudo-foto"]}>
            <p>
              <strong>Foto da evidência:</strong>
            </p>
            <img src={data.photo} alt="Foto da evidência" />
          </div>
        </section>

        <section className={styles["laudo-section"]}>
          <h3>Laudo Gerado</h3>
          <p>
            <strong>Conclusão do Laudo:</strong> {data.reportEvidence.note}
          </p>
          <p>
            <strong>Análise Técnica:</strong>{" "}
            {data.reportEvidence.descriptionTechnical}
          </p>
          <p>
            <strong>Concluído por:</strong>{" "}
            {data.reportEvidence.responsible.name} (
            {data.reportEvidence.responsible.role})
          </p>
          <p>
            <strong>Data do Laudo:</strong>{" "}
            {formatDate(data.reportEvidence.createdAt)}
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
        <button className={styles.buttonToBack} onClick={() => window.history.back()}>
          Voltar
        </button>
        <button className={styles.buttonDownload} onClick={gerarPDF}>Baixar PDF</button>
      </div>
    </div>
  );
};

export default LaudoEvidenciaPage;
