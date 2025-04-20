// src/components/VictimsStatusDoughnut.jsx

// src/components/VictimsStatusDoughnut.jsx
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./VictimsStatusDoughnut.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mapeamento de cores (use uppercase e sem espaços extras)
const colorMap = {
  "NÃO IDENTIFICADO": "#FF6384",
  IDENTIFICADO: "#36A2EB",
  "PARCIALMENTE IDENTIFICADO": "#FFCE56",
};

export default function VictimsStatusDoughnut({
  endpoint = "https://sistema-odonto-legal.onrender.com/api/dash/victims/status",
}) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Extrai labels e valores
        const labels = data.map((d) => d.status.trim());
        const values = data.map((d) => d.vitimas);

        // Garante que o status bate com a chave do colorMap
        const bgColors = labels.map((label) => {
          const key = label.toUpperCase();
          return colorMap[key] || "#CCCCCC";
        });

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: bgColors,
              borderColor: "#fff",
              borderWidth: 2,
              cutout: "60%",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Erro ao carregar vítimas:", err);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.raw;
            return `${ctx.label}: ${v} vítima${v !== 1 ? "s" : ""}`;
          },
        },
      },
    },
  };

  if (loading) return <p>Carregando…</p>;
  if (!chartData) return <p>Sem dados para mostrar.</p>;

  return (
    <div className={styles.container}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
