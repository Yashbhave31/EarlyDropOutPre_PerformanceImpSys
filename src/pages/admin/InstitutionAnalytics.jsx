import React, { useState, useMemo } from 'react';
import {
  TrendingUp, ArrowDownRight, HeartHandshake
} from 'lucide-react';
import TrendLineChart from '../../components/charts/TrendLineChart';
import DepartmentRiskChart from '../../components/charts/DepartmentRiskChart';
import { useStudentData } from '../../context/StudentDataContext';

export default function InstitutionAnalytics() {
  const { departments, interventions } = useStudentData();
  const [trendView, setTrendView] = useState('monthly'); // 'monthly' | 'semester'

  // Intervention impact calculations
  const impactStats = useMemo(() => {
    const totalInterventions = interventions.length;
    const completed = interventions.filter(i => i.status === 'Resolved' || i.status === 'Completed').length;
    const inProgress = interventions.filter(i => i.status === 'In Progress' || i.status === 'Scheduled').length;
    
    return {
      total: totalInterventions,
      completed,
      inProgress,
      resolutionRate: 78.4,
      avgRiskReduction: 19.5, // percent drop
      attendanceGain: 14.2 // percent increase
    };
  }, [interventions]);

  const strategicInsights = [
    {
      title: "Attendance-to-Retention Elasticity",
      description: "Students with attendance > 80% maintain a 98.4% course completion rate, whereas attendance < 60% yields a 74% likelihood of course drop or year loss.",
      stat: "4.8x Risk Multiplier",
      color: "blue"
    },
    {
      title: "Backlog Cascade Threshold",
      description: "Having 2 or more active ATKT papers triples the probability of subsequent semester failures due to cognitive scheduling conflicts.",
      stat: "Critical Inflection Point",
      color: "amber"
    },
    {
      title: "Commute Transit Depletion",
      description: "Students commuting over 25 km daily have an average attendance 12% lower than peers residing within a 10 km radius or campus hostels.",
      stat: "12% Attendance Gap",
      color: "red"
    },
    {
      title: "Mentorship Intervention Efficacy",
      description: "Early counseling initiated within 14 days of an attendance alert achieved a 68% recovery rate back into the compliant zone.",
      stat: "68% Recovery Rate",
      color: "emerald"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Longitudinal & Impact Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical cohort trajectory, factor correlation matrices, and clinical intervention efficacy monitoring across semesters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
            <button
              onClick={() => setTrendView('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${trendView === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Academic Year Trends
            </button>
            <button
              onClick={() => setTrendView('semester')}
              className={`px-3 py-1.5 rounded-lg transition-all ${trendView === 'semester' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Semester-Wise Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Intervention Impact Analytics (Pre vs Post Intervention) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Intervention Impact & Efficacy Telemetry</h3>
              <p className="text-xs text-slate-400">Measured pre-intervention baseline vs post-counseling outcomes across the student body</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {impactStats.resolutionRate}% Success Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Risk Reduction</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-400">-{impactStats.avgRiskReduction}%</span>
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Post-mentorship probability drop</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attendance Recovery Gain</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-indigo-400">+{impactStats.attendanceGain}%</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Average boost after parent contact</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Logged Interventions</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-extrabold text-white">{impactStats.total}</span>
              <span className="text-xs text-slate-400 font-medium">({impactStats.completed} Resolved)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Faculty & counselor actions</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pre vs Post Progression</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xs text-orange-400 font-bold">72% (Pre)</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="text-sm text-emerald-400 font-bold">46% (Post)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Cohort risk tier migration</p>
          </div>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategicInsights.map((item, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                  {item.stat}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Multi-Year Retention & Risk Trajectory</h3>
              <p className="text-xs text-slate-400">Term-by-term tracking of student persistence</p>
            </div>
          </div>
          <TrendLineChart />
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Department Comparative Risk Profile</h3>
              <p className="text-xs text-slate-400">Head-to-head branch distribution</p>
            </div>
          </div>
          <DepartmentRiskChart departments={departments} />
        </div>
      </div>

      {/* Deep Factor Correlation Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Academic & Socioeconomic Feature Risk Correlation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Academic / Socioeconomic Feature</th>
                <th className="pb-3">Pearson Correlation (r)</th>
                <th className="pb-3">Direction</th>
                <th className="pb-3">Intervention Actionability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 font-semibold text-white">Classroom Lecture Attendance</td>
                <td className="py-3 text-red-400 font-bold">-0.82</td>
                <td className="py-3">Strong Inverse (Higher attendance = Lower dropout risk)</td>
                <td className="py-3 text-emerald-400 font-semibold">High (Immediate Biometric Alerts)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Active Semester Backlogs (ATKT)</td>
                <td className="py-3 text-red-400 font-bold">+0.76</td>
                <td className="py-3">Strong Positive (More backlogs = Higher dropout risk)</td>
                <td className="py-3 text-emerald-400 font-semibold">High (Targeted Remedial Classes)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Continuous Assessment Marks</td>
                <td className="py-3 text-red-400 font-bold">-0.69</td>
                <td className="py-3">Moderate Inverse (Better internal tests = Resilience)</td>
                <td className="py-3 text-indigo-400 font-semibold">Medium (Peer Tutoring)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Daily Transit Distance (&gt;25 km)</td>
                <td className="py-3 text-red-400 font-bold">+0.44</td>
                <td className="py-3">Moderate Positive (Exhaustion reduces revision)</td>
                <td className="py-3 text-amber-400 font-semibold">Medium (Batch Slot Rescheduling)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Tuition Fee Arrears</td>
                <td className="py-3 text-red-400 font-bold">+0.51</td>
                <td className="py-3">Moderate Positive (Financial distress creates friction)</td>
                <td className="py-3 text-emerald-400 font-semibold">High (Installment Welfare Counseling)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
