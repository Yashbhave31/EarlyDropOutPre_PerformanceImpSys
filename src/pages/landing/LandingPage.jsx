import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import RiskBadge from '../../components/common/RiskBadge';
import RiskGauge from '../../components/prediction/RiskGauge';
import { calculateStudentRisk } from '../../utils/riskCalculator';
import {
  Brain, ShieldAlert, Sparkles, ArrowRight,
  CheckCircle2, AlertTriangle, Database,
  GraduationCap, Target, HeartHandshake, Layers, TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  const [demoAttendance, setDemoAttendance] = useState(68);
  const [demoInternal, setDemoInternal] = useState(58);
  const [demoBacklogs, setDemoBacklogs] = useState(1);
  const [demoFeePending, setDemoFeePending] = useState(true);

  const demoRiskResult = calculateStudentRisk({
    attendance: demoAttendance,
    internalMarks: demoInternal,
    unitTestMarks: demoInternal - 3,
    practicalScore: demoInternal + 10,
    assignmentScore: 70,
    backlogs: demoBacklogs,
    feePending: demoFeePending,
    distanceKm: 18,
    familyIncome: 250000
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>AI-Powered Academic Intelligence & Early Intervention</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Predict Risk. <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Support Students.
                </span> <br />
                Prevent Dropouts.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empower your institution with machine learning analytics. Identify at-risk students before semester examinations, understand underlying academic & socioeconomic drivers, and track faculty mentoring workflows in real-time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/roles"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-600 shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
                >
                  <span>Explore System</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#simulator"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
                >
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>Try AI Risk Simulator</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Explainable AI (SHAP)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Longitudinal Mentorship</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 Role Workspaces</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative glass-card p-6 rounded-3xl border border-slate-700/60 shadow-2xl shadow-indigo-950/50">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Inference Telemetry</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    RF-Ensemble v2.4
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <RiskGauge probability={78} riskLevel="HIGH" />
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Primary Risk Flag:</span>
                    <span className="font-bold text-red-400">Attendance 54% (&lt; 75% limit)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Backlogs Burden:</span>
                    <span className="font-bold text-red-400">2 Core Papers Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-indigo-200 font-semibold">
                    <span>Recommended Action:</span>
                    <span className="text-cyan-300">Biometric Attendance Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">The Institutional Challenge</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Why Traditional Student Monitoring Fails
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Colleges often discover student dropouts only after semester results or term-end defaults, when preventive mentoring is already too late.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-4">
              <div className="flex items-center space-x-3 text-red-400 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Traditional Lagging Approach</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li><strong>Siloed Records:</strong> Attendance registers, exam marks, and fee payment operate on disconnected spreadsheets.</li>
                <li><strong>Late Detection:</strong> At-risk students are flagged only during detention lists right before exams.</li>
                <li><strong>Hidden Factors:</strong> Socioeconomic challenges and long transit commute hours go unmeasured.</li>
                <li><strong>No Accountability:</strong> Informal faculty discussions are never tracked longitudinally.</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-4">
              <div className="flex items-center space-x-3 text-indigo-400 mb-2">
                <Sparkles className="w-6 h-6 text-cyan-300" />
                <h3 className="text-lg font-bold">The EduRisk AI Solution</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li><strong>Unified Profile:</strong> Combines Continuous Tests, Lab Attendance, ATKT backlogs, and Fee status in one view.</li>
                <li><strong>Early ML Prediction:</strong> Classifies student risk 8 weeks prior to end-semester examination windows.</li>
                <li><strong>Explainable AI:</strong> Identifies root cause factors (SHAP) so mentors know exactly what to target.</li>
                <li><strong>Closed-Loop Mentoring:</strong> Logs counseling sessions, parent meetings, and tracks progress over time.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-20 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Interactive Viva Demonstration</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Test the AI Prediction Engine Live
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Adjust student variables below to watch the Machine Learning model dynamically compute dropout probability in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-slate-700">
            <div className="lg:col-span-6 space-y-5 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-200 mb-1.5">
                  <span>Class Attendance</span>
                  <span className="text-indigo-400 font-bold">{demoAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={demoAttendance}
                  onChange={(e) => setDemoAttendance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-200 mb-1.5">
                  <span>Continuous Internal Marks</span>
                  <span className="text-indigo-400 font-bold">{demoInternal} / 100</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={demoInternal}
                  onChange={(e) => setDemoInternal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-200 mb-1.5">
                  <span>Active Academic Backlogs (ATKT)</span>
                  <span className="text-indigo-400 font-bold">{demoBacklogs} Papers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={demoBacklogs}
                  onChange={(e) => setDemoBacklogs(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-semibold text-white block">Tuition Fee Payment Status</span>
                  <span className="text-[10px] text-slate-400">Pending dues create administrative registration holds</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoFeePending(!demoFeePending)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    demoFeePending ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {demoFeePending ? 'Dues Pending' : 'Paid in Full'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <RiskGauge probability={demoRiskResult.dropoutProbability} riskLevel={demoRiskResult.riskLevel} />
              <div className="w-full mt-4 space-y-1.5 text-[11px]">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Contributing Factors:</span>
                {demoRiskResult.contributingFactors.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300">{f.factor}</span>
                    <span className={`font-bold ${f.type === 'negative' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.type === 'negative' ? `+${Math.round(Math.abs(f.weight * 100))}%` : `-${Math.round(Math.abs(f.weight * 100))}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Spectrum Guide */}
      <section id="risk-levels" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tri-Tier Classification</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Actionable Risk Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <RiskBadge risk="LOW" size="lg" />
              <h3 className="text-base font-bold text-white">Low Risk (&lt; 35%)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Student displays consistent attendance (&gt; 75%), passing internal marks, and zero critical ATKT backlogs. Recommended for career skill enrichment.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <RiskBadge risk="MEDIUM" size="lg" />
              <h3 className="text-base font-bold text-white">Medium Risk (35% - 64%)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Early warning signs detected: borderline attendance (65%-74%), 1 active backlog, or pending fee dues. Requires faculty check-in and study group allocation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-3">
              <RiskBadge risk="HIGH" size="lg" />
              <h3 className="text-base font-bold text-white">High Risk (&ge; 65%)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Urgent intervention needed: chronic absenteeism (&lt; 60%), multiple active backlogs, or failing continuous tests. Requires immediate counseling & parent meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Help Every Student Stay on Track.
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Experience the complete TYIT Final Year demonstration with pre-populated cohorts, ML risk simulation, and mentoring workflows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/roles"
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
            >
              Select Your Role & Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Academic Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-400">
        <p>TYIT Final Year Project • Early Dropout Prediction System Using Machine Learning</p>
      </footer>
    </div>
  );
}
