import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Calendar, BookOpen, AlertTriangle, CheckCircle2,
  ArrowRight, BrainCircuit, HeartHandshake, Phone, Mail, Sparkles,
  TrendingUp, TrendingDown, Clock, Bell, Compass, Target, Award,
  HelpCircle, ChevronRight, ShieldAlert, Check
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import RiskGauge from '../../components/prediction/RiskGauge';
import ProgressBar from '../../components/common/ProgressBar';
import RiskBadge from '../../components/common/RiskBadge';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { useNotifications } from '../../context/NotificationContext';
import { getRiskColorClass, formatCurrency } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function StudentDashboard() {
  const { user } = useAuth();
  const { students, interventions } = useStudentData();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  // Active student resolution
  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];
  const studentInterventions = (interventions || []).filter(i => i.studentId === student?.id);

  // Normalize risk classification to Low / Moderate / High / Critical
  const normalizedRisk = student.riskLevel === 'MEDIUM' ? 'MODERATE' : student.riskLevel;
  const riskClass = getRiskColorClass(normalizedRisk);

  // Attendance recovery math
  const totalClassesSoFar = 85;
  const attendedClasses = Math.round((student.attendance / 100) * totalClassesSoFar);
  const classesNeededFor75 = Math.max(0, Math.ceil((0.75 * totalClassesSoFar - attendedClasses) / 0.25));

  // Quick Action Milestone checklist with local state
  const [completedActions, setCompletedActions] = useState(() => {
    try {
      const saved = localStorage.getItem(`student_quick_actions_${student.id}`);
      return saved ? JSON.parse(saved) : [0];
    } catch {
      return [0];
    }
  });

  const toggleAction = (idx) => {
    const updated = completedActions.includes(idx)
      ? completedActions.filter(i => i !== idx)
      : [...completedActions, idx];
    setCompletedActions(updated);
    localStorage.setItem(`student_quick_actions_${student.id}`, JSON.stringify(updated));
  };

  const quickActions = [
    {
      title: "Attend upcoming 6 lectures of Database Systems & Software Engineering",
      reason: "Brings attendance closer to 75% exam eligibility mark",
      category: "Attendance",
      priority: "High"
    },
    {
      title: "Attend weekly 1-on-1 Peer Tutoring with Sneha Kulkarni",
      reason: "Remedial preparation for Semester 5 ATKT Backlog paper",
      category: "Backlog Recovery",
      priority: "Critical"
    },
    {
      title: "Submit pending Lab Journal for Advanced Java Programming",
      reason: "Secures internal viva marks (due by September 8th)",
      category: "Coursework",
      priority: "Recommended"
    }
  ];

  // Upcoming academic schedule
  const upcomingActivities = [
    {
      date: "Sep 08, 2026",
      title: "Experiment 3 & 4 Lab Journal Freeze",
      course: "IT502 - Advanced Java",
      type: "Submission",
      tag: "Urgent"
    },
    {
      date: "Sep 12, 2026",
      title: "Unit Test 2 Assessment Phase",
      course: "All Semester 5 Subjects",
      type: "Examination",
      tag: "Academic"
    },
    {
      date: "Sep 18, 2026",
      title: "Mid-Term Counseling Review Session",
      course: "Dr. Anjali Deshmukh (Room 402)",
      type: "Mentorship",
      tag: "1-on-1"
    }
  ];

  // Performance Trend Chart Data
  const trendData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5 (Current)', 'Sem 6 (Target)'],
    datasets: [
      {
        label: 'SGPA / CGPA',
        data: [7.2, 6.9, 6.6, 6.2, student.cgpa || 6.4, 7.0],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        yAxisID: 'yCgpa',
        tension: 0.3,
        pointBackgroundColor: '#38bdf8',
        pointRadius: 4,
        fill: true
      },
      {
        label: 'Attendance %',
        data: [86, 82, 74, 70, student.attendance || 68, 78],
        borderColor: '#818cf8',
        backgroundColor: 'transparent',
        yAxisID: 'yPercent',
        tension: 0.3,
        pointBackgroundColor: '#818cf8',
        pointRadius: 4,
        borderDash: [5, 4]
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#090d16',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      yCgpa: {
        type: 'linear',
        position: 'left',
        min: 4,
        max: 10,
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#38bdf8', font: { size: 10 } },
        title: { display: true, text: 'CGPA (10 pt scale)', color: '#38bdf8', font: { size: 10 } }
      },
      yPercent: {
        type: 'linear',
        position: 'right',
        min: 40,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: { color: '#818cf8', font: { size: 10 } },
        title: { display: true, text: 'Attendance %', color: '#818cf8', font: { size: 10 } }
      }
    }
  };

  // Risk Trend Chart Data (historical dropout risk trajectory)
  const riskTrendData = {
    labels: ['Week 1', 'Week 4', 'Week 8', 'Mid-Term', 'Current (W12)', 'Proj (W16)'],
    datasets: [
      {
        label: 'Predicted Dropout Risk %',
        data: [22, 28, 38, 49, student.dropoutProbability || 46, 32],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#f43f5e',
        pointRadius: 4
      }
    ]
  };

  const riskTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#090d16',
        borderColor: '#1e293b',
        borderWidth: 1,
        titleColor: '#ffffff'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(51, 65, 85, 0.15)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
        title: { display: true, text: 'Risk Probability %', color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Welcome Section & Overall Academic Health */}
      <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Academic Year {student.academicYear || "2025-2026"}
              </span>
              <span className="text-xs text-slate-400">
                {student.department} • Semester {student.semester}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                ID: {student.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {student.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Here is your verified academic health summary, AI risk diagnostic breakdown, and action plan for Semester {student.semester}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate('/student/risk-analysis')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Explore AI Diagnostics</span>
            </button>
            <button
              onClick={() => navigate('/student/recommendations')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Recovery Plan</span>
            </button>
          </div>
        </div>

        {/* Rapid "At a Glance" Answers Banner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                How am I performing?
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                CGPA {student.cgpa} <span className="font-normal text-slate-400">({student.cgpa >= 7.0 ? 'Satisfactory' : 'Needs Reinforcement'})</span>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Am I at risk?
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RiskBadge risk={normalizedRisk} size="sm" />
                <span className="text-xs font-bold text-slate-300">({student.dropoutProbability}%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Why am I at risk?
              </span>
              <p className="text-xs text-slate-300 mt-0.5 truncate max-w-[200px]" title="Attendance below 75% & 1 active backlog">
                {student.attendance < 75 ? `Attendance (${student.attendance}%)` : ''}
                {student.backlogs > 0 ? ` + ${student.backlogs} Backlog` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                What should I do next?
              </span>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                {classesNeededFor75 > 0 ? `Attend next ${classesNeededFor75} lectures` : 'Clear backlog assignments'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Dropout Risk Percentage & Classification */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Dropout Risk Index</span>
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-extrabold tracking-tight ${
                student.dropoutProbability >= 70 ? 'text-rose-400' :
                student.dropoutProbability >= 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {student.dropoutProbability}%
              </span>
              <RiskBadge risk={normalizedRisk} size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Classified as <strong className="text-white">{normalizedRisk} Risk</strong> in institutional telemetry.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Evaluated on {student.predictionDate || 'Aug 2026'}</span>
            <Link to="/student/risk-analysis" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-0.5">
              <span>SHAP</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Attendance Percentage */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Semester Attendance</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-extrabold tracking-tight ${
                student.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {student.attendance}%
              </span>
              <span className="text-[11px] text-slate-400">Target: 75%</span>
            </div>
            <div className="mt-2.5">
              <ProgressBar
                value={student.attendance}
                max={100}
                target={75}
                color={student.attendance < 75 ? 'amber' : 'emerald'}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            {student.attendance < 75 ? (
              <span className="text-amber-400 font-medium">⚠️ {classesNeededFor75} consecutive lectures needed for 75%</span>
            ) : (
              <span className="text-emerald-400 font-medium">✓ Compliant with university attendance norms</span>
            )}
          </div>
        </div>

        {/* Metric 3: Internal / Continuous Assessment Marks */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Internal Assessments</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {student.internalMarks || 61}
              </span>
              <span className="text-xs text-slate-400">/ 100 avg</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Unit Test: <strong>{student.unitTestMarks || 58}%</strong></span>
              <span>Practical: <strong>{student.practicalScore || 74}%</strong></span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Passing Min: 40/100</span>
            <Link to="/student/performance" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5">
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Active Backlogs */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Active Backlogs (ATKT)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-extrabold tracking-tight ${
                student.backlogs > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {student.backlogs}
              </span>
              <span className="text-xs text-slate-400">Pending Paper(s)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {student.backlogs > 0 ? (
                <span>Subject: <strong className="text-slate-200">Database Systems (IT505)</strong></span>
              ) : (
                <span className="text-emerald-400">All previous semesters cleared cleanly.</span>
              )}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
            {student.backlogs > 0 ? (
              <span className="text-amber-300 font-medium">Re-exam scheduled for Nov 2026</span>
            ) : (
              <span className="text-slate-500">Regular Exam Eligibility Active</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Academic Trends & Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Academic Performance & Attendance Trajectory Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Academic Performance & Attendance Progression</span>
              </h3>
              <p className="text-xs text-slate-400">Semester 1 to Semester 5 longitudinal performance record</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                Current SGPA: <strong className="text-cyan-400">{student.cgpa}</strong>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <Line data={trendData} options={trendOptions} />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Noticeable dip in Semester 3 & 4 correlates with transport change and backlog.</span>
            </div>
            <Link to="/student/performance" className="text-cyan-400 hover:text-cyan-300 font-semibold shrink-0 text-[11px]">
              Full breakdown →
            </Link>
          </div>
        </div>

        {/* Right: Risk Trend Over Time */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Risk Trend Over Term</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Simulated AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-3">
              Weekly trajectory of predicted dropout risk leading up to mid-term assessments.
            </p>

            <div className="h-44 w-full">
              <Line data={riskTrendData} options={riskTrendOptions} />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
              <p className="font-semibold">Projected Risk Reduction:</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Targeted attendance recovery can lower current 46% risk down to ~28% before finals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Actionable Goals & Upcoming Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended Next Steps / Interactive Goals */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Priority Academic Action Items</span>
              </h3>
              <p className="text-xs text-slate-400">Target actions to restore good standing and minimize risk</p>
            </div>
            <Link
              to="/student/recommendations"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {quickActions.map((action, idx) => {
              const isDone = completedActions.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-500/5 border-emerald-500/30 opacity-75'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {action.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{action.reason}</p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    action.priority === 'Critical'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : action.priority === 'High'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    {action.priority}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>
              <strong>{completedActions.length}</strong> of {quickActions.length} target milestones accomplished
            </span>
            <span className="text-emerald-400 font-semibold">
              {Math.round((completedActions.length / quickActions.length) * 100)}% Completed
            </span>
          </div>
        </div>

        {/* Right Column: Upcoming Activities & Assigned Faculty Mentor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Academic Schedule */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Upcoming Academic Milestones</span>
              </h3>
              <span className="text-[10px] text-slate-400">Next 14 Days</span>
            </div>

            <div className="space-y-3">
              {upcomingActivities.map((act, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{act.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.course}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono font-medium text-cyan-400 block">{act.date}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{act.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Mentor & Counselor Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Faculty Mentor
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Department Mentor
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <img
                src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150"
                alt={student.mentorName || "Mentor"}
                className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/40"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{student.mentorName || "Dr. Anjali Deshmukh"}</h4>
                <p className="text-xs text-indigo-400">Associate Professor & HOD (IT)</p>
                <p className="text-[11px] text-slate-400">Office Hours: Mon - Thu (3:30 - 4:30 PM)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>anjali.deshmukh@edurisk.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>+91 98201 98765 (Ext: 402)</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => navigate('/student/interventions')}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-[1.01]"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>View Counseling History ({studentInterventions.length} Records)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
