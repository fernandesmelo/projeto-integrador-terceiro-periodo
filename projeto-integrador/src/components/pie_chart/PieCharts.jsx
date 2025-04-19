import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Title } from 'chart.js';
import styles from './PieCharts.module.css';


ChartJS.register(ArcElement, Tooltip, Title);
const StatusPieChart = ({
  endpoint = 'https://sistema-odonto-legal.onrender.com/api/dash/cases/status',
}) => {
  const [statusData, setStatusData] = useState([]);
  const statuses = ['ABERTO', 'FINALIZADO', 'ARQUIVADO'];
  const colors = ['#36A2EB', '#4d965d', '#FFCE56'];

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch((err) => console.error('Erro ao buscar status:', err));
  }, [endpoint]);

  const counts = statuses.map((status) => {
    const found = statusData.find((item) => item.status === status);
    return found ? found.casos : 0;
  });

  const chartData = {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Distribuição de Casos por Status',
        font: { size: 16 },
      },
      legend: {
        display: false, // desativa legenda interna
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
        },
      },
    },
  };

  return (
    <div className={styles.chartWrapper}>
      
      <div className={styles.pieContainer}>
        <Pie data={chartData} options={options} />
      </div>
      <div className={styles.legendContainer}>
        {statuses.map((status, idx) => (
          <div key={status} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: colors[idx] }}
            />
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPieChart;