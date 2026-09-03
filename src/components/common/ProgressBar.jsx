import React from 'react';

export default function ProgressBar({ value, max = 100, target = 75, label, showPercentage = true, color = "blue" }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorVariants = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gradient: percent >= 75 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : percent >= 60 ? "bg-gradient-to-r from-amber-500 to-orange-400" : "bg-gradient-to-r from-red-600 to-rose-500"
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percent}%</span>}
        </div>
      )}
      <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorVariants[color] || colorVariants.blue}`}
          style={{ width: `${percent}%` }}
        />
        {target && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
            style={{ left: `${target}%` }}
            title={`Target: ${target}%`}
          />
        )}
      </div>
    </div>
  );
}
