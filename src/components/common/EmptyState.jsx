import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';

export default function EmptyState({ title = "No records found", description = "Try adjusting your search criteria or add a new record.", onAction, actionLabel = "Add Record" }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 mb-4">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
