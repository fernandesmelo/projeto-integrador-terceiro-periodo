// src/components/RoscaChart.js

import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { filtrarPorData, contarOcorrencias } from "../utils/ChartUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

const gradiente = [
  "#003644", // Cor base
  "#1a4c58",
  "#33626c",
  "#4d7880",
  "#668e94",
  "#80a4a8",
  "#99babd",
];
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} casos` },
    },
  },
};

const variaveisDisponiveis = [
  { value: "tipo_do_caso", label: "Tipo do Caso" },
  { value: "localizacao", label: "Localização" },
  { value: "vitima.etnia", label: "Etnia da Vítima" },
];

const RoscaChart = ({ allData, dataInicio, dataFim }) => {
  const [variavel, setVariavel] = useState(variaveisDisponiveis[0].value);

  const chartData = useMemo(() => {
    const dadosFiltrados = filtrarPorData(allData, dataInicio, dataFim);
    const contagem = contarOcorrencias(dadosFiltrados, variavel);

    return {
      labels: Object.keys(contagem),
      datasets: [
        {
          data: Object.values(contagem),
          backgroundColor: gradiente,
          borderWidth: 0,
        },
      ],
    };
  }, [allData, dataInicio, dataFim, variavel]);

  return (
    // AQUI ESTÁ A CORREÇÃO:
    <divs>
      {/* O resto do seu componente continua igual */}
      <div className="rosca-controls">
        <label htmlFor="variavelRosca">Variável:</label>
        <select
          id="variavelRosca"
          value={variavel}
          onChange={(e) => setVariavel(e.target.value)}
        >
          {variaveisDisponiveis.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <Doughnut data={chartData} options={chartOptions} />
    </divs>
  );
};

export default RoscaChart;
