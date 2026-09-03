import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "blue", onClick }) {
  const colorStyles = {
    blue: "from-blue-600/20 to-indigo-600/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40",
    emerald: "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40",
    amber: "from-amber-600/20 to-orange-600/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40",
    red: "from-red-600/20 to-rose-600/10 text-red-400 border-red-500/20 group-hover:border-red-500/40",
    purple: "from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40",
    cyan: "from-cyan-600/20 to-blue-600/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40"
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${colorStyles[color] || colorStyles.blue}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 group-hover:scale-110 transition-transform shadow-inner">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center text-xs">
          <span className={`font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400 ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
