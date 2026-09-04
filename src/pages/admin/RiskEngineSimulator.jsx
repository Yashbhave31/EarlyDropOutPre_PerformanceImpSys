import React, { useState, useMemo } from 'react';
import {
  Sliders, RefreshCw, BrainCircuit, CheckCircle2, Sparkles,
  Info, TrendingDown, TrendingUp, Play
} from 'lucide-react';
import RiskGauge from '../../components/prediction/RiskGauge';
import FactorBreakdown from '../../components/prediction/FactorBreakdown';
import FactorImportanceChart from '../../components/charts/FactorImportanceChart';
import { calculateStudentRisk } from '../../utils/riskCalculator';

export default function RiskEngineSimulator() {
  // Baseline initial state (represents current student state before simulation changes)
  const initialBaseline = {
    attendance: 58,
    internalMarks: 48,
    unitTestMarks: 45,
    assignmentScore: 55,
    practicalScore: 60,
    backlogs: 3,
    cgpa: 5.4,
    feePending: true,
    distanceKm: 28,
    familyIncome: 210000
  };

  const [baselineParams, setBaselineParams] = useState(initialBaseline);
  const [simParams, setSimParams] = useState(initialBaseline);

  // Calculate baseline risk
  const baselineResult = useMemo(() => {
    return calculateStudentRisk(baselineParams);
  }, [baselineParams]);

  // Calculate simulated risk
  const simResult = useMemo(() => {
    return calculateStudentRisk(simParams);
  }, [simParams]);

  // Compute risk delta
  const riskDelta = simResult.dropoutProbability - baselineResult.dropoutProbability;

  const handleResetToBaseline = () => {
    setSimParams({ ...baselineParams });
  };

  const handleApplyPreset = (type) => {
    if (type === 'critical') {
      const preset = {
        attendance: 48,
        internalMarks: 40,
        unitTestMarks: 38,
        assignmentScore: 45,
        practicalScore: 50,
        backlogs: 4,
        cgpa: 4.8,
        feePending: true,
        distanceKm: 34,
        familyIncome: 180000
      };
      setBaselineParams(preset);
      setSimParams(preset);
    } else if (type === 'moderate') {
      const preset = {
        attendance: 68,
        internalMarks: 60,
        unitTestMarks: 58,
        assignmentScore: 68,
        practicalScore: 72,
        backlogs: 1,
        cgpa: 6.8,
        feePending: false,
        distanceKm: 16,
        familyIncome: 350000
      };
      setBaselineParams(preset);
      setSimParams(preset);
    } else if (type === 'remediated') {
      setSimParams(prev => ({
        ...prev,
        attendance: Math.min(100, Math.max(78, prev.attendance + 20)),
        backlogs: Math.max(0, prev.backlogs - 2),
        internalMarks: Math.min(100, prev.internalMarks + 18),
        unitTestMarks: Math.min(100, prev.unitTestMarks + 15),
        feePending: false
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Prominent Mandatory Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Risk Engine Simulator</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Risk Simulation / Demo Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate parameter adjustments to visualize projected dropout probability transitions and SHAP explainability weights.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetToBaseline}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Changes</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Callout */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-white">Risk Simulation / Demo Model:</strong> This module is an educational simulation designed for academic advisors to understand variable sensitivity and intervention scenarios. It demonstrates explainable attribution weights rather than an immutable production inference decision.
        </p>
      </div>

      {/* Presets Quick Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto text-xs pb-1">
        <span className="text-slate-400 font-semibold mr-1">Load Scenarios:</span>
        <button
          onClick={() => handleApplyPreset('critical')}
          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-medium transition-colors"
        >
          Preset: Critical Risk Baseline (48% Att, 4 Backlogs)
        </button>
        <button
          onClick={() => handleApplyPreset('moderate')}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition-colors"
        >
          Preset: Moderate Risk Baseline (68% Att, 1 Backlog)
        </button>
        <button
          onClick={() => handleApplyPreset('remediated')}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors flex items-center space-x-1"
        >
          <Play className="w-3 h-3" />
          <span>Apply Simulated Remedial Recovery</span>
        </button>
      </div>

      {/* Simulation Comparative Delta Card */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Baseline State */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Current Baseline Risk</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-white">{baselineResult.dropoutProbability}%</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                baselineResult.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                baselineResult.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                baselineResult.riskLevel === 'MODERATE' || baselineResult.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {baselineResult.riskLevel}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
              <p>Attendance: <strong className="text-white">{baselineParams.attendance}%</strong></p>
              <p>Backlogs: <strong className="text-white">{baselineParams.backlogs} Papers</strong></p>
              <p>CGPA: <strong className="text-white">{baselineParams.cgpa}</strong></p>
            </div>
          </div>

          {/* Delta Indicator */}
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulation Delta</span>
              {riskDelta < 0 ? (
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              ) : riskDelta > 0 ? (
                <TrendingUp className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div className={`text-2xl font-extrabold ${riskDelta < 0 ? 'text-emerald-400' : riskDelta > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {riskDelta > 0 ? `+${riskDelta}%` : `${riskDelta}%`}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              {riskDelta < 0
                ? `${Math.abs(riskDelta)}% theoretical risk reduction via remedial intervention.`
                : riskDelta > 0
                ? `${riskDelta}% estimated risk escalation.`
                : 'Parameters match baseline.'}
            </p>
          </div>

          {/* New Simulated State */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">New Simulated Risk</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-white">{simResult.dropoutProbability}%</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                simResult.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                simResult.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                simResult.riskLevel === 'MODERATE' || simResult.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {simResult.riskLevel}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
              <p>Attendance: <strong className={simParams.attendance >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{simParams.attendance}%</strong></p>
              <p>Backlogs: <strong className={simParams.backlogs === 0 ? 'text-emerald-400' : 'text-orange-400'}>{simParams.backlogs} Papers</strong></p>
              <p>CGPA: <strong className="text-white">{simParams.cgpa}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sliders (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Interactive Feature Adjustment Controls</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Recalculation</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Classroom Attendance */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Classroom Attendance</span>
                <span className={`font-bold ${simParams.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simParams.attendance}% {simParams.attendance < 75 ? '(Deficit < 75%)' : '(Compliant ≥ 75%)'}
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                value={simParams.attendance}
                onChange={(e) => setSimParams({ ...simParams, attendance: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Backlogs */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Active Academic Backlogs (ATKT Papers)</span>
                <span className={`font-bold ${simParams.backlogs > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simParams.backlogs} Pending
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSimParams({ ...simParams, backlogs: num })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      simParams.backlogs === num
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Cumulative Grade Point Average (CGPA) */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Cumulative GPA (Previous Academic Performance)</span>
                <span className="text-white font-bold">{simParams.cgpa} / 10.0</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="10.0"
                step="0.1"
                value={simParams.cgpa}
                onChange={(e) => setSimParams({ ...simParams, cgpa: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Continuous Assessment Internal Marks & Unit Test */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">Internal Continuous Marks</span>
                  <span className="text-white font-bold">{simParams.internalMarks} / 100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={simParams.internalMarks}
                  onChange={(e) => setSimParams({ ...simParams, internalMarks: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">Unit Test Score</span>
                  <span className="text-white font-bold">{simParams.unitTestMarks} / 100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={simParams.unitTestMarks}
                  onChange={(e) => setSimParams({ ...simParams, unitTestMarks: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Commute Distance & Tuition Fee Arrears */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-300">Transit Distance</span>
                  <span className="text-white font-bold">{simParams.distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={simParams.distanceKm}
                  onChange={(e) => setSimParams({ ...simParams, distanceKm: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="simFeePending"
                  checked={simParams.feePending}
                  onChange={(e) => setSimParams({ ...simParams, feePending: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <label htmlFor="simFeePending" className="text-slate-300 font-medium cursor-pointer">
                  Tuition Fee Dues Pending (Arrears)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Simulated Gauge & Factor Attribution (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>Simulated Output Telemetry</span>
              </span>
              <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Demo Model
              </span>
            </div>

            <RiskGauge
              probability={simResult.dropoutProbability}
              riskLevel={simResult.riskLevel}
            />

            <div className="w-full mt-4 pt-4 border-t border-slate-800 text-xs text-center">
              {simResult.riskLevel === 'CRITICAL' ? (
                <span className="text-red-400 font-semibold">
                  🚨 Critical Risk: Requires emergency student-mentor intervention contract.
                </span>
              ) : simResult.riskLevel === 'HIGH' ? (
                <span className="text-orange-400 font-semibold">
                  ⚠️ High Risk: Subject to mandatory remedial classes and bi-weekly counseling.
                </span>
              ) : simResult.riskLevel === 'MODERATE' || simResult.riskLevel === 'MEDIUM' ? (
                <span className="text-amber-400 font-semibold">
                  ⚡ Moderate Risk: Peer study groups and attendance monitoring advised.
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold">
                  ✅ Low Risk: Student indicators meet graduation retention safety thresholds.
                </span>
              )}
            </div>
          </div>

          {/* Explainable AI SHAP Attribution for Simulated Vector */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Simulated SHAP Factor Attributions
              </h3>
              <span className="text-[10px] text-indigo-400 font-semibold">Feature Weights</span>
            </div>
            <FactorBreakdown factors={simResult.contributingFactors} />
          </div>
        </div>
      </div>

      {/* Global Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Global Feature Importance (SHAP Mean |Value|)</h3>
              <p className="text-xs text-slate-400">Institutional ranking of parameters driving retention risk across all student cohorts</p>
            </div>
          </div>
          <FactorImportanceChart />
        </div>

        {/* Model Architecture Specifications */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Model Architecture & Explainability Specs</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Classification Algorithm</span>
              <p className="font-bold text-white mt-0.5">Ensemble Gradient Boost + RF</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Cross-Validation Accuracy</span>
              <p className="font-bold text-emerald-400 mt-0.5">94.2% (10-fold CV)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Attribution Mechanism</span>
              <p className="font-bold text-indigo-400 mt-0.5">TreeSHAP Additive Values</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Cohort Training Base</span>
              <p className="font-bold text-white mt-0.5">4,800 Historical Student Vectors</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            In this demonstration model, classroom attendance below the mandatory 75% cutoff accounts for the greatest predictive weight (35%), followed by active ATKT backlogs (25%), continuous assessment scores (20%), and socioeconomic stress factors (20%).
          </p>
        </div>
      </div>
    </div>
  );
}
