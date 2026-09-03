import React from 'react';
import { Calendar, UserCheck, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function InterventionTimeline({ interventions }) {
  if (!interventions || !interventions.length) {
    return (
      <div className="text-center p-6 border border-dashed border-slate-800 rounded-2xl">
        <p className="text-xs text-slate-400">No interventions logged yet for this student.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'In Progress': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Follow-up Required': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
      {interventions.map((item, idx) => (
        <div key={item.id || idx} className="relative group">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{item.type}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.date)}</span>
              </div>
            </div>

            <p className="text-slate-300 mb-2 leading-relaxed">{item.description}</p>

            {item.actionPlan && (
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-2">
                <span className="font-semibold text-indigo-300 block mb-0.5">Action Plan:</span>
                <p className="text-slate-300 whitespace-pre-line">{item.actionPlan}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <UserCheck className="w-3 h-3 text-slate-400" />
                <span>Mentor: {item.facultyName}</span>
              </div>
              {item.followUpDate && (
                <div className="flex items-center space-x-1 text-amber-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Follow-up: {formatDate(item.followUpDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
