import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, AlertTriangle, Calendar, HeartHandshake, CheckCircle2,
  ArrowUpRight, Plus, Sparkles, ShieldAlert, TrendingUp, TrendingDown,
  Clock, ArrowRight, FileText, BookOpen, Bell, AlertCircle, Eye,
  ChevronRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { students, interventions, logIntervention } = useStudentData();
  const navigate = useNavigate();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);

  // Mentees assigned to this faculty mentor or department
  const myStudents = students.filter(s =>
    s.mentorId === user?.id ||
    s.mentorName?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
    s.department === (user?.department || 'Information Technology')
  );

  // Risk metrics
  const lowRisk = myStudents.filter(s => s.riskLevel === 'LOW');
  const moderateRisk = myStudents.filter(s => s.riskLevel === 'MODERATE' || s.riskLevel === 'MEDIUM');
  const highRisk = myStudents.filter(s => s.riskLevel === 'HIGH');
  const criticalRisk = myStudents.filter(s => s.riskLevel === 'CRITICAL');
  const urgentCount = criticalRisk.length + highRisk.length;

  const attendanceDefaulters = myStudents.filter(s => s.attendance < 75);
  const avgAttendance = myStudents.length
    ? Math.round(myStudents.reduce((acc, s) => acc + (s.attendance || 0), 0) / myStudents.length)
    : 0;
  const avgCGPA = myStudents.length
    ? (myStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / myStudents.length).toFixed(2)
    : '0.00';

  // Interventions for my students or logged by this faculty
  const myInterventions = interventions.filter(i =>
    i.facultyId === user?.id ||
    myStudents.some(s => s.id === i.studentId)
  );
  const upcomingSessions = myInterventions.filter(i => i.status === 'Scheduled' || i.status === 'Follow-up Required');
  const completedSessions = myInterventions.filter(i => i.status === 'Completed');

  // Attention Required Students Queue (Critical first, then High, then Low Attendance)
  const attentionRequiredStudents = [...myStudents]
    .filter(s => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH' || s.attendance < 75 || s.backlogs > 0)
    .sort((a, b) => (b.dropoutProbability || 0) - (a.dropoutProbability || 0));

  // Dynamic alerts
  const recentAlerts = [
    {
      id: 'alt-1',
      type: 'critical',
      title: 'Biometric Attendance Deficit Alert',
      desc: `${attendanceDefaulters.length} assigned students are currently below the mandatory 75% threshold.`,
      time: '1 hour ago',
      action: () => navigate('/faculty/students?filter=defaulters')
    },
    {
      id: 'alt-2',
      type: 'warning',
      title: 'Remedial Backlog Recovery Phase 1',
      desc: `${myStudents.filter(s => s.backlogs > 0).length} students have uncleared ATKT papers eligible for departmental tutorials.`,
      time: '3 hours ago',
      action: () => navigate('/faculty/predictions')
    },
    {
      id: 'alt-3',
      type: 'info',
      title: 'AI Dropout Engine Synchronization',
      desc: 'Risk simulation model updated based on Semester 5 continuous assessment intake data.',
      time: 'Yesterday',
      action: () => navigate('/faculty/data-collection')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mentor Welcome Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Faculty Mentorship Command Center
            </span>
            <span className="text-xs text-slate-400 font-medium">{user?.department || 'Information Technology'} Department</span>
            <span className="text-[10px] text-slate-500">• Semester 5 (2025–2026)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.name || 'Dr. Rajesh Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            You are overseeing <strong className="text-slate-200">{myStudents.length} mentees</strong>.
            Currently, <strong className="text-red-400">{criticalRisk.length} Critical</strong> and <strong className="text-amber-400">{highRisk.length} High-Risk</strong> students require proactive intervention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/faculty/data-collection')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Update Student Data</span>
          </button>
          <button
            onClick={() => {
              if (attentionRequiredStudents.length > 0) {
                setInterventionStudent(attentionRequiredStudents[0]);
              } else if (myStudents.length > 0) {
                setInterventionStudent(myStudents[0]);
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Counseling</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Mentees"
          value={myStudents.length}
          subtitle={`${myStudents.filter(s => s.semester === 5).length} in Semester 5 cohort`}
          icon={Users}
          color="blue"
          onClick={() => navigate('/faculty/students')}
        />
        <StatCard
          title="Immediate Intervention"
          value={urgentCount}
          subtitle={`${criticalRisk.length} Critical • ${highRisk.length} High Risk`}
          icon={AlertTriangle}
          color="red"
          onClick={() => navigate('/faculty/students?risk=HIGH')}
        />
        <StatCard
          title="Avg Class Attendance"
          value={`${avgAttendance}%`}
          subtitle={avgAttendance < 75 ? 'Below 75% institutional cutoff' : 'Above compliance baseline'}
          icon={Calendar}
          color={avgAttendance < 75 ? 'red' : 'emerald'}
          onClick={() => navigate('/faculty/reports')}
        />
        <StatCard
          title="Active Interventions"
          value={myInterventions.length}
          subtitle={`${completedSessions.length} resolved • ${upcomingSessions.length} scheduled`}
          icon={HeartHandshake}
          color="indigo"
          onClick={() => navigate('/faculty/interventions')}
        />
      </div>

      {/* Risk Distribution & Health Bar */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Cohort Risk Classification Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400">Total {myStudents.length} Assigned Students categorized by early dropout probability</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Low: {lowRisk.length} ({myStudents.length ? Math.round((lowRisk.length / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Moderate: {moderateRisk.length} ({myStudents.length ? Math.round((moderateRisk.length / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              High: {highRisk.length} ({myStudents.length ? Math.round((highRisk.length / myStudents.length) * 100) : 0}%)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
              Critical: {criticalRisk.length} ({myStudents.length ? Math.round((criticalRisk.length / myStudents.length) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${myStudents.length ? (lowRisk.length / myStudents.length) * 100 : 0}%` }}
            className="h-full bg-emerald-500 transition-all"
            title={`Low Risk: ${lowRisk.length}`}
          />
          <div
            style={{ width: `${myStudents.length ? (moderateRisk.length / myStudents.length) * 100 : 0}%` }}
            className="h-full bg-blue-500 transition-all"
            title={`Moderate Risk: ${moderateRisk.length}`}
          />
          <div
            style={{ width: `${myStudents.length ? (highRisk.length / myStudents.length) * 100 : 0}%` }}
            className="h-full bg-amber-500 transition-all"
            title={`High Risk: ${highRisk.length}`}
          />
          <div
            style={{ width: `${myStudents.length ? (criticalRisk.length / myStudents.length) * 100 : 0}%` }}
            className="h-full bg-red-500 transition-all"
            title={`Critical Risk: ${criticalRisk.length}`}
          />
        </div>
      </div>

      {/* ATTENTION REQUIRED SECTION (High/Critical students needing immediate action) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">Attention Required (Immediate Intervention Queue)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Priority mentees flagged by low attendance (&lt;75%), active backlogs, or critical dropout probability.
            </p>
          </div>

          <button
            onClick={() => navigate('/faculty/students')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>View All {myStudents.length} Mentees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attentionRequiredStudents.slice(0, 6).map((st) => {
            const studentInterventions = interventions.filter(i => i.studentId === st.id);
            const lastIntervention = studentInterventions[0];
            const primaryFactor = st.contributingFactors?.[0]?.factor ||
              (st.attendance < 75 ? `Attendance below 75% (${st.attendance}%)` :
               st.backlogs > 0 ? `${st.backlogs} Active Backlog(s)` :
               'Continuous Assessment Deficit');
            const recommendedAction = st.recommendations?.[0]?.title ||
              (st.attendance < 75 ? 'Attendance Improvement Contract' :
               st.backlogs > 0 ? 'Remedial Tutorial Assignment' :
               'Academic Counseling Session');

            return (
              <div
                key={st.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={st.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm hover:text-indigo-300 cursor-pointer" onClick={() => setSelectedStudent(st)}>
                          {st.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">{st.id} • Sem {st.semester}</p>
                      </div>
                    </div>
                    <RiskBadge risk={st.riskLevel} size="sm" />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Dropout Probability:</span>
                      <span className="font-bold text-red-400">{st.dropoutProbability}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Attendance:</span>
                      <span className={`font-semibold ${st.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {st.attendance}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Active Backlogs:</span>
                      <span className={`font-semibold ${st.backlogs > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                        {st.backlogs} {st.backlogs === 1 ? 'Paper' : 'Papers'}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Primary Risk Factor:</span>
                      <p className="text-slate-300 text-[11px] font-medium truncate mt-0.5" title={primaryFactor}>
                        ⚠️ {primaryFactor}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Recommended Action:</span>
                      <p className="text-indigo-300 text-[11px] font-medium truncate mt-0.5" title={recommendedAction}>
                        🎯 {recommendedAction}
                      </p>
                    </div>

                    <div className="pt-1 text-[10px] text-slate-400 flex justify-between">
                      <span>Last Intervention:</span>
                      <span className="font-medium text-slate-300">
                        {lastIntervention ? `${lastIntervention.date} (${lastIntervention.type})` : 'None logged yet'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setSelectedStudent(st)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Student</span>
                  </button>
                  <button
                    onClick={() => setInterventionStudent(st)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1 shadow-md shadow-indigo-600/20"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Start Intervention</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Section: Trends & Alerts & Upcoming Counseling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cohort Academic Performance & Trend Diagnostics */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Cohort Attendance & Performance Trend Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Weekly cohort trajectory versus institutional accreditation thresholds</p>
            </div>
            <button
              onClick={() => navigate('/faculty/reports')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Attendance Trend Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Cohort Attendance Status</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +2.4% vs last week
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">{avgAttendance}%</span>
                <span className="text-xs text-slate-400">mean average</span>
              </div>
              <ProgressBar value={avgAttendance} max={100} target={75} showPercentage={false} color="gradient" />
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>75% Minimum Cutoff</span>
                <span className={attendanceDefaulters.length > 0 ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
                  {attendanceDefaulters.length} Defaulters Flagged
                </span>
              </div>
            </div>

            {/* Academic Score Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Average Cumulative CGPA</span>
                <span className="text-xs text-blue-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +0.15 index
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">{avgCGPA}</span>
                <span className="text-xs text-slate-400">scale of 10.0</span>
              </div>
              <ProgressBar value={Number(avgCGPA) * 10} max={100} target={65} showPercentage={false} color="blue" />
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>6.5 First Class Threshold</span>
                <span className="text-slate-300">{myStudents.filter(s => s.cgpa >= 7.5).length} Distinctions</span>
              </div>
            </div>
          </div>

          {/* Recent System & Academic Alerts */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Academic Notifications & System Signals</span>
            </h4>
            <div className="space-y-2">
              {recentAlerts.map(alt => (
                <div
                  key={alt.id}
                  onClick={alt.action}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      alt.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                      alt.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{alt.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{alt.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block">{alt.time}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 inline-block mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Counseling & Interventions Schedule */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Counseling Schedule</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                {upcomingSessions.length} Pending
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {upcomingSessions.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center text-xs text-slate-400 space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-white">No Pending Sessions</p>
                  <p className="text-[11px]">All scheduled counseling milestones are up to date.</p>
                </div>
              ) : (
                upcomingSessions.slice(0, 4).map((session) => (
                  <div key={session.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white hover:text-indigo-300 cursor-pointer" onClick={() => {
                        const target = students.find(s => s.id === session.studentId);
                        if (target) setSelectedStudent(target);
                      }}>
                        {session.studentName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" /> {session.followUpDate || session.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-medium">{session.type}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {session.status}
                      </span>
                    </div>
                    {session.actionPlan && (
                      <p className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed">
                        {session.actionPlan}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => navigate('/faculty/interventions')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all text-center flex items-center justify-center space-x-1.5"
            >
              <span>Manage All Interventions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
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
