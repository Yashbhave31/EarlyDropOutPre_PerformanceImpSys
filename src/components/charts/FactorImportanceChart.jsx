import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FactorImportanceChart({ factors }) {
  const factorLabels = factors?.map(f => f.factor) || [
    'Attendance Deficit', 'Active Backlogs', 'Low Internal Marks', 'Tuition Fee Dues', 'Commute Distance'
  ];

  const factorWeights = factors?.map(f => Math.abs(f.weight * 100)) || [32, 28, 18, 16, 11];
  const barColors = factors?.map(f => f.type === 'negative' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)') || [
    'rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)'
  ];

  const data = {
    labels: factorLabels,
    datasets: [{ label: 'SHAP Feature Weight (%)', data: factorWeights, backgroundColor: barColors, borderRadius: 4 }]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8', font: { size: 9 } } },
      y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { size: 10 } } }
    }
  };

  return (
    <div className="w-full h-52">
      <Bar data={data} options={options} />
    </div>
  );
}
