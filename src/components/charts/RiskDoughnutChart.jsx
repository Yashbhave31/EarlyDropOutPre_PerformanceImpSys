import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskDoughnutChart({ low, medium, moderate, high, critical, stats }) {
  const lowVal = stats?.lowRisk ?? low ?? 8;
  const modVal = stats?.moderateRisk ?? stats?.mediumRisk ?? moderate ?? medium ?? 4;
  const highVal = stats?.highRisk ?? high ?? 3;
  const critVal = stats?.criticalRisk ?? critical ?? 1;

  const labels = ['Low Risk (<35%)', 'Moderate Risk (35-65%)', 'High Risk (65-80%)', 'Critical Risk (>80%)'];
  const dataValues = [lowVal, modVal, highVal, critVal];
  const bgColors = [
    'rgba(16, 185, 129, 0.85)',
    'rgba(245, 158, 11, 0.85)',
    'rgba(249, 115, 22, 0.85)',
    'rgba(239, 68, 68, 0.95)'
  ];
  const borderColors = [
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(239, 68, 68, 1)'
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 10 }, padding: 8, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    cutout: '70%'
  };

  const total = lowVal + modVal + highVal + critVal;

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
        <span className="text-2xl font-bold text-white tracking-tight">{total}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total Students</span>
      </div>
    </div>
  );
}
