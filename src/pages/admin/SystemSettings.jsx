import React, { useState } from 'react';
import {
  Save, CheckCircle2, Sliders, Bell, Calendar,
  Building2
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function SystemSettings() {
  const { addNotification } = useNotifications();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Risk Engine Thresholds
    attendanceCutoff: 75,
    criticalRiskThreshold: 80,
    highRiskThreshold: 65,
    mediumRiskThreshold: 35,
    modelSensitivity: 'BALANCED', // 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'

    // Academic Term
    academicYear: '2025-2026',
    activeSemester: '5',

    // Department Benchmarks
    targetRetentionRate: 92,
    maxBacklogsBeforeMandatoryCounseling: 2,
    internalMarksPassThreshold: 40,

    // Notification Pipelines
    emailAlertsEnabled: true,
    smsParentAlertsEnabled: true,
    weeklyDigestEnabled: true,
    autoAssignCounselor: true,
    criticalRiskEscalationHOD: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);

    if (addNotification) {
      addNotification({
        title: 'System Settings Saved',
        message: 'Predictive risk thresholds and institutional benchmarks updated.',
        type: 'success'
      });
    }

    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Institutional System & Risk Threshold Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure university risk classification boundaries, mandatory attendance quotas, model sensitivity, and automated notification pipelines.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Institutional configurations updated successfully. All subsequent ML batch runs and early alerts will apply these parameters.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Thresholds Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">ML Risk Engine Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Attendance Cutoff (%)
              </label>
              <input
                type="number"
                min="50"
                max="90"
                value={settings.attendanceCutoff}
                onChange={(e) => setSettings({ ...settings, attendanceCutoff: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Mandatory regulatory cutoff: 75%</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Critical Risk Cutoff (&gt;%)
              </label>
              <input
                type="number"
                min="70"
                max="95"
                value={settings.criticalRiskThreshold}
                onChange={(e) => setSettings({ ...settings, criticalRiskThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-red-400 font-bold focus:border-red-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Emergency escalation cutoff: 80%</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                High Risk Threshold (&gt;%)
              </label>
              <input
                type="number"
                min="50"
                max="80"
                value={settings.highRiskThreshold}
                onChange={(e) => setSettings({ ...settings, highRiskThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-orange-400 font-bold focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Flagged for 1-on-1 counseling: 65%</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Moderate Risk Bound (%)
              </label>
              <input
                type="number"
                min="20"
                max="50"
                value={settings.mediumRiskThreshold}
                onChange={(e) => setSettings({ ...settings, mediumRiskThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Peer group & study watch: 35%</span>
            </div>
          </div>

          {/* Model Sensitivity / Alert Aggressiveness */}
          <div className="pt-3 border-t border-slate-800/80">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Model Sensitivity & Alert Aggressiveness
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { id: 'CONSERVATIVE', title: 'Conservative', desc: 'Fewer false alarms. Triggers alerts only on persistent multi-factor deficit.' },
                { id: 'BALANCED', title: 'Standard Balanced (Recommended)', desc: 'Optimized early-warning detection. Flags drops in attendance within 10 days.' },
                { id: 'AGGRESSIVE', title: 'Aggressive Intervention', desc: 'Maximum sensitivity. Flags single test failures or minor attendance slips.' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setSettings({ ...settings, modelSensitivity: opt.id })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    settings.modelSensitivity === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-white mb-0.5">{opt.title}</p>
                  <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional & Department Benchmarks */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Departmental Benchmarks & Academic Targets</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Annual Retention Rate (%)</label>
              <input
                type="number"
                min="80"
                max="99"
                value={settings.targetRetentionRate}
                onChange={(e) => setSettings({ ...settings, targetRetentionRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">NAAC institutional threshold: 92%</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Max ATKT Backlogs Before Action</label>
              <input
                type="number"
                min="1"
                max="4"
                value={settings.maxBacklogsBeforeMandatoryCounseling}
                onChange={(e) => setSettings({ ...settings, maxBacklogsBeforeMandatoryCounseling: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Mandatory remedial coaching threshold</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Internal Pass Benchmark (Marks)</label>
              <input
                type="number"
                min="35"
                max="60"
                value={settings.internalMarksPassThreshold}
                onChange={(e) => setSettings({ ...settings, internalMarksPassThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Continuous assessment passing bar</span>
            </div>
          </div>
        </div>

        {/* Academic Term Setup */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Active Academic Term</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Academic Year</label>
              <select
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              >
                <option value="2025-2026">2025 - 2026 (Current Active Term)</option>
                <option value="2024-2025">2024 - 2025 (Archive)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Current Active Semester</label>
              <select
                value={settings.activeSemester}
                onChange={(e) => setSettings({ ...settings, activeSemester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              >
                <option value="5">Semester 5 (TY - Active)</option>
                <option value="6">Semester 6 (Upcoming)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Automated Alert & Notification Pipelines */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Automatic Notification & Dispatch Triggers</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <span className="text-slate-200">
                Send real-time instant alert to Faculty Mentor when a mentee crosses &gt;65% Dropout Risk
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.criticalRiskEscalationHOD}
                onChange={(e) => setSettings({ ...settings, criticalRiskEscalationHOD: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <span className="text-slate-200">
                Immediately escalate Critical Risk students (&gt;80%) to Department HOD and Principal
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsParentAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, smsParentAlertsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <span className="text-slate-200">
                Trigger SMS notification to registered parent guardian when monthly attendance falls below 65%
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyDigestEnabled}
                onChange={(e) => setSettings({ ...settings, weeklyDigestEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <span className="text-slate-200">
                Dispatch weekly Attendance Defaulter summaries to Academic Deans
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAssignCounselor}
                onChange={(e) => setSettings({ ...settings, autoAssignCounselor: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <span className="text-slate-200">
                Automatically allocate newly enrolled unassigned students to active departmental faculty roster
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Institutional Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
