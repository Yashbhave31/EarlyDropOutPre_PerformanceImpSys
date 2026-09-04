import React, { useState, useMemo } from 'react';
import {
  Download, Printer, Users, CheckCircle2, AlertTriangle, Award,
  BookOpen, HeartHandshake, ShieldAlert, TrendingUp, Filter, FileText,
  Clock, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { exportToCSV, triggerPrintWindow } from '../../utils/exportUtils';
import ProgressBar from '../../components/common/ProgressBar';
import RiskBadge from '../../components/common/RiskBadge';

export default function CohortReports() {
  const { user } = useAuth();
  const { students, interventions } = useStudentData();
  const [activeReportTab, setActiveReportTab] = useState('summary'); // 'summary' | 'defaulters' | 'high_risk' | 'subjects'

  // Mentees assigned to faculty or department
  const myStudents = useMemo(() => {
    return students.filter(s =>
      s.mentorId === user?.id ||
      s.mentorName?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
      s.department === (user?.department || 'Information Technology')
    );
  }, [students, user]);

  // Risk Counts
  const lowRisk = myStudents.filter(s => s.riskLevel === 'LOW');
  const modRisk = myStudents.filter(s => s.riskLevel === 'MODERATE' || s.riskLevel === 'MEDIUM');
  const highRisk = myStudents.filter(s => s.riskLevel === 'HIGH');
  const critRisk = myStudents.filter(s => s.riskLevel === 'CRITICAL');
  const highCriticalStudents = myStudents.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL');

  // Attendance Defaulters (<75%)
  const defaulters = myStudents.filter(s => s.attendance < 75);

  // Backlogs
  const studentsWithBacklogs = myStudents.filter(s => s.backlogs > 0);
  const totalBacklogPapers = myStudents.reduce((acc, s) => acc + (s.backlogs || 0), 0);

  // Averages
  const avgAttendance = myStudents.length
    ? Math.round(myStudents.reduce((acc, s) => acc + (s.attendance || 0), 0) / myStudents.length)
    : 0;
  const avgCGPA = myStudents.length
    ? (myStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / myStudents.length).toFixed(2)
    : '0.00';
  const avgInternalMarks = myStudents.length
    ? Math.round(myStudents.reduce((acc, s) => acc + (s.internalMarks || 0), 0) / myStudents.length)
    : 0;

  // Interventions summary
  const cohortInterventions = interventions.filter(i => myStudents.some(s => s.id === i.studentId));
  const completedInterventions = cohortInterventions.filter(i => i.status === 'Completed');
  const pendingInterventions = cohortInterventions.filter(i => i.status === 'Scheduled' || i.status === 'In Progress');

  // Subject Performance Summary
  const subjects = [
    { code: 'IT501', title: 'Software Engineering', avgMarks: 72, passRate: 94, defaultersCount: 2 },
    { code: 'IT502', title: 'Database Systems & SQL', avgMarks: 64, passRate: 82, defaultersCount: 4 },
    { code: 'IT503', title: 'Computer Networks & Sec', avgMarks: 68, passRate: 88, defaultersCount: 3 },
    { code: 'IT504', title: 'Machine Learning & AI', avgMarks: 76, passRate: 92, defaultersCount: 1 },
    { code: 'IT505', title: 'Web App Engineering Lab', avgMarks: 81, passRate: 98, defaultersCount: 1 }
  ];

  // Export handlers
  const exportFullReport = () => {
    const data = myStudents.map(s => ({
      StudentID: s.id,
      Name: s.name,
      Department: s.department,
      Semester: s.semester,
      Attendance: `${s.attendance}%`,
      InternalMarks: s.internalMarks,
      UnitTestMarks: s.unitTestMarks || '',
      Backlogs: s.backlogs,
      CGPA: s.cgpa,
      RiskLevel: s.riskLevel,
      DropoutProbability: `${s.dropoutProbability}%`,
      FeePending: s.feePending ? 'YES' : 'NO'
    }));
    exportToCSV(`Cohort_Full_Report_${user?.name?.replace(/\s+/g, '_') || 'Mentorship'}.csv`, data);
  };

  const exportDefaultersReport = () => {
    const data = defaulters.map(s => ({
      StudentID: s.id,
      Name: s.name,
      Department: s.department,
      Attendance: `${s.attendance}%`,
      DeficitToCutoff: `${75 - s.attendance}%`,
      RiskLevel: s.riskLevel,
      ContactEmail: s.email,
      Phone: s.phone
    }));
    exportToCSV(`Attendance_Defaulters_Below75_${user?.name?.replace(/\s+/g, '_') || 'Faculty'}.csv`, data);
  };

  const exportHighRiskReport = () => {
    const data = highCriticalStudents.map(s => ({
      StudentID: s.id,
      Name: s.name,
      Department: s.department,
      DropoutProbability: `${s.dropoutProbability}%`,
      RiskLevel: s.riskLevel,
      Attendance: `${s.attendance}%`,
      InternalMarks: s.internalMarks,
      Backlogs: s.backlogs,
      PrimaryRiskFactor: s.contributingFactors?.[0]?.factor || 'Academic Deficit'
    }));
    exportToCSV(`High_Critical_Risk_Roster_${user?.name?.replace(/\s+/g, '_') || 'Faculty'}.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Department of {user?.department || 'Information Technology'}
            </span>
            <span className="text-xs text-slate-400">Semester 5 Audit Dossier</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Mentorship Cohort & Class Health Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive diagnostic summary of attendance compliance, risk classifications, and remedial counseling outcomes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={triggerPrintWindow}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={exportDefaultersReport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
            title="Export students below 75% attendance"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Defaulters CSV</span>
          </button>

          <button
            onClick={exportHighRiskReport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors"
            title="Export High and Critical risk mentees"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>High Risk CSV</span>
          </button>

          <button
            onClick={exportFullReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Full Class CSV</span>
          </button>
        </div>
      </div>

      {/* Cohort Key Health Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Total Cohort Mentees</span>
          <p className="text-2xl font-bold text-white mt-1">{myStudents.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Assigned under Dr. Sharma</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Average Class Attendance</span>
          <p className={`text-2xl font-bold mt-1 ${avgAttendance < 75 ? 'text-red-400' : 'text-blue-400'}`}>
            {avgAttendance}%
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {defaulters.length} students &lt; 75% cutoff
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Average Internal Marks</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{avgInternalMarks} / 100</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Mean CGPA: {avgCGPA}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Active ATKT Backlogs</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{studentsWithBacklogs.length} Students</p>
          <span className="text-[10px] text-slate-500 mt-1 block">{totalBacklogPapers} total uncleared papers</span>
        </div>
      </div>

      {/* Risk Distribution Breakdown & Interventions Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Risk Distribution Card */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>Cohort Risk Classification Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400">Proportion of assigned mentees across risk bands</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold block">Low Risk (&lt;35%)</span>
              <span className="text-xl font-bold text-white mt-1 block">{lowRisk.length}</span>
              <span className="text-[10px] text-slate-400">
                {myStudents.length ? Math.round((lowRisk.length / myStudents.length) * 100) : 0}% of cohort
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-blue-400 font-bold block">Moderate (35-59%)</span>
              <span className="text-xl font-bold text-white mt-1 block">{modRisk.length}</span>
              <span className="text-[10px] text-slate-400">
                {myStudents.length ? Math.round((modRisk.length / myStudents.length) * 100) : 0}% of cohort
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 font-bold block">High (60-74%)</span>
              <span className="text-xl font-bold text-white mt-1 block">{highRisk.length}</span>
              <span className="text-[10px] text-slate-400">
                {myStudents.length ? Math.round((highRisk.length / myStudents.length) * 100) : 0}% of cohort
              </span>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <span className="text-red-400 font-bold block">Critical (≥75%)</span>
              <span className="text-xl font-bold text-white mt-1 block">{critRisk.length}</span>
              <span className="text-[10px] text-slate-400">
                {myStudents.length ? Math.round((critRisk.length / myStudents.length) * 100) : 0}% of cohort
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div style={{ width: `${myStudents.length ? (lowRisk.length / myStudents.length) * 100 : 0}%` }} className="h-full bg-emerald-500" />
            <div style={{ width: `${myStudents.length ? (modRisk.length / myStudents.length) * 100 : 0}%` }} className="h-full bg-blue-500" />
            <div style={{ width: `${myStudents.length ? (highRisk.length / myStudents.length) * 100 : 0}%` }} className="h-full bg-amber-500" />
            <div style={{ width: `${myStudents.length ? (critRisk.length / myStudents.length) * 100 : 0}%` }} className="h-full bg-red-500" />
          </div>
        </div>

        {/* Right 1 Col: Remedial Intervention Summary */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Interventions Audit</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {cohortInterventions.length} Total
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Completed Sessions:</span>
                <span className="font-bold text-emerald-400">{completedInterventions.length}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Active / In-Progress:</span>
                <span className="font-bold text-amber-400">{pendingInterventions.length}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Resolution Rate:</span>
                <span className="font-bold text-white">
                  {cohortInterventions.length ? Math.round((completedInterventions.length / cohortInterventions.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            Mandatory follow-up milestone reviews scheduled within 14 calendar days of each intervention.
          </p>
        </div>
      </div>

      {/* Tabs: Full Mentee Audit / Attendance Defaulters / High Risk / Subject Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'summary', label: `Complete Mentee Audit (${myStudents.length})` },
            { id: 'defaulters', label: `Attendance Defaulters <75% (${defaulters.length})` },
            { id: 'high_risk', label: `High & Critical Risk (${highCriticalStudents.length})` },
            { id: 'subjects', label: `Subject Performance Matrix` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeReportTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Complete Mentee Audit Grid */}
        {activeReportTab === 'summary' && (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Internal Marks</th>
                    <th className="py-3 px-4">Unit Test</th>
                    <th className="py-3 px-4">Backlogs</th>
                    <th className="py-3 px-4">Fee Dues</th>
                    <th className="py-3 px-4">Dropout Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {myStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={st.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-semibold text-white">{st.name}</p>
                            <p className="text-[10px] text-slate-400">{st.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${st.attendance < 75 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                          {st.attendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{st.internalMarks} / 100</td>
                      <td className="py-3 px-4 text-slate-300">{st.unitTestMarks || 60} / 100</td>
                      <td className="py-3 px-4">
                        <span className={st.backlogs > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                          {st.backlogs} {st.backlogs === 1 ? 'Paper' : 'Papers'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          st.feePending ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {st.feePending ? 'Dues Pending' : 'Cleared'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <RiskBadge risk={st.riskLevel} size="sm" />
                          <span className={`font-bold ${
                            st.dropoutProbability >= 60 ? 'text-red-400' :
                            st.dropoutProbability >= 35 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {st.dropoutProbability}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Attendance Defaulters List */}
        {activeReportTab === 'defaulters' && (
          <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Attendance Defaulter Roster (Below Institutional 75% Cutoff)</span>
                </h3>
                <p className="text-xs text-slate-400">These students risk debarment from university end-semester examinations.</p>
              </div>
              <button
                onClick={exportDefaultersReport}
                className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Defaulters CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Student & ID</th>
                    <th className="py-3 px-4">Current Attendance</th>
                    <th className="py-3 px-4">Deficit to 75% Cutoff</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Contact Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {defaulters.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{st.name}</p>
                        <p className="text-[10px] text-slate-400">{st.id}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-red-400">
                        {st.attendance}%
                      </td>
                      <td className="py-3 px-4 text-amber-300 font-semibold">
                        -{75 - st.attendance}% deficit
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge risk={st.riskLevel} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        <p>{st.email}</p>
                        <p className="text-[10px]">{st.phone}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: High Risk Students */}
        {activeReportTab === 'high_risk' && (
          <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>High & Critical Risk Priority Intervention Roster</span>
                </h3>
                <p className="text-xs text-slate-400">Identified by ML ensemble classifier as vulnerable to dropout or semester failure.</p>
              </div>
              <button
                onClick={exportHighRiskReport}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export High Risk CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Dropout Probability</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Backlogs</th>
                    <th className="py-3 px-4">Primary Attribution Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {highCriticalStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{st.name}</p>
                        <p className="text-[10px] text-slate-400">{st.id}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-red-400">
                        {st.dropoutProbability}%
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge risk={st.riskLevel} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span className={st.attendance < 75 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {st.attendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-400">
                        {st.backlogs} Papers
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {st.contributingFactors?.[0]?.factor || 'Low Continuous Assessment'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Subject Performance Matrix */}
        {activeReportTab === 'subjects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <div key={sub.code} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-indigo-400 font-bold">{sub.code}</span>
                    <h4 className="font-bold text-white text-sm">{sub.title}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {sub.passRate}% Pass Rate
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Internal Marks:</span>
                    <span className="font-bold text-white">{sub.avgMarks}/100</span>
                  </div>
                  <ProgressBar value={sub.avgMarks} max={100} showPercentage={false} color="blue" />

                  <div className="flex justify-between pt-1 text-[11px]">
                    <span className="text-slate-400">Flagged Defaulters:</span>
                    <span className="text-amber-400 font-bold">{sub.defaultersCount} Students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
