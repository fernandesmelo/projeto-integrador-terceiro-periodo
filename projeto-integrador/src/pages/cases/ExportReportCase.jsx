import React from "react";
import logo from "../../assets/logo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "./ExportReportCase.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Nav2 from "../../components/nav2/Nav2";

const RelatorioPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const caseData = location.state || {};

  // Utilitários
  const formatDate = (iso) => new Date(iso).toLocaleString("pt-BR");
  const renderIfExists = (data, renderFn) => data && renderFn();

  if (!caseData) {
    return <p>Dados insuficientes para gerar o relatório.</p>;
  }

  // Componentes Modulares
  const Header = () => (
    <header className={styles["laudo-header"]}>
      <img src={logo} alt="Logo" className={styles["laudo-logo"]} />
      <h1>Dentalysis Odonto Legal</h1>
      <h2>Relatório do Caso - Protocolo Nº {caseData.caseDetails.protocol}</h2>
    </header>
  );

  const CaseInfo = () => (
    <section className={styles["laudo-section"]}>
      <h3>Informações do Caso</h3>
      <InfoItem label="Tipo do Caso" value={caseData.caseDetails.caseType} />
      <InfoItem
        label="Data de Abertura"
        value={formatDate(caseData.caseDetails.openedAt)}
      />
      <InfoItem
        label="Responsável pela Abertura"
        value={`${caseData.caseDetails.openedBy?.name} (${caseData.caseDetails.openedBy?.role})`}
      />
    </section>
  );

  const PatientInfo = () => (
    <section className={styles["laudo-section"]}>
      <h3>Informações da Vítima</h3>
      <InfoItem
        label="Nome"
        value={caseData.caseDetails.patient?.name || "N/A"}
      />
      <InfoItem
        label="Idade"
        value={caseData.caseDetails.patient?.age || "N/A"}
      />
      <InfoItem
        label="Genero"
        value={caseData.caseDetails.patient?.gender || "N/A"}
      />
      <InfoItem
        label="Status de Identificação"
        value={caseData.caseDetails.patient?.identificationStatus}
      />
    </section>
  );

  const EvidenceSection = () => (
    <section className={styles["laudo-section"]}>
      <h3>Evidências Vinculadas</h3>
      <Nav2 onClick={() => navigate(-1)} content='voltar'/>
      {caseData.caseDetails.evidence?.map((item, index) => (
        <EvidenceItem key={index} data={item} index={index} />
      ))}
    </section>
  );

  const EvidenceItem = ({ data }) => (
    <div className={styles["evidence-item"]}>
      <div className={styles["evidence-info"]}>
        <h4>Evidência {data.title}</h4>

        <InfoItem label="Categoria" value={data.category} />
        <InfoItem label="Condição" value={data.condition} />
        <InfoItem
          label="Coletor"
          value={`${data.collector.name} (${data.collector.role})`}
        />
        <InfoItem label="Descrição Técnica" value={data.descriptionTechnical} />
        <InfoItem label="Data de coleta" value={formatDate(data.createdAt)} />
        <InfoItem
          label="Relatos Testemunhais"
          value={data.testimony || "N/A"}
        />
      </div>

      <div className={styles["evidence-report"]}>
        <h4>Laudo da Evidência</h4>
        <InfoItem
          label="Descrição Técnica do Laudo"
          value={data.reportEvidence.descriptionTechnical}
        />
        <InfoItem label="Conclusão do Laudo" value={data.reportEvidence.note} />
        <InfoItem
          label="Responsável pelo Laudo"
          value={`${data.reportEvidence.responsible.name} (${data.reportEvidence.responsible.role})`}
        />
        <InfoItem
          label="Data do Laudo"
          value={formatDate(data.reportEvidence.createdAt)}
        />
      </div>
    </div>
  );

  const CaseDetails = () => (
    <section className={styles["laudo-section"]}>
      <h3>Detalhamento do caso</h3>
      <InfoItem label="Título" value={caseData.caseDetails.title} />
      <InfoItem label="Status" value={caseData.caseDetails.state} />
      <InfoItem
        label="Número de Inquérito"
        value={caseData.caseDetails.inquiryNumber}
      />
      <InfoItem
        label="Instituição Requisitante"
        value={caseData.caseDetails.requestingInstitution}
      />
      <InfoItem
        label="Autoridade Requisitante"
        value={caseData.caseDetails.requestingAuthority}
      />
    </section>
  );

  const Questionnaire = () =>
    renderIfExists(caseData.caseDetails.caseReport.answers, () => (
      <section className={styles["laudo-section"]}>
        <h3>Respostas do Questionário</h3>
        {caseData.caseDetails.caseReport.answers.map((item, index) => (
          <div key={index}>
            <InfoItem
              label={`Pergunta ${index + 1}`}
              value={caseData.caseDetails.questions[index]?.question}
            />
            <InfoItem label="Resposta" value={item.answer} />
          </div>
        ))}
      </section>
    ));

  const ReportFooter = () => (
    <div id="responsavel-relatorio">
      <section className={styles["laudo-section"]}>
        <h3>Responsável pelo Relatório</h3>
        <InfoItem
          label="Nome"
          value={caseData.caseDetails.caseReport.responsible.name}
        />
        <InfoItem
          label="Cargo"
          value={caseData.caseDetails.caseReport.responsible.role}
        />
        <InfoItem
          label="Data do Relatório"
          value={formatDate(caseData.caseDetails.caseReport.createdAt)}
        />
        <footer className={styles["laudo-footer"]}>
          <p>
            <strong>Assinatura:</strong>{" "}
            ____________________________________________
          </p>
          <p>
            <small>Emitido em: {formatDate(new Date())}</small>
          </p>
        </footer>
      </section>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );

  // Gerador de PDF otimizado
  const gerarPDF = () => {
    const input = document.getElementById("relatorio-pdf");
    const options = {
      scale: 2,
      useCORS: true,
      logging: true,
      scrollY: 0,
      windowWidth: 1200,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`relatorio-${caseData.caseDetails.protocol || "caso"}.pdf`);
    });
  };

  return (
    <div>
      <div className={styles["laudo-container"]} id="relatorio-pdf">
        <Header />
        <CaseInfo />
        <PatientInfo />
        <EvidenceSection />
        <CaseDetails />
        <Questionnaire />
        <ReportFooter />
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

export default RelatorioPage;
