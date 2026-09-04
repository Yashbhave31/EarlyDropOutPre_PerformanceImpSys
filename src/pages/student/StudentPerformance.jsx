import React, { useState } from 'react';
import {
  BookOpen, CheckCircle2, AlertTriangle, Award, GraduationCap,
  TrendingUp, TrendingDown, Filter, Search, ArrowUpRight, BarChart2,
  FileCheck, Calendar, Info
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import ProgressBar from '../../components/common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function StudentPerformance() {
  const { user } = useAuth();
  const { students } = useStudentData();
  const [filterType, setFilterType] = useState('ALL'); // ALL, AT_RISK, STRONG
  const [searchTerm, setSearchTerm] = useState('');

  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];

  const subjects = [
    {
      code: "IT501",
      name: "Software Engineering & Agile Methodologies",
      credits: 4,
      attendance: 68,
      internal: 64,
      unitTest: 58,
      assignment: 72,
      practical: 70,
      faculty: "Prof. Sandeep Rao",
      standing: "Needs Attendance",
      statusType: "WARNING"
    },
    {
      code: "IT502",
      name: "Advanced Java Programming & Frameworks",
      credits: 4,
      attendance: 65,
      internal: 56,
      unitTest: 52,
      assignment: 60,
      practical: 66,
      faculty: "Dr. Anjali Deshmukh",
      standing: "Needs Reinforcement",
      statusType: "DANGER"
    },
    {
      code: "IT503",
      name: "Computer Networks & Security Architecture",
      credits: 4,
      attendance: 76,
      internal: 74,
      unitTest: 70,
      assignment: 80,
      practical: 78,
      faculty: "Prof. Snehal More",
      standing: "Good Standing",
      statusType: "GOOD"
    },
    {
      code: "IT504",
      name: "Machine Learning & Statistical Foundations",
      credits: 3,
      attendance: 72,
      internal: 62,
      unitTest: 55,
      assignment: 68,
      practical: 70,
      faculty: "Dr. Rajesh Sharma",
      standing: "Passing",
      statusType: "WARNING"
    },
    {
      code: "IT505",
      name: "Web Development & Full-Stack Lab",
      credits: 2,
      attendance: 84,
      internal: 86,
      unitTest: 82,
      assignment: 90,
      practical: 88,
      faculty: "Prof. Priya Mehta",
      standing: "Distinction",
      statusType: "EXCELLENT"
    },
    {
      code: "IT506",
      name: "Database Systems & Administration (ATKT)",
      credits: 4,
      attendance: 61,
      internal: 54,
      unitTest: 48,
      assignment: 58,
      practical: 64,
      faculty: "Prof. Amit Verma",
      standing: "Active Backlog Recovery",
      statusType: "CRITICAL"
    }
  ];

  // Strong vs Weak Subject identification
  const sortedByMarks = [...subjects].sort((a, b) => {
    const avgA = (a.internal + a.unitTest + a.practical) / 3;
    const avgB = (b.internal + b.unitTest + b.practical) / 3;
    return avgB - avgA;
  });

  const strongestSubject = sortedByMarks[0];
  const weakestSubject = sortedByMarks[sortedByMarks.length - 1];

  // Semester by semester progression record
  const semesterHistory = [
    { sem: "Sem 1", sgpa: 7.20, credits: 24, status: "Cleared", attendance: 86, year: "2023-24" },
    { sem: "Sem 2", sgpa: 6.90, credits: 24, status: "Cleared", attendance: 82, year: "2023-24" },
    { sem: "Sem 3", sgpa: 6.60, credits: 24, status: "Cleared", attendance: 74, year: "2024-25" },
    { sem: "Sem 4", sgpa: 6.20, credits: 24, status: "1 ATKT Backlog", attendance: 70, year: "2024-25" },
    { sem: "Sem 5", sgpa: student.cgpa || 6.40, credits: 21, status: "In Progress", attendance: student.attendance || 68, year: "2025-26" }
  ];

  // Filtered subjects
  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'AT_RISK') return sub.attendance < 75 || sub.statusType === 'CRITICAL' || sub.statusType === 'DANGER';
    if (filterType === 'STRONG') return sub.statusType === 'GOOD' || sub.statusType === 'EXCELLENT';
    return true;
  });

  // Chart 1: Subject Comparison Bar Chart
  const subjectComparisonData = {
    labels: subjects.map(s => s.code),
    datasets: [
      {
        label: 'Internal Marks %',
        data: subjects.map(s => s.internal),
        backgroundColor: 'rgba(56, 189, 248, 0.7)',
        borderRadius: 6
      },
      {
        label: 'Unit Test %',
        data: subjects.map(s => s.unitTest),
        backgroundColor: 'rgba(129, 140, 248, 0.7)',
        borderRadius: 6
      },
      {
        label: 'Subject Attendance %',
        data: subjects.map(s => s.attendance),
        backgroundColor: 'rgba(52, 211, 153, 0.7)',
        borderRadius: 6
      }
    ]
  };

  const subjectComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true }
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
        title: { display: true, text: 'Score / Attendance %', color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Academic Performance & Course Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Subject-level marks, internal examinations, continuous assessments, and historical semester trajectories.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Cumulative CGPA: <strong className="text-cyan-400">{student.cgpa} / 10</strong>
          </span>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Overall Attendance: <strong className={student.attendance < 75 ? 'text-amber-400' : 'text-emerald-400'}>{student.attendance}%</strong>
          </span>
        </div>
      </div>

      {/* Strong vs Weak Subject Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Subject */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Performing Subject</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Distinction Level
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{strongestSubject.name}</h3>
            <p className="text-xs text-indigo-400 font-mono mt-0.5">{strongestSubject.code} • {strongestSubject.credits} Credits • {strongestSubject.faculty}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Internal Marks</span>
              <span className="text-xs font-bold text-emerald-400">{strongestSubject.internal}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Practical Lab</span>
              <span className="text-xs font-bold text-emerald-400">{strongestSubject.practical}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Attendance</span>
              <span className="text-xs font-bold text-emerald-400">{strongestSubject.attendance}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300">
            ✓ Consistent coursework, laboratory journal on schedule, excellent lab exam preparation.
          </p>
        </div>

        {/* Weak Subject / Needs Attention */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Requires Immediate Focus</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              High Academic Risk
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{weakestSubject.name}</h3>
            <p className="text-xs text-rose-300 font-mono mt-0.5">{weakestSubject.code} • {weakestSubject.credits} Credits • {weakestSubject.faculty}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Unit Test</span>
              <span className="text-xs font-bold text-rose-400">{weakestSubject.unitTest}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Internal Marks</span>
              <span className="text-xs font-bold text-amber-400">{weakestSubject.internal}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Attendance</span>
              <span className="text-xs font-bold text-rose-400">{weakestSubject.attendance}%</span>
            </div>
          </div>

          <p className="text-[11px] text-rose-200">
            ⚠️ Active ATKT backlog. Prioritize attendance and 3x weekly peer tutoring sessions with Sneha Kulkarni.
          </p>
        </div>
      </div>

      {/* Visual Analytics & Subject Comparison */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Subject-Wise Marks & Attendance Comparison</span>
            </h3>
            <p className="text-xs text-slate-400">Comparing internal continuous assessment, unit tests, and lecture attendance</p>
          </div>
          <div className="text-xs text-slate-400">
            Baseline Eligibility Threshold: <strong className="text-slate-200">75% Attendance / 40% Marks</strong>
          </div>
        </div>

        <div className="h-64 w-full">
          <Bar data={subjectComparisonData} options={subjectComparisonOptions} />
        </div>
      </div>

      {/* Semester by Semester History Accordion/Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Semester-Wise Cumulative History (Sem 1 to 5)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Historical credit progression, SGPA, and examination clearance records</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Total Credits: 117</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">SGPA</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Term Attendance</th>
                <th className="py-3 px-4 text-right">Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {semesterHistory.map((sem, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{sem.sem}</td>
                  <td className="py-3 px-4 text-slate-300">{sem.year}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-cyan-400">{sem.sgpa.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{sem.credits} credits</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${sem.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {sem.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sem.status === 'Cleared'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : sem.status === 'In Progress'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {sem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Current Semester Subject Roster */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Current Semester 5 Detailed Subjects Roster</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Component breakdown: Internal, Unit Test, Lab, Assignments & Attendance</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
              />
            </div>

            <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('AT_RISK')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterType === 'AT_RISK' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                At Risk
              </button>
              <button
                type="button"
                onClick={() => setFilterType('STRONG')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterType === 'STRONG' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Strong
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Subject & Faculty</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Internal (100)</th>
                <th className="py-3 px-4">Unit Test (100)</th>
                <th className="py-3 px-4">Assignments (100)</th>
                <th className="py-3 px-4">Practical Lab (100)</th>
                <th className="py-3 px-4 text-right">Academic Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{sub.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-cyan-400">{sub.code}</span>
                      <span className="text-[10px] text-slate-500">• {sub.faculty}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {sub.credits}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${sub.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sub.attendance}%
                      </span>
                      {sub.attendance < 75 && (
                        <span className="text-[10px] text-amber-400 font-medium">(Short)</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {sub.internal}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {sub.unitTest}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {sub.assignment}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {sub.practical}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.statusType === 'EXCELLENT'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : sub.statusType === 'GOOD'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : sub.statusType === 'WARNING'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {sub.standing}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No subjects found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
