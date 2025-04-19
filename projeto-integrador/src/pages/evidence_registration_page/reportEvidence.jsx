import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/Header";
import Nav from "../../components/nav/Nav";
import styles from "./reportEvidence.module.css";
import Swal from "sweetalert2";
import axios from "axios";

const LaudoForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate(); // <--- Adicionado para redirecionar
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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

      // redirecionar após um pequeno delay
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

          <div className={styles.evidenceInfo}>
            {evidence?.photo && (
              <div className={styles.imageContainer}>
                <img
                  src={evidence.photo}
                  alt="Imagem da evidência"
                  className={styles.photo}
                />
              </div>
            )}
            <p>
              <strong>Título:</strong> {evidence?.title}
            </p>
            <p>
              <strong>Relatos testemunhais:</strong> {evidence?.testimony}
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
          </div>

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

            <button type="submit" className={styles.button}>
              Salvar Laudo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaudoForm;
