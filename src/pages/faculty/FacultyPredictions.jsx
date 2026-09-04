import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Play, Sparkles, RefreshCw, Eye, Sliders, HeartHandshake,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert,
  ArrowRight, Filter, Search, RotateCcw
} from 'lucide-react';
import RiskGauge from '../../components/prediction/RiskGauge';
import FactorBreakdown from '../../components/prediction/FactorBreakdown';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { calculateStudentRisk } from '../../utils/riskCalculator';

export default function FacultyPredictions() {
  const { user } = useAuth();
  const { students, runPrediction, logIntervention } = useStudentData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const myStudents = useMemo(() => {
    return students.filter(s =>
      s.mentorId === user?.id ||
      s.mentorName?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
      s.department === (user?.department || 'Information Technology')
    );
  }, [students, user]);

  const paramStudentId = searchParams.get('studentId');
  const [selectedStudentId, setSelectedStudentId] = useState(
    paramStudentId || myStudents[0]?.id || students[0]?.id
  );

  useEffect(() => {
    if (paramStudentId && paramStudentId !== selectedStudentId) {
      setSelectedStudentId(paramStudentId);
    }
  }, [paramStudentId]);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || myStudents[0] || students[0];

  const [studentSearch, setStudentSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [selectedProfileModal, setSelectedProfileModal] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);

  // What-If Simulation State
  const [simulatedAttendance, setSimulatedAttendance] = useState(selectedStudent?.attendance || 75);
  const [simulatedInternalMarks, setSimulatedInternalMarks] = useState(selectedStudent?.internalMarks || 65);
  const [simulatedBacklogs, setSimulatedBacklogs] = useState(selectedStudent?.backlogs || 0);

  // Reset simulation when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      setSimulatedAttendance(selectedStudent.attendance ?? 75);
      setSimulatedInternalMarks(selectedStudent.internalMarks ?? 65);
      setSimulatedBacklogs(selectedStudent.backlogs ?? 0);
    }
  }, [selectedStudentId]);

  // Compute what-if simulation
  const simulatedResult = useMemo(() => {
    if (!selectedStudent) return null;
    const hypotheticalStudent = {
      ...selectedStudent,
      attendance: Number(simulatedAttendance),
      internalMarks: Number(simulatedInternalMarks),
      unitTestMarks: Number(simulatedInternalMarks),
      backlogs: Number(simulatedBacklogs)
    };
    return calculateStudentRisk(hypotheticalStudent);
  }, [selectedStudent, simulatedAttendance, simulatedInternalMarks, simulatedBacklogs]);

  const baselineRisk = selectedStudent?.dropoutProbability || 0;
  const simulatedRisk = simulatedResult?.dropoutProbability || 0;
  const simDelta = simulatedRisk - baselineRisk;

  // Cohort Risk Metrics
  const lowCount = myStudents.filter(s => s.riskLevel === 'LOW').length;
  const modCount = myStudents.filter(s => s.riskLevel === 'MODERATE' || s.riskLevel === 'MEDIUM').length;
  const highCount = myStudents.filter(s => s.riskLevel === 'HIGH').length;
  const critCount = myStudents.filter(s => s.riskLevel === 'CRITICAL').length;
  const avgCohortRisk = myStudents.length
    ? Math.round(myStudents.reduce((acc, s) => acc + (s.dropoutProbability || 0), 0) / myStudents.length)
    : 0;

  const handleRunBatch = async () => {
    setIsRunningBatch(true);
    for (const st of myStudents) {
      await runPrediction(st.id);
    }
    setIsRunningBatch(false);
  };

  const filteredMentees = myStudents.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesRisk =
      riskFilter === 'ALL' ||
      s.riskLevel === riskFilter ||
      (riskFilter === 'HIGH_CRIT' && (s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL'));
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-indigo-400" />
              Explainable AI (SHAP) Mentee Risk Diagnostics
            </span>
            <span className="text-xs text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Risk Simulation / Demo Model
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Student Dropout Risk Predictions & What-If Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate cohort dropout vulnerability, inspect individual feature attribution drivers, and simulate hypothetical recovery scenarios.
          </p>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={isRunningBatch}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          {isRunningBatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunningBatch ? 'Evaluating Cohort...' : 'Batch Re-Score All Mentees'}</span>
        </button>
      </div>

      {/* Cohort Risk Distribution Bar & Summary KPIs */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Assigned Cohort Risk Distribution Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400">Mean Cohort Vulnerability: <strong className="text-white">{avgCohortRisk}%</strong></p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Low: {lowCount} ({myStudents.length ? Math.round((lowCount / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Moderate: {modCount} ({myStudents.length ? Math.round((modCount / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              High: {highCount} ({myStudents.length ? Math.round((highCount / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
              Critical: {critCount} ({myStudents.length ? Math.round((critCount / myStudents.length) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div style={{ width: `${myStudents.length ? (lowCount / myStudents.length) * 100 : 0}%` }} className="h-full bg-emerald-500" title="Low Risk" />
          <div style={{ width: `${myStudents.length ? (modCount / myStudents.length) * 100 : 0}%` }} className="h-full bg-blue-500" title="Moderate Risk" />
          <div style={{ width: `${myStudents.length ? (highCount / myStudents.length) * 100 : 0}%` }} className="h-full bg-amber-500" title="High Risk" />
          <div style={{ width: `${myStudents.length ? (critCount / myStudents.length) * 100 : 0}%` }} className="h-full bg-red-500" title="Critical Risk" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Selector List (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cohort Mentees</h3>
              <p className="text-[10px] text-slate-400">{filteredMentees.length} Students Shown</p>
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 p-1 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH_CRIT">High & Critical</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MODERATE">Moderate Only</option>
              <option value="LOW">Low Only</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search mentee name or ID..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredMentees.map((st) => (
              <div
                key={st.id}
                onClick={() => {
                  setSelectedStudentId(st.id);
                  setSearchParams({ studentId: st.id });
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStudent?.id === st.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={st.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{st.name}</p>
                    <p className="text-[10px] text-slate-400">{st.id} • Att: {st.attendance}%</p>
                  </div>
                </div>

                <div className="text-right">
                  <RiskBadge risk={st.riskLevel} size="sm" />
                  <p className="text-[10px] font-bold text-white mt-1">{st.dropoutProbability}% Risk</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Student Deep Explainability & What-If Simulator (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedStudent && (
            <>
              {/* Selected Mentee Dossier Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src={selectedStudent.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={selectedStudent.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-base font-bold text-white">{selectedStudent.name}</h2>
                        <RiskBadge risk={selectedStudent.riskLevel} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400">
                        {selectedStudent.id} • {selectedStudent.department} • Sem {selectedStudent.semester}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-xs pt-2 border-t border-slate-800/80">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Attendance</span>
                      <p className={`font-bold mt-0.5 ${selectedStudent.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedStudent.attendance}%
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Internal Marks</span>
                      <p className="font-bold text-white mt-0.5">{selectedStudent.internalMarks}/100</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Backlogs</span>
                      <p className={`font-bold mt-0.5 ${selectedStudent.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedStudent.backlogs} ATKT
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => runPrediction(selectedStudent.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-semibold transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-compute SHAP</span>
                    </button>
                    <button
                      onClick={() => navigate(`/faculty/data-collection?studentId=${selectedStudent.id}`)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Update Data</span>
                    </button>
                    <button
                      onClick={() => setInterventionStudent(selectedStudent)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Log Counseling</span>
                    </button>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center">
                  <RiskGauge
                    probability={selectedStudent.dropoutProbability}
                    riskLevel={selectedStudent.riskLevel}
                  />
                  <span className="text-[10px] text-slate-400 mt-1">Evaluated: {selectedStudent.predictionDate || 'Current Sem'}</span>
                </div>
              </div>

              {/* INTERACTIVE WHAT-IF SCENARIO SIMULATOR */}
              <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      <Sliders className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Interactive What-If Simulation Sandbox</h3>
                      <p className="text-xs text-indigo-200">
                        Test how hypothetical remedial actions impact {selectedStudent.name}'s risk score.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSimulatedAttendance(selectedStudent.attendance);
                      setSimulatedInternalMarks(selectedStudent.internalMarks);
                      setSimulatedBacklogs(selectedStudent.backlogs);
                    }}
                    className="flex items-center space-x-1 text-xs text-indigo-300 hover:text-white font-semibold transition-colors self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Baseline</span>
                  </button>
                </div>

                {/* Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Attendance Slider */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hypothetical Attendance:</span>
                      <span className={`font-bold ${simulatedAttendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {simulatedAttendance}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={simulatedAttendance}
                      onChange={(e) => setSimulatedAttendance(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Baseline: {selectedStudent.attendance}%</span>
                      <span>Target: 75%+</span>
                    </div>
                  </div>

                  {/* Internal Marks Slider */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Continuous Assessment:</span>
                      <span className="font-bold text-white">{simulatedInternalMarks}/100</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={simulatedInternalMarks}
                      onChange={(e) => setSimulatedInternalMarks(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Baseline: {selectedStudent.internalMarks}</span>
                      <span>Passing: 40</span>
                    </div>
                  </div>

                  {/* Backlogs Slider */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uncleared Backlogs:</span>
                      <span className={`font-bold ${simulatedBacklogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {simulatedBacklogs} ATKT
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      value={simulatedBacklogs}
                      onChange={(e) => setSimulatedBacklogs(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Baseline: {selectedStudent.backlogs}</span>
                      <span>Target: 0</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Outcome Banner */}
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="text-center sm:text-left">
                      <span className="text-slate-400 block text-[10px]">Simulated Risk Score</span>
                      <span className={`text-2xl font-bold ${
                        simulatedRisk >= 60 ? 'text-red-400' :
                        simulatedRisk >= 35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {simulatedRisk}%
                      </span>
                    </div>
                    <RiskBadge risk={simulatedResult?.riskLevel || 'LOW'} size="sm" />
                  </div>

                  <div className="flex items-center space-x-2">
                    {simDelta < 0 ? (
                      <div className="flex items-center space-x-1 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        <TrendingDown className="w-4 h-4" />
                        <span>{Math.abs(simDelta)}% Risk Reduction</span>
                      </div>
                    ) : simDelta > 0 ? (
                      <div className="flex items-center space-x-1 text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                        <TrendingUp className="w-4 h-4" />
                        <span>+{simDelta}% Elevated Risk</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Matches Baseline</span>
                    )}

                    <button
                      onClick={() => setInterventionStudent(selectedStudent)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                    >
                      Prescribe Target Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Contributing SHAP Factors Breakdown */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Explainable AI (SHAP) Attribution Drivers</h3>
                    <p className="text-xs text-slate-400">Additive feature weights pulling probability up (negative) or down (protective)</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    TreeSHAP Kernel
                  </span>
                </div>

                <FactorBreakdown factors={selectedStudent.contributingFactors} />
              </div>

              {/* Actionable Recovery Recommendations */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Recommended Recovery Roadmaps for {selectedStudent.name}</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {selectedStudent.recommendations && selectedStudent.recommendations.length > 0 ? (
                    selectedStudent.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{rec.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              {rec.priority || 'Urgent'}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-1">{rec.action}</p>
                          {rec.impact && <p className="text-emerald-400 text-[10px] mt-1">Impact: {rec.impact}</p>}
                        </div>

                        <button
                          onClick={() => setInterventionStudent(selectedStudent)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 transition-colors"
                        >
                          Adopt Plan
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Standard academic monitoring advised.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedProfileModal && (
        <StudentProfileModal
          isOpen={Boolean(selectedProfileModal)}
          onClose={() => setSelectedProfileModal(null)}
          student={selectedProfileModal}
          onLogIntervention={(st) => setInterventionStudent(st)}
        />
      )}

      {/* Intervention Modal */}
      {interventionStudent && (
        <InterventionModal
          isOpen={Boolean(interventionStudent)}
          onClose={() => setInterventionStudent(null)}
          student={interventionStudent}
          onSubmit={async (data) => {
            await logIntervention(data);
            setInterventionStudent(null);
          }}
        />
      )}
    </div>
  );
}
