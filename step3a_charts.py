import os

def write_file(rel_path, content):
    full = os.path.join(os.getcwd(), rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created " + rel_path)

# 1. RiskDoughnutChart.jsx
write_file("src/components/charts/RiskDoughnutChart.jsx", """
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskDoughnutChart({ low = 8, medium = 3, high = 2 }) {
  const data = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [low, medium, high],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(239, 68, 68, 0.85)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
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
        labels: { color: '#94a3b8', font: { size: 11 }, padding: 12, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    cutout: '72%'
  };

  const total = low + medium + high;

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
""")

# 2. DepartmentRiskChart.jsx
write_file("src/components/charts/DepartmentRiskChart.jsx", """
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
""")

# 3. TrendLineChart.jsx
write_file("src/components/charts/TrendLineChart.jsx", """
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
""")

# 4. FactorImportanceChart.jsx
write_file("src/components/charts/FactorImportanceChart.jsx", """
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
""")
