import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModeloChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarCoeficientes() {
      try {
        const res = await fetch(
          "https://back-trab-dados.onrender.com/api/modelo/coeficientes"
        );
        if (!res.ok) throw new Error(`Erro na API: ${res.statusText}`);

        const data = await res.json();

        // 1. Processa os dados
        const processedData = Object.entries(data)
          .map(([key, value]) => ({ key, value: Number(value) }))
          .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Ordena pela importância (valor absoluto)

        // 2. LIMITA OS DADOS: Pega apenas os 15 fatores mais importantes para evitar o gráfico gigante
        const top15Data = processedData.slice(0, 15);

        setChartData({
          labels: top15Data.map((item) => item.key),
          datasets: [
            {
              label: "Importância",
              data: top15Data.map((item) => item.value),
              backgroundColor: "#003644",
            },
          ],
        });
      } catch (err) {
        console.error("Erro ao carregar coeficientes:", err);
        setError("Não foi possível carregar os dados do modelo.");
      }
    }

    carregarCoeficientes();
    // 3. ARRAY DE DEPENDÊNCIAS VAZIO: Garante que a busca de dados ocorra apenas uma vez.
  }, []);

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false, // Essencial para o gráfico se adaptar ao container
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: "Valor do Coeficiente" } },
    },
  };

  // Mensagens de estado para o usuário
  if (error)
    return (
      <div id="containerGraficoModelo" className="status-message">
        {error}
      </div>
    );
  if (!chartData)
    return (
      <div id="containerGraficoModelo" className="status-message">
        Carregando dados do modelo...
      </div>
    );

  return (
    // O `div` container com o ID correto é crucial
    <div id="containerGraficoModelo">
      <h3>Fatores Determinantes (Top 15)</h3>
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ModeloChart;
