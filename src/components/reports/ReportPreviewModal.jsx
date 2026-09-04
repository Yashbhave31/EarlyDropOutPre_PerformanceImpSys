import React from 'react';
import Modal from '../common/Modal';
import { Printer, Download, GraduationCap } from 'lucide-react';
import { exportToCSV, triggerPrintWindow } from '../../utils/exportUtils';
import { formatDate } from '../../utils/formatters';

export default function ReportPreviewModal({ isOpen, onClose, reportType, title, data = [] }) {
  if (!isOpen) return null;

  // Extract table headers dynamically from data keys
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Institutional Report Preview - ${title || reportType}`} size="xl">
      <div className="space-y-5 text-xs">
        <div className="text-center pb-3 border-b-2 border-slate-700">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase">
              MET Institute of Engineering & Technology
            </h2>
          </div>
          <p className="text-slate-400">Institutional Directorate of Academic Standards & Early Dropout Prevention</p>
          <h3 className="text-xs font-bold text-indigo-400 mt-1.5">{title?.toUpperCase() || reportType?.toUpperCase()}</h3>
          <p className="text-[10px] text-slate-400">Official Document Generated: {formatDate(new Date())} • Academic Year 2025-2026</p>
        </div>

        {data.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            No matching records found for the selected department, semester, and risk criteria.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse border border-slate-800 text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 sticky top-0">
                  {headers.map((h) => (
                    <th key={h} className="p-2.5 font-semibold text-slate-300 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    {headers.map((h) => (
                      <td key={h} className="p-2.5 text-slate-300 whitespace-nowrap">
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-6 flex justify-between text-center text-slate-400 text-xs">
          <div>
            <div className="w-32 border-b border-slate-700 pb-6 mb-1" />
            <p>Class Coordinator</p>
          </div>
          <div>
            <div className="w-32 border-b border-slate-700 pb-6 mb-1" />
            <p>Head of Department</p>
          </div>
          <div>
            <div className="w-32 border-b border-slate-700 pb-6 mb-1" />
            <p>Principal / Dean</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => exportToCSV(`${(title || reportType || 'Report').replace(/\s+/g, '_')}.csv`, data)}
            disabled={data.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={triggerPrintWindow}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
