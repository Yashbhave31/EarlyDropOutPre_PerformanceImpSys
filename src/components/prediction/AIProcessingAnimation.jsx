import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Database, CheckCircle2 } from 'lucide-react';

export default function AIProcessingAnimation({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Normalizing Features & Academic Vectorization", detail: "Encoding attendance, internal marks, practicals, backlogs...", icon: Database },
    { title: "Invoking Scikit-Learn Ensemble Classifier", detail: "Evaluating Random Forest & Gradient Boosted trees...", icon: Cpu },
    { title: "Computing SHAP Factor Importance Matrix", detail: "Decomposing feature weights and marginal contributions...", icon: Brain },
    { title: "Synthesizing Preventive Recommendations", detail: "Generating targeted recovery strategy and mentor plan...", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1800);
    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="w-14 h-14 rounded-full bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-base font-bold text-white mb-1">Running Machine Learning Model</h3>
      <p className="text-xs text-slate-400 mb-5">Performing inference across academic and socioeconomic indicators.</p>

      <div className="w-full space-y-2.5 text-left">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < step;
          const isCurrent = idx === step;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-slate-900/60 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/20 border-slate-800/40 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isCurrent ? 'animate-bounce text-indigo-400' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{s.title}</p>
                  <p className="text-[10px] text-slate-400">{s.detail}</p>
                </div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
