import React, { useState } from 'react';
import {
  BrainCircuit, Sparkles, TrendingUp, TrendingDown, CheckCircle2,
  AlertTriangle, ShieldCheck, HelpCircle, Sliders, Info, ArrowRight,
  RotateCcw, Target, Award, Clock
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import RiskGauge from '../../components/prediction/RiskGauge';
import FactorBreakdown from '../../components/prediction/FactorBreakdown';
import RiskBadge from '../../components/common/RiskBadge';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { calculateStudentRisk } from '../../utils/riskCalculator';
import { getRiskColorClass } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function StudentRiskAnalysis() {
  const { user } = useAuth();
  const { students } = useStudentData();

  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];

  // Normalized Risk Classification
  const normalizedRisk = student.riskLevel === 'MEDIUM' ? 'MODERATE' : student.riskLevel;

  // What-if simulator state
  const [simAttendance, setSimAttendance] = useState(student.attendance || 68);
  const [simInternalMarks, setSimInternalMarks] = useState(student.internalMarks || 61);
  const [simBacklogs, setSimBacklogs] = useState(student.backlogs || 1);
  const [appliedGoalMessage, setAppliedGoalMessage] = useState(null);

  // Compute what-if risk dynamically using existing riskCalculator
  const whatIfResult = calculateStudentRisk({
    ...student,
    attendance: simAttendance,
    internalMarks: simInternalMarks,
    backlogs: simBacklogs
  });

  const handleResetSimulator = () => {
    setSimAttendance(student.attendance || 68);
    setSimInternalMarks(student.internalMarks || 61);
    setSimBacklogs(student.backlogs || 1);
    setAppliedGoalMessage(null);
  };

  const handleApplyAsGoal = () => {
    setAppliedGoalMessage(
      `Goal saved! Target attendance set to ${simAttendance}%, internal marks to ${simInternalMarks}, and target backlogs to ${simBacklogs}. Projected Risk: ${whatIfResult.dropoutProbability}%.`
    );
    setTimeout(() => setAppliedGoalMessage(null), 5000);
  };

  // Historical Risk Evolution Chart
  const riskEvolutionData = {
    labels: ['Term Start', 'Week 4', 'Unit Test 1', 'Mid-Term', 'Current (W12)'],
    datasets: [
      {
        label: 'Dropout Risk Probability %',
        data: [20, 26, 38, 48, student.dropoutProbability || 46],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#f43f5e',
        pointRadius: 4
      }
    ]
  };

  const riskEvolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true } },
      tooltip: { backgroundColor: '#090d16', borderColor: '#1e293b', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(51, 65, 85, 0.15)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(51, 65, 85, 0.15)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  };

  // Protective vs Negative Factors
  const negativeFactors = (student.contributingFactors || []).filter(f => f.type === 'negative');
  const protectiveFactors = (student.contributingFactors || []).filter(f => f.type !== 'negative');

  // Fallbacks if empty
  const defaultProtective = protectiveFactors.length > 0 ? protectiveFactors : [
    { factor: "Strong Prior Schooling Foundation", description: "Consistently passed 10th (78%) and 12th (74%) boards without remedial interventions.", weight: -0.08, impact: "MEDIUM" },
    { factor: "Continuous Laboratory Practical Engagement", description: "Maintains 74% aggregate practical and viva exam score.", weight: -0.06, impact: "MEDIUM" },
    { factor: "Active Faculty Mentorship Enrolled", description: "Regularly attends academic counseling with assigned faculty mentor Dr. Anjali Deshmukh.", weight: -0.05, impact: "LOW" }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Risk Diagnostics & Explainability</h1>
          <p className="text-xs text-slate-400 mt-1">
            Understand how our predictive telemetry interprets your academic trajectory and discover paths to reduce risk.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>SHAP Explainable AI Model (Demo ML Engine)</span>
          </span>
        </div>
      </div>

      {/* Transparent Model Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white block mb-0.5">Transparent Predictive Intelligence:</span>
          This analysis utilizes a simulated machine learning framework incorporating Shapley Additive Explanations (SHAP). It measures how individual attributes (attendance, unit test scores, backlogs, and commute factors) positively or negatively adjust your baseline probability.
        </div>
      </div>

      {/* Main Risk Overview & Plain English Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Risk Gauge & Spectrum */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Current Dropout Risk Assessment
            </span>
            <RiskGauge
              probability={student.dropoutProbability}
              riskLevel={normalizedRisk}
            />
          </div>

          {/* Risk Spectrum Scale */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>Risk Classification Spectrum</span>
              <span className="text-white">Your Score: {student.dropoutProbability}%</span>
            </div>

            {/* Visual Color Spectrum Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-950 overflow-hidden flex">
              <div className="h-full w-[35%] bg-emerald-500/70" title="Low: 0-34%" />
              <div className="h-full w-[25%] bg-amber-500/70" title="Moderate: 35-59%" />
              <div className="h-full w-[15%] bg-rose-500/70" title="High: 60-74%" />
              <div className="h-full w-[25%] bg-red-700/80" title="Critical: 75-100%" />

              {/* Pin indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{ left: `${student.dropoutProbability}%` }}
              />
            </div>

            <div className="grid grid-cols-4 text-[9px] text-center text-slate-400 pt-0.5">
              <span className="text-emerald-400">Low (0-34%)</span>
              <span className="text-amber-400">Moderate (35-59%)</span>
              <span className="text-rose-400">High (60-74%)</span>
              <span className="text-red-500">Critical (75%+)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-white">Plain-Language Summary:</strong> Your current predicted risk is <strong className="text-amber-400">Moderate ({student.dropoutProbability}%)</strong>.
            {student.attendance < 75 && " Low lecture attendance is currently your largest risk contributor."}
            {student.backlogs > 0 && ` You also have ${student.backlogs} uncleared ATKT backlog requiring study recovery.`}
          </div>
        </div>

        {/* Right Column: Historical Trajectory & Core Dimension Impacts */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dimension Impact Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl glass-card border border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Impact</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className={`text-xl font-extrabold ${student.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {student.attendance}%
                </span>
                <span className="text-[10px] text-slate-400">({student.attendance < 75 ? '+14% Risk' : '-10% Risk'})</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Below university 75% rule</p>
            </div>

            <div className="p-4 rounded-xl glass-card border border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Marks</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-xl font-extrabold text-cyan-400">{student.internalMarks}%</span>
                <span className="text-[10px] text-slate-400">(Stable)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Average internal standing</p>
            </div>

            <div className="p-4 rounded-xl glass-card border border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backlog Impact</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className={`text-xl font-extrabold ${student.backlogs > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {student.backlogs} Papers
                </span>
                <span className="text-[10px] text-slate-400">({student.backlogs > 0 ? '+12% Risk' : 'Zero'})</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">ATKT in Database Systems</p>
            </div>
          </div>

          {/* Historical Risk Trajectory Chart */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <span>Risk Trajectory Over Semester</span>
              </h3>
              <span className="text-[11px] text-slate-400">Weekly evaluation log</span>
            </div>

            <div className="h-44 w-full">
              <Line data={riskEvolutionData} options={riskEvolutionOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution & Positive Protective Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Negative Risk Drivers */}
        <div className="glass-card p-6 rounded-2xl border border-rose-500/20 bg-rose-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-rose-400">
              <TrendingDown className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Top Risk Drivers (Elevating Factors)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
              Areas To Improve
            </span>
          </div>

          <p className="text-xs text-slate-400">
            These dimensions contribute positively to the probability of dropping out or experiencing academic failure:
          </p>

          <FactorBreakdown factors={negativeFactors} />
        </div>

        {/* Positive Protective Factors */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Positive Protective Factors (Mitigators)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Strengths
            </span>
          </div>

          <p className="text-xs text-slate-400">
            These indicators protect your academic standing and actively pull your risk score downwards:
          </p>

          <div className="space-y-2.5">
            {defaultProtective.map((prot, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{prot.factor}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {Math.round(Math.abs(prot.weight * 100))}% reduction
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{prot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirement 4: Interactive "What-If" Academic Recovery Simulator */}
      <div className="glass-card p-6 sm:p-7 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive "What-If" Academic Risk Simulator</h3>
              <p className="text-xs text-slate-400">
                Adjust key academic variables below to observe real-time projected risk changes using the machine learning engine.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetSimulator}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Baseline</span>
            </button>
          </div>
        </div>

        {appliedGoalMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{appliedGoalMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Variable 1: Attendance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span>Lecture Attendance Percentage:</span>
                  <span className="text-[10px] text-slate-500">(Current: {student.attendance}%)</span>
                </span>
                <span className="text-cyan-400 font-mono text-sm">{simAttendance}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="100"
                value={simAttendance}
                onChange={(e) => setSimAttendance(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>45% (Critical Shortage)</span>
                <span>75% (Eligibility Norm)</span>
                <span>100% (Perfect)</span>
              </div>
            </div>

            {/* Variable 2: Internal Assessment Marks */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span>Internal Continuous Assessment Marks:</span>
                  <span className="text-[10px] text-slate-500">(Current: {student.internalMarks}%)</span>
                </span>
                <span className="text-cyan-400 font-mono text-sm">{simInternalMarks} / 100</span>
              </div>
              <input
                type="range"
                min="35"
                max="95"
                value={simInternalMarks}
                onChange={(e) => setSimInternalMarks(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>35 (Passing Border)</span>
                <span>65 (Average)</span>
                <span>95 (Distinction)</span>
              </div>
            </div>

            {/* Variable 3: Uncleared ATKT Backlogs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span>Uncleared ATKT Backlog Papers:</span>
                  <span className="text-[10px] text-slate-500">(Current: {student.backlogs})</span>
                </span>
                <span className="text-cyan-400 font-mono text-sm">{simBacklogs} Paper(s)</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSimBacklogs(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      simBacklogs === num
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {num === 0 ? '0 (All Clear)' : `${num} Paper`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Projected Output Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Projected Model Risk Outcome
              </span>

              <div className="mt-2 flex items-baseline justify-center space-x-2">
                <span className={`text-4xl font-extrabold tracking-tight ${
                  whatIfResult.dropoutProbability >= 70 ? 'text-rose-400' :
                  whatIfResult.dropoutProbability >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {whatIfResult.dropoutProbability}%
                </span>
                <span className="text-xs text-slate-400">Dropout Probability</span>
              </div>

              <div className="mt-2">
                <RiskBadge risk={whatIfResult.riskLevel} size="md" />
              </div>
            </div>

            {/* Comparison with Baseline */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Real Risk:</span>
                <span className="font-bold text-white">{student.dropoutProbability}% ({normalizedRisk})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated Hypothetical:</span>
                <span className="font-bold text-cyan-400">{whatIfResult.dropoutProbability}% ({whatIfResult.riskLevel})</span>
              </div>
              <div className="pt-1 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-slate-300">Projected Delta:</span>
                <span className={whatIfResult.dropoutProbability < student.dropoutProbability ? 'text-emerald-400' : 'text-slate-400'}>
                  {whatIfResult.dropoutProbability < student.dropoutProbability
                    ? `📉 -${student.dropoutProbability - whatIfResult.dropoutProbability}% Risk Reduction`
                    : whatIfResult.dropoutProbability > student.dropoutProbability
                    ? `📈 +${whatIfResult.dropoutProbability - student.dropoutProbability}% Risk Increase`
                    : 'No Change'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyAsGoal}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.01]"
            >
              <Target className="w-4 h-4" />
              <span>Commit as Target Semester Goal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
