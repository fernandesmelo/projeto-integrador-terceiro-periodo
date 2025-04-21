import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import Button from "../../components/button/Button";
import styles from "./reportEvidence.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import Nav2 from "../../components/nav2/Nav2";

const LaudoForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const evidence = state?.evidence;
  const protocol = state?.protocol;
  console.log("Evidência recebida:", evidence);

  const [conclusion, setConclusion] = useState("");
  const [technicalAnalysis, setTechnicalAnalysis] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirmar geração do laudo?",
      text: "Você não poderá editar ou remover o laudo depois de salvo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1E88E5",
      cancelButtonColor: "#EB5757",
      confirmButtonText: "Sim, gerar laudo!",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    const data = {
      descriptionTechnical: technicalAnalysis,
      note: conclusion,
    };

    try {
      await axios.post(
        "https://sistema-odonto-legal.onrender.com/api/report/evidence",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            evidence: evidence._id,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Laudo salvo com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate(`/casos/detalhes/${protocol}`);
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar o laudo",
        text: error.response?.data?.message || "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <Nav />
        <div className={styles.formContainer}>
          <h1>Gerar Laudo da Evidência</h1>
          <Nav2 onClick={() => navigate(-1)} content="voltar" />
          <fieldset className={styles.evidenceInfo}>
            <legend>Dados da Evidência</legend>
              {evidence?.photo && (
                <div className={styles.imageWrapper}>
                  <img
                    src={evidence.photo}
                    alt="Imagem da evidência"
                    className={styles.imagePreview}
                  />
                </div>
              )}
              <p>
                <strong>Título:</strong> {evidence?.title}
              </p>
              <p>
                <strong>Relatos Testemunhais:</strong> {evidence?.testimony}
              </p>
              <p>
                <strong>Descrição Técnica:</strong>{" "}
                {evidence?.descriptionTechnical}
              </p>
              <p>
                <strong>Condição:</strong> {evidence?.condition}
              </p>
              <p>
                <strong>Categoria:</strong> {evidence?.category}
              </p>
          </fieldset>
          <form onSubmit={handleSubmit}>
            <label>Análise Técnica:*</label>
            <textarea
              value={technicalAnalysis}
              onChange={(e) => setTechnicalAnalysis(e.target.value)}
              rows="4"
              required
            />
            <label>Conclusão do Laudo:*</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows="4"
              required
            />
            <Button type="submit" variant="generic-primary">
              Salvar laudo
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaudoForm;
