import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Save, BrainCircuit, CheckCircle2, Sliders, RefreshCw, UserCheck,
  AlertTriangle, ArrowRight, TrendingDown, TrendingUp, HeartHandshake,
  Eye, BookOpen, Calendar, ShieldAlert, Award, FileText, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import { calculateStudentRisk } from '../../utils/riskCalculator';

export default function StudentDataCollection() {
  const { user } = useAuth();
  const { students, updateStudent, logIntervention } = useStudentData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mentees assigned to faculty or department
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
  const [studentSearch, setStudentSearch] = useState('');

  const currentStudent = students.find(s => s.id === selectedStudentId) || myStudents[0] || students[0];

  const [formData, setFormData] = useState({
    attendance: 75,
    internalMarks: 65,
    unitTestMarks: 60,
    assignmentScore: 70,
    practicalScore: 75,
    backlogs: 0,
    feePending: false,
    remarks: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [recalculatedResult, setRecalculatedResult] = useState(null);
  const [selectedProfileModal, setSelectedProfileModal] = useState(null);
  const [interventionModalStudent, setInterventionModalStudent] = useState(null);

  // Sync form when selected student changes
  useEffect(() => {
    if (currentStudent) {
      setFormData({
        attendance: currentStudent.attendance ?? 75,
        internalMarks: currentStudent.internalMarks ?? 65,
        unitTestMarks: currentStudent.unitTestMarks ?? 60,
        assignmentScore: currentStudent.assignmentScore ?? 70,
        practicalScore: currentStudent.practicalScore ?? 75,
        backlogs: currentStudent.backlogs ?? 0,
        feePending: Boolean(currentStudent.feePending),
        remarks: currentStudent.remarks || ''
      });
      setRecalculatedResult(null);
      setValidationErrors({});
    }
  }, [selectedStudentId, currentStudent]);

  // Sync with URL query param if present
  useEffect(() => {
    if (paramStudentId && paramStudentId !== selectedStudentId) {
      setSelectedStudentId(paramStudentId);
    }
  }, [paramStudentId]);

  const handleStudentSelect = (id) => {
    setSelectedStudentId(id);
    setSearchParams({ studentId: id });
  };

  const validateForm = () => {
    const errors = {};
    if (formData.attendance < 0 || formData.attendance > 100 || isNaN(formData.attendance)) {
      errors.attendance = 'Attendance must be between 0% and 100%';
    }
    if (formData.internalMarks < 0 || formData.internalMarks > 100 || isNaN(formData.internalMarks)) {
      errors.internalMarks = 'Internal marks must be between 0 and 100';
    }
    if (formData.unitTestMarks < 0 || formData.unitTestMarks > 100 || isNaN(formData.unitTestMarks)) {
      errors.unitTestMarks = 'Unit test marks must be between 0 and 100';
    }
    if (formData.assignmentScore < 0 || formData.assignmentScore > 100 || isNaN(formData.assignmentScore)) {
      errors.assignmentScore = 'Assignment score must be between 0 and 100';
    }
    if (formData.practicalScore < 0 || formData.practicalScore > 100 || isNaN(formData.practicalScore)) {
      errors.practicalScore = 'Practical score must be between 0 and 100';
    }
    if (formData.backlogs < 0 || formData.backlogs > 10 || isNaN(formData.backlogs)) {
      errors.backlogs = 'Backlogs must be between 0 and 10';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAndScore = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    const previousRisk = currentStudent.dropoutProbability;
    const previousLevel = currentStudent.riskLevel;

    const updatedStudentData = {
      ...currentStudent,
      attendance: Number(formData.attendance),
      internalMarks: Number(formData.internalMarks),
      unitTestMarks: Number(formData.unitTestMarks),
      assignmentScore: Number(formData.assignmentScore),
      practicalScore: Number(formData.practicalScore),
      backlogs: Number(formData.backlogs),
      feePending: Boolean(formData.feePending),
      remarks: formData.remarks,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Recalculate using deterministic ML engine simulator
    const mlResult = calculateStudentRisk(updatedStudentData);

    const finalStudent = {
      ...updatedStudentData,
      dropoutProbability: mlResult.dropoutProbability,
      riskLevel: mlResult.riskLevel,
      contributingFactors: mlResult.contributingFactors,
      recommendations: mlResult.recommendations,
      predictionDate: mlResult.predictionDate
    };

    await updateStudent(finalStudent);

    const delta = mlResult.dropoutProbability - previousRisk;

    setRecalculatedResult({
      studentName: finalStudent.name,
      studentId: finalStudent.id,
      previousRisk,
      previousLevel,
      newRisk: mlResult.dropoutProbability,
      newLevel: mlResult.riskLevel,
      delta,
      contributingFactors: mlResult.contributingFactors,
      recommendations: mlResult.recommendations,
      finalStudent
    });

    setIsSaving(false);
  };

  // Filter student list for selector
  const selectorStudents = myStudents.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-indigo-400" />
              Automated Risk Recalculation Engine
            </span>
            <span className="text-xs text-slate-400">Risk Simulation / Demo Model</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Student Academic Data Intake & Risk Recalculation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update attendance records, internal continuous assessments, and backlog status to re-evaluate early dropout probability.
          </p>
        </div>

        <button
          onClick={() => navigate('/faculty/students')}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          View Mentee Directory
        </button>
      </div>

      {/* BEFORE / AFTER RISK RECALCULATION IMPACT BANNER */}
      {recalculatedResult && (
        <div className="glass-card p-6 rounded-2xl border-2 border-indigo-500/40 bg-indigo-950/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Academic Record Saved & Risk Recalculated!
                </h3>
                <p className="text-xs text-indigo-200">
                  Updated profile for <strong>{recalculatedResult.studentName} ({recalculatedResult.studentId})</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedProfileModal(recalculatedResult.finalStudent)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Profile</span>
              </button>
              <button
                onClick={() => setInterventionModalStudent(recalculatedResult.finalStudent)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-1"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Log Counseling</span>
              </button>
            </div>
          </div>

          {/* Comparative Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Previous Score */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400">Previous Risk Level</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white">{recalculatedResult.previousRisk}%</span>
                <RiskBadge risk={recalculatedResult.previousLevel} size="sm" />
              </div>
              <p className="text-[10px] text-slate-500">Prior to latest faculty assessment</p>
            </div>

            {/* Recalculated Score */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400">New Calculated Risk</span>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${
                  recalculatedResult.newRisk >= 60 ? 'text-red-400' :
                  recalculatedResult.newRisk >= 35 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {recalculatedResult.newRisk}%
                </span>
                <RiskBadge risk={recalculatedResult.newLevel} size="sm" />
              </div>
              <p className="text-[10px] text-slate-500">Recalculated with updated marks</p>
            </div>

            {/* Net Delta Impact */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400">Net Risk Trajectory</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                {recalculatedResult.delta < 0 ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                    <span className="text-lg font-bold text-emerald-400">
                      {Math.abs(recalculatedResult.delta)}% Reduction
                    </span>
                  </>
                ) : recalculatedResult.delta > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-lg font-bold text-red-400">
                      +{recalculatedResult.delta}% Increase
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-slate-300">No Change (0%)</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                {recalculatedResult.delta <= 0 ? 'Risk mitigated by improved performance' : 'Elevated risk detected; intervention advised'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Selector (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Mentee</h3>
              <p className="text-[10px] text-slate-400">{myStudents.length} Students in Cohort</p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search name or ID..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {selectorStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => handleStudentSelect(st.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStudentId === st.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
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
                  <span className="text-[10px] text-slate-400 block mt-0.5">{st.dropoutProbability}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Academic Intake Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Student Active Card */}
          {currentStudent && (
            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={currentStudent.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={currentStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">{currentStudent.name}</h2>
                    <RiskBadge risk={currentStudent.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentStudent.id} • {currentStudent.department} • Semester {currentStudent.semester}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                    <span>CGPA: <strong className="text-white">{currentStudent.cgpa}</strong></span>
                    <span>•</span>
                    <span>10th: <strong className="text-white">{currentStudent.tenthPercent}%</strong></span>
                    <span>•</span>
                    <span>12th: <strong className="text-white">{currentStudent.twelfthPercent}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Baseline Risk Score</span>
                <span className="text-2xl font-bold text-red-400">{currentStudent.dropoutProbability}%</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSaveAndScore} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Continuous Evaluation & Biometric Attendance</h3>
              </div>
              <span className="text-[11px] text-slate-400">Current Semester 5</span>
            </div>

            {/* Attendance & Backlogs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Classroom Attendance (%) *
                  </label>
                  <span className={`font-bold ${formData.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formData.attendance}% {formData.attendance < 75 ? '(Below 75% Cutoff)' : '(Compliant)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  className="w-full accent-indigo-600 mb-1"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
                {validationErrors.attendance && (
                  <p className="text-red-400 text-[10px] mt-1">{validationErrors.attendance}</p>
                )}
                <span className="text-[10px] text-slate-500 mt-1 block">Institutional minimum attendance requirement is 75%.</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Active Academic Backlogs (ATKT Count) *
                  </label>
                  <span className={`font-bold ${formData.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formData.backlogs} {formData.backlogs === 1 ? 'Paper' : 'Papers'}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
                {validationErrors.backlogs && (
                  <p className="text-red-400 text-[10px] mt-1">{validationErrors.backlogs}</p>
                )}
                <span className="text-[10px] text-slate-500 mt-1 block">Number of uncleared subjects from prior terms.</span>
              </div>
            </div>

            {/* Assessment Scores Grid */}
            <div className="pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 mb-3">Internal Continuous Assessment Marks (Scale 0 - 100)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Internal Theory Exam (/100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.internalMarks}
                    onChange={(e) => setFormData({ ...formData, internalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  {validationErrors.internalMarks && (
                    <p className="text-red-400 text-[10px] mt-1">{validationErrors.internalMarks}</p>
                  )}
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Pass threshold: 40</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Unit Test 1 & 2 (/100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.unitTestMarks}
                    onChange={(e) => setFormData({ ...formData, unitTestMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  {validationErrors.unitTestMarks && (
                    <p className="text-red-400 text-[10px] mt-1">{validationErrors.unitTestMarks}</p>
                  )}
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Continuous test avg</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Practical Lab & Viva (/100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.practicalScore}
                    onChange={(e) => setFormData({ ...formData, practicalScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  {validationErrors.practicalScore && (
                    <p className="text-red-400 text-[10px] mt-1">{validationErrors.practicalScore}</p>
                  )}
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Lab assignment viva</span>
                </div>
              </div>
            </div>

            {/* Assignment Score & Fee Dues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Assignment Completion Rate (/100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assignmentScore}
                  onChange={(e) => setFormData({ ...formData, assignmentScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
                {validationErrors.assignmentScore && (
                  <p className="text-red-400 text-[10px] mt-1">{validationErrors.assignmentScore}</p>
                )}
                <span className="text-[10px] text-slate-500 mt-0.5 block">Tutorial submissions</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.feePending}
                    onChange={(e) => setFormData({ ...formData, feePending: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Tuition Fee Payment Pending</span>
                    <span className="text-[10px] text-slate-400 block">Flagged by university accounts office</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Counselor Observations & Remarks */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Faculty Academic Notes & Behavioral Observations
              </label>
              <textarea
                rows="2"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Document any medical reasons for absences, class participation notes, or remedial support agreements..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Saving will instantly trigger the <strong>Risk Simulation / Demo Model</strong> to re-evaluate dropout probability.
              </span>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recalculating Risk...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Save & Recalculate Risk</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedProfileModal && (
        <StudentProfileModal
          isOpen={Boolean(selectedProfileModal)}
          onClose={() => setSelectedProfileModal(null)}
          student={selectedProfileModal}
          onLogIntervention={(st) => setInterventionModalStudent(st)}
        />
      )}

      {/* Intervention Modal */}
      {interventionModalStudent && (
        <InterventionModal
          isOpen={Boolean(interventionModalStudent)}
          onClose={() => setInterventionModalStudent(null)}
          student={interventionModalStudent}
          onSubmit={async (data) => {
            await logIntervention(data);
            setInterventionModalStudent(null);
          }}
        />
      )}
    </div>
  );
}
