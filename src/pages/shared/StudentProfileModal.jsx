import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import { formatCurrency } from '../../utils/formatters';
import { useStudentData } from '../../context/StudentDataContext';
import {
  BookOpen, DollarSign, MapPin, Briefcase, Phone, Mail,
  CheckCircle2, HeartHandshake, BrainCircuit, Sliders,
  ShieldAlert, Clock
} from 'lucide-react';

export default function StudentProfileModal({
  isOpen,
  onClose,
  student,
  onLogIntervention
}) {
  const navigate = useNavigate();
  const { interventions } = useStudentData();
  const [activeTab, setActiveTab] = useState('overview');

  if (!student) return null;

  // Student specific interventions
  const studentInterventions = interventions.filter(i => i.studentId === student.id);

  // Subject breakdown (standard semester 5 curriculum)
  const subjectGrades = [
    { code: 'IT501', name: 'Software Engineering', attendance: Math.min(100, student.attendance + 4), marks: Math.min(100, student.internalMarks + 2), status: student.internalMarks >= 40 ? 'Pass' : 'At Risk' },
    { code: 'IT502', name: 'Database Systems', attendance: Math.max(0, student.attendance - 6), marks: Math.max(0, student.internalMarks - 5), status: (student.internalMarks - 5) >= 40 ? 'Pass' : 'Backlog Warning' },
    { code: 'IT503', name: 'Computer Networks', attendance: student.attendance, marks: student.unitTestMarks || 58, status: (student.unitTestMarks || 58) >= 40 ? 'Pass' : 'At Risk' },
    { code: 'IT504', name: 'Machine Learning', attendance: Math.min(100, student.attendance + 2), marks: student.assignmentScore || 65, status: 'Pass' },
    { code: 'IT505', name: 'Full-Stack Web Lab', attendance: Math.min(100, student.attendance + 8), marks: student.practicalScore || 74, status: 'Pass' }
  ];

  const handleNavigateToDataEntry = () => {
    onClose();
    navigate(`/faculty/data-collection?studentId=${student.id}`);
  };

  const handleNavigateToPredictions = () => {
    onClose();
    navigate(`/faculty/predictions?studentId=${student.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Student Master Profile & Risk Dossier - ${student.name}`}
      subtitle={`Student ID: ${student.id} • ${student.department || 'Information Technology'}`}
      size="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <img
            src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-base font-bold text-white">{student.name}</h3>
              <RiskBadge risk={student.riskLevel} />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                student.dropoutProbability >= 60 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                student.dropoutProbability >= 35 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {student.dropoutProbability}% Dropout Risk
              </span>
            </div>
            <p className="text-slate-400">
              {student.department} • Semester {student.semester} • Academic Year {student.academicYear || '2025-2026'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {student.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {student.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {student.distanceKm} km ({student.transportMode})</span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleNavigateToDataEntry}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Update Data</span>
            </button>
            <button
              onClick={() => {
                onClose();
                if (onLogIntervention) onLogIntervention(student);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Intervene</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          {[
            { id: 'overview', label: 'Academic & Attendance', icon: BookOpen },
            { id: 'risk', label: 'Risk & SHAP Explainability', icon: BrainCircuit },
            { id: 'interventions', label: `Interventions History (${studentInterventions.length})`, icon: HeartHandshake },
            { id: 'socio', label: 'Socioeconomic & Demographics', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACADEMIC & ATTENDANCE */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Class Attendance</span>
                <p className={`text-base font-bold mt-0.5 ${student.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {student.attendance}%
                </p>
                <ProgressBar value={student.attendance} max={100} target={75} showPercentage={false} color="gradient" />
                <span className="text-[10px] text-slate-500 mt-1 block">Cutoff: 75% minimum</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Internal Marks</span>
                <p className="text-base font-bold text-white mt-0.5">{student.internalMarks} / 100</p>
                <ProgressBar value={student.internalMarks} max={100} showPercentage={false} color="blue" />
                <span className="text-[10px] text-slate-500 mt-1 block">Pass mark: 40/100</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Active Backlogs</span>
                <p className={`text-base font-bold mt-0.5 ${student.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {student.backlogs} {student.backlogs === 1 ? 'Paper' : 'Papers'}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {student.backlogs === 0 ? 'Clear all past papers' : 'ATKT pending exam'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Cumulative CGPA</span>
                <p className="text-base font-bold text-white mt-0.5">{student.cgpa} / 10</p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  10th: {student.tenthPercent}% • 12th: {student.twelfthPercent}%
                </span>
              </div>
            </div>

            {/* Subject Performance Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Semester 5 Course Performance Breakdown</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2">Course Code & Title</th>
                      <th className="pb-2">Attendance</th>
                      <th className="pb-2">Internal Score</th>
                      <th className="pb-2">Academic Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {subjectGrades.map(sub => (
                      <tr key={sub.code}>
                        <td className="py-2">
                          <span className="font-mono text-indigo-300 mr-2">{sub.code}</span>
                          <span className="text-white font-medium">{sub.name}</span>
                        </td>
                        <td className="py-2">
                          <span className={sub.attendance < 75 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                            {sub.attendance}%
                          </span>
                        </td>
                        <td className="py-2 text-white font-semibold">{sub.marks}/100</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RISK & SHAP EXPLAINABILITY */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-400">Dropout Probability:</span>
                  <span className="text-xl font-bold text-red-400">{student.dropoutProbability}%</span>
                  <RiskBadge risk={student.riskLevel} size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Engine: Ensemble Classifier (Attendance, continuous internal assessment, backlogs, socioeconomic telemetry)
                </p>
              </div>

              <button
                onClick={handleNavigateToPredictions}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all flex items-center space-x-1.5"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Open SHAP Diagnostic Engine</span>
              </button>
            </div>

            {/* Contributing SHAP Factors */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Risk Factors & Explanatory Attribution</span>
              </h4>
              <div className="space-y-2">
                {student.contributingFactors && student.contributingFactors.length > 0 ? (
                  student.contributingFactors.map((f, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${f.type === 'negative' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                          <span className="font-bold text-white text-xs">{f.factor}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            f.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {f.impact} IMPACT
                          </span>
                        </div>
                        {f.description && <p className="text-slate-400 text-[11px] mt-0.5">{f.description}</p>}
                      </div>
                      <span className={`font-mono text-xs font-bold ${f.weight > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {f.weight > 0 ? `+${f.weight}` : f.weight}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No elevated risk factors detected for this student.</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Recommended Recovery Roadmaps</span>
              </h4>
              <div className="space-y-2">
                {student.recommendations && student.recommendations.length > 0 ? (
                  student.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{rec.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {rec.priority || 'Urgent'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{rec.action}</p>
                      {rec.impact && <p className="text-emerald-400 text-[10px] mt-1">Impact: {rec.impact}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">Standard academic monitoring advised.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERVENTIONS HISTORY */}
        {activeTab === 'interventions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white">Documented Counseling & Mentorship Interventions</h4>
              <button
                onClick={() => {
                  onClose();
                  if (onLogIntervention) onLogIntervention(student);
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center space-x-1"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Log New Session</span>
              </button>
            </div>

            {studentInterventions.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="font-semibold text-white">No Interventions Recorded Yet</p>
                <p className="text-slate-400">Click "Log New Session" to document academic counseling or remedial roadmaps.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentInterventions.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-xs mr-2">{item.type}</span>
                        <span className="text-[10px] text-slate-400">• By {item.facultyName || 'Mentor'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    {item.reason && <p className="text-indigo-300 text-[11px]">Trigger: {item.reason}</p>}
                    {item.description && <p className="text-slate-300 text-[11px]">{item.description}</p>}
                    {item.actionPlan && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        <strong className="text-slate-400 block mb-0.5">Prescribed Action Plan:</strong>
                        <p className="whitespace-pre-line">{item.actionPlan}</p>
                      </div>
                    )}
                    {item.followUpDate && (
                      <span className="text-[10px] text-slate-500 block">Follow-up Milestone: {item.followUpDate}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SOCIOECONOMIC & DEMOGRAPHICS */}
        {activeTab === 'socio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Socioeconomic Status & Tuition Fees</span>
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Annual Family Income:</span>
                <span className="font-semibold text-white">{formatCurrency(student.familyIncome)} ({student.familyIncomeBracket})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Tuition Fee Payment:</span>
                <span className={`font-semibold ${student.feePending ? 'text-red-400' : 'text-emerald-400'}`}>
                  {student.feePending ? `Outstanding Dues (${formatCurrency(student.feeDueAmount || 45000)})` : 'Paid in Full'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Parents Education:</span>
                <span className="font-semibold text-white">{student.parentsEducation || 'Graduate'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Commute & Non-Academic Commitments</span>
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Commute Distance:</span>
                <span className="font-semibold text-white">{student.distanceKm} km ({student.transportMode})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Family Responsibilities:</span>
                <span className="font-semibold text-white">{student.familyResponsibilities || 'Moderate'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Extracurricular Engagement:</span>
                <span className="font-semibold text-white">{student.extracurricular || 'Medium'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
