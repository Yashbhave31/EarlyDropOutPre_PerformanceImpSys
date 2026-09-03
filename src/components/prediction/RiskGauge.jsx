import React from 'react';
import { getRiskColorClass } from '../../utils/formatters';

export default function RiskGauge({ probability = 46, riskLevel = "MEDIUM" }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;
  const riskClass = getRiskColorClass(riskLevel);

  return (
    <div className="flex flex-col items-center justify-center relative p-2">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} className="stroke-slate-800" strokeWidth="12" fill="transparent" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={riskClass.accent}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">{probability}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Dropout Probability
          </span>
        </div>
      </div>

      <div className={`mt-2 px-3.5 py-1 rounded-full text-xs font-bold border ${riskClass.badge}`}>
        {riskLevel} RISK CLASSIFICATION
      </div>
    </div>
  );
}
