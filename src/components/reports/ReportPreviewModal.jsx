import React from 'react';
import Modal from '../common/Modal';
import { Printer, Download, GraduationCap } from 'lucide-react';
import { exportToCSV, triggerPrintWindow } from '../../utils/exportUtils';
import { formatDate } from '../../utils/formatters';

export default function ReportPreviewModal({ isOpen, onClose, reportType, students }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Institutional Report Preview - ${reportType}`} size="xl">
      <div className="space-y-5 text-xs">
        <div className="text-center pb-3 border-b-2 border-slate-700">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-extrabold text-white tracking-wider uppercase">
              MET Institute of Engineering & Technology
            </h2>
          </div>
          <p className="text-slate-400">Department of Information Technology & AI Analytics Cell</p>
          <h3 className="text-xs font-bold text-indigo-400 mt-1.5">{reportType?.toUpperCase()}</h3>
          <p className="text-[10px] text-slate-400">Generated on: {formatDate(new Date())} • Academic Year 2025-2026</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <th className="p-2">Student ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Department</th>
                <th className="p-2">Attendance</th>
                <th className="p-2">Backlogs</th>
                <th className="p-2">Probability</th>
                <th className="p-2">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {students?.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="p-2 font-mono font-bold text-slate-300">{s.id}</td>
                  <td className="p-2 font-semibold text-white">{s.name}</td>
                  <td className="p-2 text-slate-300">{s.department}</td>
                  <td className="p-2 text-slate-300">{s.attendance}%</td>
                  <td className="p-2 text-slate-300">{s.backlogs}</td>
                  <td className="p-2 font-bold text-white">{s.dropoutProbability}%</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' : s.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {s.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
            onClick={() => exportToCSV(`${reportType.replace(/\s+/g, '_')}.csv`, students)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
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
