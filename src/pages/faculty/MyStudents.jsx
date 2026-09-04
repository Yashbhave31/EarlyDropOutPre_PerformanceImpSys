import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, HeartHandshake, Eye, Download, BrainCircuit, Sliders,
  LayoutGrid, Table as TableIcon, Filter, ArrowUpDown, AlertTriangle,
  Users, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { exportToCSV } from '../../utils/exportUtils';

export default function MyStudents() {
  const { user } = useAuth();
  const { students, interventions, logIntervention } = useStudentData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRiskParam = searchParams.get('risk') || 'ALL';
  const initialFilterParam = searchParams.get('filter') || 'ALL';

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState(initialRiskParam);
  const [attendanceFilter, setAttendanceFilter] = useState(initialFilterParam === 'defaulters' ? 'DEFAULTER' : 'ALL');
  const [sortBy, setSortBy] = useState('RISK_DESC');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);

  // Mentees of this faculty or department
  const myStudents = useMemo(() => {
    return students.filter(s =>
      s.mentorId === user?.id ||
      s.mentorName?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
      s.department === (user?.department || 'Information Technology')
    );
  }, [students, user]);

  // Filter & Sort Logic
  const filteredAndSortedMentees = useMemo(() => {
    return myStudents
      .filter(s => {
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase()) ||
          (s.rollNo && s.rollNo.toLowerCase().includes(search.toLowerCase()));

        const matchesRisk =
          riskFilter === 'ALL' ||
          s.riskLevel === riskFilter ||
          (riskFilter === 'HIGH' && (s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL'));

        const matchesAttendance =
          attendanceFilter === 'ALL' ||
          (attendanceFilter === 'DEFAULTER' && s.attendance < 75) ||
          (attendanceFilter === 'REGULAR' && s.attendance >= 75);

        return matchesSearch && matchesRisk && matchesAttendance;
      })
      .sort((a, b) => {
        if (sortBy === 'RISK_DESC') return (b.dropoutProbability || 0) - (a.dropoutProbability || 0);
        if (sortBy === 'RISK_ASC') return (a.dropoutProbability || 0) - (b.dropoutProbability || 0);
        if (sortBy === 'ATTENDANCE_ASC') return (a.attendance || 0) - (b.attendance || 0);
        if (sortBy === 'ATTENDANCE_DESC') return (b.attendance || 0) - (a.attendance || 0);
        if (sortBy === 'CGPA_DESC') return (b.cgpa || 0) - (a.cgpa || 0);
        if (sortBy === 'CGPA_ASC') return (a.cgpa || 0) - (b.cgpa || 0);
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [myStudents, search, riskFilter, attendanceFilter, sortBy]);

  const handleExport = () => {
    const data = filteredAndSortedMentees.map(s => {
      const studentIntervention = interventions.find(i => i.studentId === s.id);
      return {
        StudentID: s.id,
        Name: s.name,
        Department: s.department,
        Semester: s.semester,
        Attendance: `${s.attendance}%`,
        InternalMarks: s.internalMarks,
        Backlogs: s.backlogs,
        CGPA: s.cgpa,
        DropoutProbability: `${s.dropoutProbability}%`,
        RiskClassification: s.riskLevel,
        FeePending: s.feePending ? 'YES' : 'NO',
        LastIntervention: studentIntervention ? `${studentIntervention.date} (${studentIntervention.type})` : 'None'
      };
    });
    exportToCSV(`Mentee_Cohort_Roster_${user?.name?.replace(/\s+/g, '_') || 'Faculty'}.csv`, data);
  };

  const highCriticalCount = myStudents.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;
  const defaulterCount = myStudents.filter(s => s.attendance < 75).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Department of {user?.department || 'Information Technology'}
            </span>
            <span className="text-xs text-slate-400">Total {myStudents.length} Assigned Mentees</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            My Students (Mentee Directory)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor academic trajectories, trigger interventions, and update continuous evaluation metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={() => navigate('/faculty/data-collection')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Update Intake Data</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster CSV</span>
          </button>
        </div>
      </div>

      {/* Cohort Quick Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Assigned Cohort</span>
          <p className="text-lg font-bold text-white mt-0.5">{myStudents.length} Mentees</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">High / Critical Risk</span>
          <p className="text-lg font-bold text-red-400 mt-0.5">{highCriticalCount} Students</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Attendance Defaulters</span>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{defaulterCount} (&lt;75%)</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Active Interventions</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">
            {interventions.filter(i => myStudents.some(s => s.id === i.studentId)).length} Sessions
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sort & View Mode */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input (5 Cols) */}
          <div className="md:col-span-5">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by student name, roll number, or ID..."
            />
          </div>

          {/* Risk Filter (2 Cols) */}
          <div className="md:col-span-2">
            <FilterDropdown
              label="Risk Filter"
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                { value: 'ALL', label: 'All Risk Levels' },
                { value: 'CRITICAL', label: 'Critical Risk (≥75%)' },
                { value: 'HIGH', label: 'High Risk (60-74%)' },
                { value: 'MODERATE', label: 'Moderate Risk (35-59%)' },
                { value: 'LOW', label: 'Low Risk (<35%)' }
              ]}
            />
          </div>

          {/* Attendance Filter (2 Cols) */}
          <div className="md:col-span-2">
            <FilterDropdown
              label="Attendance Status"
              value={attendanceFilter}
              onChange={setAttendanceFilter}
              options={[
                { value: 'ALL', label: 'All Attendance' },
                { value: 'DEFAULTER', label: 'Defaulters (<75%)' },
                { value: 'REGULAR', label: 'Regular (≥75%)' }
              ]}
            />
          </div>

          {/* Sort By (2 Cols) */}
          <div className="md:col-span-2">
            <FilterDropdown
              label="Sort By"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'RISK_DESC', label: 'Highest Risk' },
                { value: 'RISK_ASC', label: 'Lowest Risk' },
                { value: 'ATTENDANCE_ASC', label: 'Lowest Attendance' },
                { value: 'ATTENDANCE_DESC', label: 'Highest Attendance' },
                { value: 'CGPA_DESC', label: 'Highest CGPA' },
                { value: 'CGPA_ASC', label: 'Lowest CGPA' },
                { value: 'NAME_ASC', label: 'Name (A-Z)' }
              ]}
            />
          </div>

          {/* View Toggle (1 Col) */}
          <div className="md:col-span-1 flex items-center justify-end space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Badges & Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span>Showing <strong className="text-white">{filteredAndSortedMentees.length}</strong> of {myStudents.length} mentees</span>
          {(riskFilter !== 'ALL' || attendanceFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setRiskFilter('ALL');
                setAttendanceFilter('ALL');
                setSearch('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Mentees Grid View */}
      {viewMode === 'grid' ? (
        filteredAndSortedMentees.length === 0 ? (
          <div className="p-12 glass-card rounded-2xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-sm">No Mentees Match Your Filter</p>
            <p>Try clearing search keywords or expanding your risk criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedMentees.map((st) => {
              const studentIntervention = interventions.find(i => i.studentId === st.id);

              return (
                <div
                  key={st.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={st.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <h3
                            onClick={() => setSelectedStudent(st)}
                            className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors"
                          >
                            {st.name}
                          </h3>
                          <p className="text-[11px] text-slate-400">{st.id} • Sem {st.semester}</p>
                        </div>
                      </div>
                      <RiskBadge risk={st.riskLevel} size="sm" />
                    </div>

                    {/* Attendance Bar */}
                    <div className="space-y-1 py-2.5 border-t border-slate-800/80 mt-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class Attendance:</span>
                        <span className={`font-bold ${st.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {st.attendance}%
                        </span>
                      </div>
                      <ProgressBar value={st.attendance} max={100} target={75} showPercentage={false} color="gradient" />
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-800/80 text-center">
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 text-[10px] block">Internal</span>
                        <span className="font-bold text-white">{st.internalMarks}/100</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 text-[10px] block">Backlogs</span>
                        <span className={`font-bold ${st.backlogs > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                          {st.backlogs} ATKT
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-900/60">
                        <span className="text-slate-400 text-[10px] block">Risk Score</span>
                        <span className={`font-bold ${
                          st.dropoutProbability >= 60 ? 'text-red-400' :
                          st.dropoutProbability >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {st.dropoutProbability}%
                        </span>
                      </div>
                    </div>

                    {/* Last Intervention */}
                    <div className="pt-2 text-[11px] flex items-center justify-between text-slate-400">
                      <span>Last Intervention:</span>
                      <span className="text-slate-300 font-medium truncate max-w-[140px]" title={studentIntervention?.type || 'None'}>
                        {studentIntervention ? `${studentIntervention.date} (${studentIntervention.type})` : 'None logged'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedStudent(st)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => navigate(`/faculty/data-collection?studentId=${st.id}`)}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      title="Update Marks & Attendance"
                    >
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => setInterventionStudent(st)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Intervene</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Mentees Table View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Student & ID</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Internal Marks</th>
                  <th className="py-3 px-4">Backlogs</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Last Intervention</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAndSortedMentees.map((st) => {
                  const studentIntervention = interventions.find(i => i.studentId === st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={st.name}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <p
                              onClick={() => setSelectedStudent(st)}
                              className="font-bold text-white hover:text-indigo-300 cursor-pointer"
                            >
                              {st.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{st.id} • Sem {st.semester}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-semibold ${st.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {st.attendance}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {st.attendance < 75 ? 'Defaulter' : 'Normal'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-white">
                        {st.internalMarks} / 100
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-semibold ${st.backlogs > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                          {st.backlogs} {st.backlogs === 1 ? 'Paper' : 'Papers'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <RiskBadge risk={st.riskLevel} size="sm" />
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-bold ${
                          st.dropoutProbability >= 60 ? 'text-red-400' :
                          st.dropoutProbability >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {st.dropoutProbability}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {studentIntervention ? (
                          <div>
                            <span className="text-slate-300 font-medium block">{studentIntervention.date}</span>
                            <span className="text-[10px] text-slate-500">{studentIntervention.type}</span>
                          </div>
                        ) : (
                          'None logged'
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedStudent(st)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => navigate(`/faculty/data-collection?studentId=${st.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-400 transition-colors"
                          title="Update Academic Data"
                        >
                          Data
                        </button>
                        <button
                          onClick={() => setInterventionStudent(st)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                        >
                          Counsel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
