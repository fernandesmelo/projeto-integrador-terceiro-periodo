// src/components/DistribuicaoChart.js

import React, { useMemo } from "react";
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
import { filtrarPorData } from "../utils/ChartUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DistribuicaoChart = ({ allData, dataInicio, dataFim }) => {
  const chartData = useMemo(() => {
    const dadosFiltrados = filtrarPorData(allData, dataInicio, dataFim);
    const idades = dadosFiltrados
      .map((c) => c.vitima?.idade)
      .filter((i) => typeof i === "number" && !isNaN(i) && i > 0);

    const labels = [];
    const binsData = [];
    const max = idades.length > 0 ? Math.max(...idades, 100) : 100;

    for (let i = 1; i <= max; i += 10) {
      labels.push(`${i}-${i + 9}`);
      binsData.push(0);
    }

    idades.forEach((idade) => {
      const index = Math.floor((idade - 1) / 10);
      if (index >= 0 && index < binsData.length) binsData[index]++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Número de Vítimas",
          data: binsData,
          backgroundColor: "#EDBF5E",
        },
      ],
    };
  }, [allData, dataInicio, dataFim]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: "Faixa Etária" } },
      y: { title: { display: true, text: "Quantidade de Vítimas" } },
    },
  };

  return (
    <div className="grafico-box">
      <h2>Distribuição de Idade das Vítimas</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DistribuicaoChart;
