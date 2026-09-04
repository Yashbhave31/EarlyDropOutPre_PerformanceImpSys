import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, CheckCircle2, TrendingUp, BrainCircuit, ArrowUpRight, Download, FileText } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import RiskBadge from '../../components/common/RiskBadge';
import RiskDoughnutChart from '../../components/charts/RiskDoughnutChart';
import DepartmentRiskChart from '../../components/charts/DepartmentRiskChart';
import TrendLineChart from '../../components/charts/TrendLineChart';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import { useStudentData } from '../../context/StudentDataContext';
import { useNotifications } from '../../context/NotificationContext';
import { exportToCSV } from '../../utils/exportUtils';

export default function AdminDashboard() {
  const { students, departments, calculateStats, logIntervention, faculty } = useStudentData();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  const stats = calculateStats();

  const filteredStudents = useMemo(() => {
    if (selectedDeptFilter === 'ALL') return students;
    return students.filter(s => s.department === selectedDeptFilter);
  }, [students, selectedDeptFilter]);

  const highRiskStudents = filteredStudents.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL');

  const handleExportHighRisk = () => {
    const exportData = highRiskStudents.map(s => ({
      ID: s.id,
      Name: s.name,
      Department: s.department,
      Attendance: `${s.attendance}%`,
      CGPA: s.cgpa,
      Backlogs: s.backlogs,
      RiskLevel: s.riskLevel,
      DropoutProbability: `${s.dropoutProbability}%`,
      FeePending: s.feePending ? 'YES' : 'NO',
      Mentor: s.mentorName
    }));
    exportToCSV('Institutional_High_Risk_Cohort.csv', exportData);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Risk Intelligence Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time dropout predictive telemetry, cohort risk stratification, and faculty intervention tracking across all academic branches.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportHighRisk}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Risk Cohort</span>
          </button>

          <button
            onClick={() => navigate('/admin/predictions')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>ML Simulator</span>
          </button>
        </div>
      </div>

      {/* Department Quick Filter */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 mr-2 font-medium">Scope:</span>
          {['ALL', 'Information Technology', 'Computer Engineering', 'Artificial Intelligence & Data Science', 'Electronics & Telecommunication'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedDeptFilter === dept
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dept === 'ALL' ? 'Institution (All Branches)' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Row (Primary 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students Tracked"
          value={stats.totalStudents}
          subtitle={`Across ${departments?.length || 4} Departments`}
          icon={Users}
          color="blue"
          trend={{ value: "+3.2%", label: "enrolled cohort", positive: true }}
          onClick={() => navigate('/admin/students')}
        />
        <StatCard
          title="Total Faculty Mentors"
          value={stats.totalFaculty || faculty?.length || 5}
          subtitle="Active Academic Counselors"
          icon={CheckCircle2}
          color="indigo"
          trend={{ value: "100%", label: "assigned caseload", positive: true }}
          onClick={() => navigate('/admin/faculty')}
        />
        <StatCard
          title="Avg Classroom Attendance"
          value={`${stats.avgAttendance}%`}
          subtitle="Mandatory Cutoff: 75%"
          icon={TrendingUp}
          color={stats.avgAttendance >= 75 ? "emerald" : "amber"}
          trend={{ value: "+2.4%", label: "institutional avg", positive: true }}
        />
        <StatCard
          title="Institutional Retention"
          value={`${stats.retentionRate}%`}
          subtitle="Target Threshold: 92%"
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: "+0.9%", label: "annual target", positive: true }}
        />
      </div>

      {/* 4-Tier Risk Stratification Strip & Academic KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Low Risk (&lt;35%)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-400">{stats.lowRisk}</span>
            <span className="text-xs text-emerald-400 font-semibold">{stats.lowRiskPercent}%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Stable & Compliant</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Moderate Risk (35-65%)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-amber-400">{stats.moderateRisk}</span>
            <span className="text-xs text-amber-400 font-semibold">{stats.moderateRiskPercent}%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Under Mentoring Watch</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">High Risk (65-80%)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-orange-400">{stats.highRisk}</span>
            <span className="text-xs text-orange-400 font-semibold">{stats.highRiskPercent}%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Action Contract Required</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Critical Risk (&gt;80%)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-red-400">{stats.criticalRisk}</span>
            <span className="text-xs text-red-400 font-semibold">{stats.criticalRiskPercent}%</span>
          </div>
          <span className="text-[10px] text-red-400 mt-1">Immediate Escalation</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Academic Averages</span>
          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="text-lg font-bold text-white">{stats.avgCgpa}</span>
              <span className="text-[10px] text-slate-400 ml-1">CGPA</span>
            </div>
            <div>
              <span className="text-lg font-bold text-indigo-400">{stats.avgRiskScore}%</span>
              <span className="text-[10px] text-slate-400 ml-1">Avg Risk</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Performance Index</span>
        </div>
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Department-Wise Risk Breakdown</h3>
              <p className="text-xs text-slate-400">Risk stratification comparison across academic branches</p>
            </div>
            <button
              onClick={() => navigate('/admin/departments')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <DepartmentRiskChart departments={departments} />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Risk Cohort Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Institution-wide student segmentation</p>
            <RiskDoughnutChart stats={stats} />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Critical Attention Required:</span>
            <span className="font-bold text-red-400">{stats.highRisk} Students</span>
          </div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Academic Term Risk & Retention Trajectory</h3>
            <p className="text-xs text-slate-400">Historical performance trend over past semesters</p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +4.2% Retention Gain
          </span>
        </div>
        <TrendLineChart />
      </div>

      {/* High-Risk Action Table & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At Risk Students Table */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top At-Risk Students Requiring Intervention</h3>
              <p className="text-xs text-slate-400">Triggered by attendance drops, multiple backlogs, and fee arrears</p>
            </div>
            <button
              onClick={() => navigate('/admin/students')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View all students</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Attendance</th>
                  <th className="pb-3">Backlogs</th>
                  <th className="pb-3">Risk Level</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {highRiskStudents.slice(0, 5).map((student) => (
                  <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-[10px] text-slate-400">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{student.department}</td>
                    <td className="py-3">
                      <span className={`font-semibold ${student.attendance < 65 ? 'text-red-400' : 'text-amber-400'}`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-red-400">{student.backlogs} Papers</span>
                    </td>
                    <td className="py-3">
                      <RiskBadge risk={student.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setInterventionStudent(student)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live System Alerts Feed */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Real-Time Risk Alerts</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{notif.title}</span>
                    <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/reports')}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Full Compliance Reports</span>
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
          onRunPrediction={() => navigate('/admin/predictions')}
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
