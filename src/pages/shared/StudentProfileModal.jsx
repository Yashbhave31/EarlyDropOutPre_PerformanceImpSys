import React from 'react';
import Modal from '../../components/common/Modal';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import { formatCurrency } from '../../utils/formatters';
import { BookOpen, DollarSign, MapPin, Briefcase, Phone, Mail } from 'lucide-react';

export default function StudentProfileModal({ isOpen, onClose, student, onRunPrediction, onLogIntervention }) {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Student Master Profile - ${student.name}`} subtitle={`Student ID: ${student.id}`} size="xl">
      <div className="space-y-5 text-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <img
            src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"}
            alt={student.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-base font-bold text-white">{student.name}</h3>
              <RiskBadge risk={student.riskLevel} />
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {student.dropoutProbability}% Dropout Risk
              </span>
            </div>
            <p className="text-slate-400">{student.department} • Sem {student.semester} • {student.academicYear}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {student.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {student.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {student.distanceKm} km ({student.transportMode})</span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2">
            {onRunPrediction && (
              <button
                onClick={() => { onClose(); onRunPrediction(student); }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
              >
                Run AI Prediction
              </button>
            )}
            {onLogIntervention && (
              <button
                onClick={() => { onClose(); onLogIntervention(student); }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors"
              >
                Log Intervention
              </button>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
          <h4 className="font-bold text-white mb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Academic Performance Indicators</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Class Attendance</span>
              <p className="text-base font-bold text-white mt-0.5">{student.attendance}%</p>
              <ProgressBar value={student.attendance} max={100} target={75} showPercentage={false} color="gradient" />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Internal Marks</span>
              <p className="text-base font-bold text-white mt-0.5">{student.internalMarks}/100</p>
              <ProgressBar value={student.internalMarks} max={100} showPercentage={false} color="blue" />
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Active Backlogs</span>
              <p className={`text-base font-bold mt-0.5 ${student.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {student.backlogs} Papers
              </p>
              <span className="text-[10px] text-slate-400">{student.backlogs === 0 ? 'Zero ATKTs' : 'Needs Recovery'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Cumulative CGPA</span>
              <p className="text-base font-bold text-white mt-0.5">{student.cgpa} / 10</p>
              <span className="text-[10px] text-slate-400">10th: {student.tenthPercent}% | 12th: {student.twelfthPercent}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Socioeconomic Status</span>
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Annual Family Income:</span>
              <span className="font-semibold text-white">{formatCurrency(student.familyIncome)} ({student.familyIncomeBracket})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Fee Payment Status:</span>
              <span className={`font-semibold ${student.feePending ? 'text-red-400' : 'text-emerald-400'}`}>
                {student.feePending ? `Dues (${formatCurrency(student.feeDueAmount)})` : 'Paid'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Parents Education:</span>
              <span className="font-semibold text-white">{student.parentsEducation}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Responsibilities & Commute</span>
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Commute Distance:</span>
              <span className="font-semibold text-white">{student.distanceKm} km ({student.transportMode})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Family Responsibilities:</span>
              <span className="font-semibold text-white">{student.familyResponsibilities}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Extracurricular Level:</span>
              <span className="font-semibold text-white">{student.extracurricular}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
