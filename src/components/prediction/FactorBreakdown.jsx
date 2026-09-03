import React from 'react';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export default function FactorBreakdown({ factors }) {
  return (
    <div className="space-y-2.5">
      {factors?.map((f, idx) => {
        const isNegative = f.type === 'negative';
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
              isNegative
                ? 'bg-red-500/5 border-red-500/20 text-red-200'
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className={`p-1.5 rounded-lg mt-0.5 ${isNegative ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isNegative ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{f.factor}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    f.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : f.impact === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {f.impact} IMPACT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{f.description}</p>
              </div>
            </div>

            <div className="text-right whitespace-nowrap">
              <span className={`text-xs font-bold ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                {isNegative ? `+${Math.round(Math.abs(f.weight * 100))}%` : `-${Math.round(Math.abs(f.weight * 100))}%`}
              </span>
              <p className="text-[9px] text-slate-400">Risk Weight</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
