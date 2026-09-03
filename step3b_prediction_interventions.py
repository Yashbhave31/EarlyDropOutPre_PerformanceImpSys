# -*- coding: utf-8 -*-
import os

def write_file(rel_path, content):
    full = os.path.join(os.getcwd(), rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created " + rel_path)

# 1. RiskGauge.jsx
write_file("src/components/prediction/RiskGauge.jsx", """
import React from 'react';
import { getRiskColorClass } from '../../utils/formatters';

export default function RiskGauge({ probability = 46, riskLevel = "MEDIUM" }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;
  const riskClass = getRiskColorClass(riskLevel);

  return (
    <div className="flex flex-col items-center justify-center relative p-2">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} className="stroke-slate-800" strokeWidth="12" fill="transparent" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={riskClass.accent}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">{probability}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Dropout Probability
          </span>
        </div>
      </div>

      <div className={`mt-2 px-3.5 py-1 rounded-full text-xs font-bold border ${riskClass.badge}`}>
        {riskLevel} RISK CLASSIFICATION
      </div>
    </div>
  );
}
""")

# 2. AIProcessingAnimation.jsx
write_file("src/components/prediction/AIProcessingAnimation.jsx", """
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
""")

# 3. FactorBreakdown.jsx
write_file("src/components/prediction/FactorBreakdown.jsx", """
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
""")

# 4. InterventionModal.jsx
write_file("src/components/interventions/InterventionModal.jsx", """
import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function InterventionModal({ isOpen, onClose, student, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "Counseling Session",
    description: "",
    actionPlan: "",
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    remarks: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      studentId: student?.id,
      studentName: student?.name,
      studentDepartment: student?.department,
      studentRisk: student?.riskLevel,
      facultyId: user?.facultyId || "FAC001",
      facultyName: user?.name || "Dr. Anjali Deshmukh",
      ...formData,
      status: "In Progress",
      improvementStatus: "Plan initiated"
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Preventive Intervention - ${student?.name || ''}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Intervention Category</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Counseling Session">Counseling Session (One-on-One)</option>
              <option value="Academic Mentoring">Academic Mentoring & Remedial Tutoring</option>
              <option value="Attendance Improvement Plan">Attendance Improvement Contract</option>
              <option value="Parent/Guardian Meeting">Parent / Guardian Conference</option>
              <option value="Financial Assistance Guidance">Financial Assistance & Scholarship Desk</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Follow-up Milestone Date</label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Diagnostic Observations & Key Triggers</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Document student's primary academic/personal bottlenecks..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Actionable Recovery Steps (Prescribed Plan)</label>
          <textarea
            rows="3"
            value={formData.actionPlan}
            onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
            placeholder="1. Attend 2 hrs remedial lab every Tuesday\n2. Submit Unit Test 1 revision assignments\n3. Maintain 75% weekly attendance"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Faculty / Counselor Remarks</label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="e.g., Student acknowledged concern and agreed to weekly checkpoint"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30">
            Save Intervention Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
""")

# 5. InterventionTimeline.jsx
write_file("src/components/interventions/InterventionTimeline.jsx", """
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
""")

# 6. StudentProfileModal.jsx
write_file("src/pages/shared/StudentProfileModal.jsx", """
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
""")

# 7. ReportPreviewModal.jsx
write_file("src/components/reports/ReportPreviewModal.jsx", """
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
            onClick={() => exportToCSV(`${reportType.replace(/\\s+/g, '_')}.csv`, students)}
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
""")
