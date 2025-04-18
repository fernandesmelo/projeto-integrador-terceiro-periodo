/* src/components/CasesBarChart.jsx */
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './casesBarChart.module.css';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr',
  'Mai', 'Jun', 'Jul', 'Ago',
  'Set', 'Out', 'Nov', 'Dez'
];

const CasesBarChart = () => {
  const [data, setData] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://sistema-odonto-legal.onrender.com/api/dash/cases/date')
      .then(res => {
        if (!res.ok) throw new Error('Erro na rede ao buscar dados');
        return res.json();
      })
      .then(raw => {
        // preenche 12 meses
        const filled = monthNames.map((_, i) => {
          const found = raw.find(r => r.mes === i + 1);
          return found ? found.casos : 0;
        });
        setData(filled);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Quantidade de casos',
        data,
        backgroundColor: 'rgba(105,179,162,0.7)',
        borderColor: 'rgba(105,179,162,1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Casos por Mês',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.chartWrapper}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default CasesBarChart;