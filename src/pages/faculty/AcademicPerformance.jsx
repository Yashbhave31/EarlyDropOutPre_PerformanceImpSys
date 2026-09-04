import React, { useState } from 'react';
import { BookOpen, Users, AlertCircle, CheckCircle, Award } from 'lucide-react';
import ProgressBar from '../../components/common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';

export default function AcademicPerformance() {
  const { user } = useAuth();
  const { students } = useStudentData();

  const subjects = [
    { code: "IT501", name: "Software Engineering & Agile", credits: 4, avgScore: 68, passRate: 91, attendanceRate: 82, atRiskStudents: 3 },
    { code: "IT502", name: "Database Management & Distributed Systems", credits: 4, avgScore: 62, passRate: 84, attendanceRate: 74, atRiskStudents: 6 },
    { code: "IT503", name: "Computer Networks & Security", credits: 4, avgScore: 58, passRate: 78, attendanceRate: 71, atRiskStudents: 8 },
    { code: "IT504", name: "Machine Learning & Statistical Methods", credits: 3, avgScore: 65, passRate: 88, attendanceRate: 79, atRiskStudents: 4 },
    { code: "IT505", name: "Full Stack Web Technologies Lab", credits: 2, avgScore: 78, passRate: 96, attendanceRate: 86, atRiskStudents: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Department Subject Performance & Course Health</h1>
        <p className="text-xs text-slate-400 mt-1">
          Subject-wise pass rates, lab submission completion, and students requiring remedial academic coaching.
        </p>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div key={sub.code} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {sub.code}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{sub.credits} Credits</span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">{sub.name}</h3>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Average Class Score:</span>
                    <span className="font-bold text-white">{sub.avgScore}/100</span>
                  </div>
                  <ProgressBar value={sub.avgScore} max={100} showPercentage={false} color="blue" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Subject Pass Rate:</span>
                    <span className="font-bold text-emerald-400">{sub.passRate}%</span>
                  </div>
                  <ProgressBar value={sub.passRate} max={100} showPercentage={false} color="emerald" />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Lecture Attendance:</span>
                    <span className={`font-bold ${sub.attendanceRate < 75 ? 'text-red-400' : 'text-slate-200'}`}>
                      {sub.attendanceRate}%
                    </span>
                  </div>
                  <ProgressBar value={sub.attendanceRate} max={100} target={75} showPercentage={false} color="gradient" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Remedial Flag:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                sub.atRiskStudents > 5 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {sub.atRiskStudents} Students Needing Help
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
