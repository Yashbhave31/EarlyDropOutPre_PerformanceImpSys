import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function TrendLineChart() {
  const data = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5 (Current)', 'Sem 6 (Proj)'],
    datasets: [
      {
        label: 'High-Risk Probability %',
        data: [12, 16, 24, 38, 46, 28],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#ef4444',
        pointRadius: 4
      },
      {
        label: 'Average Attendance %',
        data: [84, 80, 75, 71, 68, 76],
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        tension: 0.35,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4,
        borderDash: [4, 4]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true } },
      tooltip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8', font: { size: 10 } }, min: 0, max: 100 }
    }
  };

  return (
    <div className="w-full h-60">
      <Line data={data} options={options} />
    </div>
  );
}
