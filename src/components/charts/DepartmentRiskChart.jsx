import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DepartmentRiskChart({ stats }) {
  const labels = stats?.map(s => s.department) || ['IT', 'CS', 'AI&DS', 'EXTC'];
  const lowData = stats?.map(s => s.lowRisk) || [95, 120, 88, 62];
  const mediumData = stats?.map(s => s.mediumRisk) || [30, 28, 22, 24];
  const highData = stats?.map(s => s.highRisk) || [15, 12, 10, 14];

  const data = {
    labels,
    datasets: [
      { label: 'Low Risk', data: lowData, backgroundColor: 'rgba(16, 185, 129, 0.8)', borderRadius: 4 },
      { label: 'Medium Risk', data: mediumData, backgroundColor: 'rgba(245, 158, 11, 0.8)', borderRadius: 4 },
      { label: 'High Risk', data: highData, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 4 }
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
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  };

  return (
    <div className="w-full h-60">
      <Bar data={data} options={options} />
    </div>
  );
}
