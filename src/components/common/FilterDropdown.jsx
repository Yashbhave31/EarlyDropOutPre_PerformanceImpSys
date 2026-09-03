import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ label, value, onChange, options }) {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
