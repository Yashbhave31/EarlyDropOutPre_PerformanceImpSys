import React, { useState, useMemo } from 'react';
import {
  Mail, Phone, MapPin, Users, AlertTriangle,
  HeartHandshake, Eye, ShieldAlert, ChevronDown, ChevronRight,
  UserX, UserPlus
} from 'lucide-react';
import { useStudentData } from '../../context/StudentDataContext';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import RiskBadge from '../../components/common/RiskBadge';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';

export default function FacultyRoster() {
  const { faculty, students, interventions, updateStudent, logIntervention } = useStudentData();

  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'relationship'
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('HIGH_RISK_DESC');
  const [expandedFacultyId, setExpandedFacultyId] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [assigningStudent, setAssigningStudent] = useState(null);
  const [selectedNewMentorId, setSelectedNewMentorId] = useState('');

  // Enrich faculty with live mentee data and intervention counts
  const enrichedFaculty = useMemo(() => {
    return faculty.map(f => {
      const assignedStudents = students.filter(s => s.mentorId === f.id || s.mentorName === f.name);
      const studentCount = assignedStudents.length > 0 ? assignedStudents.length : f.assignedStudentsCount;

      const highRiskCount = assignedStudents.filter(s => s.riskLevel === 'HIGH').length || f.highRiskCount;
      const criticalRiskCount = assignedStudents.filter(s => s.riskLevel === 'CRITICAL' || (s.dropoutProbability && s.dropoutProbability > 80)).length;
      
      const facultyInterventions = interventions.filter(i => i.facultyId === f.id || i.facultyName === f.name);
      const activeCounselingCount = facultyInterventions.filter(i => i.status === 'In Progress' || i.status === 'Scheduled').length;
      const totalInterventions = facultyInterventions.length;

      return {
        ...f,
        assignedStudents,
        studentCount,
        highRiskCount,
        criticalRiskCount,
        combinedAtRisk: highRiskCount + criticalRiskCount,
        activeCounselingCount,
        totalInterventions
      };
    });
  }, [faculty, students, interventions]);

  // Filter and sort faculty
  const filteredFaculty = useMemo(() => {
    let list = enrichedFaculty.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                            f.id.toLowerCase().includes(search.toLowerCase()) ||
                            f.department.toLowerCase().includes(search.toLowerCase()) ||
                            f.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'ALL' || f.department === deptFilter;
      return matchesSearch && matchesDept;
    });

    list.sort((a, b) => {
      if (sortBy === 'HIGH_RISK_DESC') return b.combinedAtRisk - a.combinedAtRisk;
      if (sortBy === 'STUDENTS_DESC') return b.studentCount - a.studentCount;
      if (sortBy === 'INTERVENTIONS_DESC') return b.totalInterventions - a.totalInterventions;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [enrichedFaculty, search, deptFilter, sortBy]);

  // Identify monitoring alert groups
  const unassignedStudents = useMemo(() => {
    return students.filter(s => !s.mentorId || s.mentorId === 'UNASSIGNED' || !s.mentorName);
  }, [students]);

  const highRiskWithoutIntervention = useMemo(() => {
    return students.filter(s => {
      const isAtRisk = s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL' || (s.dropoutProbability && s.dropoutProbability > 65);
      if (!isAtRisk) return false;
      const studentInts = interventions.filter(i => i.studentId === s.id);
      return studentInts.length === 0;
    });
  }, [students, interventions]);

  const criticalRiskStudents = useMemo(() => {
    return students.filter(s => s.riskLevel === 'CRITICAL' || (s.dropoutProbability && s.dropoutProbability >= 80));
  }, [students]);

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    if (!assigningStudent || !selectedNewMentorId) return;

    const chosenFaculty = faculty.find(f => f.id === selectedNewMentorId);
    if (!chosenFaculty) return;

    const updated = {
      ...assigningStudent,
      mentorId: chosenFaculty.id,
      mentorName: chosenFaculty.name
    };

    await updateStudent(updated);
    setAssigningStudent(null);
    setSelectedNewMentorId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Faculty & Mentorship Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Faculty counseling advisors, student mentee allocation, at-risk caseload distribution, and early-warning intervention monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Faculty Roster & Caseload
            </button>
            <button
              onClick={() => setActiveTab('relationship')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'relationship'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Mentorship Monitoring</span>
              {(unassignedStudents.length > 0 || highRiskWithoutIntervention.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RELATIONSHIP & MONITORING TAB */}
      {activeTab === 'relationship' && (
        <div className="space-y-6">
          {/* Institutional Mentorship Surveillance Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unassigned Students</span>
                <p className="text-xl font-extrabold text-white mt-0.5">{unassignedStudents.length}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Need mentor allocation</p>
              </div>
              <div className={`p-3 rounded-xl border ${unassignedStudents.length > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800/60 text-slate-400 border-slate-700'}`}>
                <UserX className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">At-Risk Without Action</span>
                <p className="text-xl font-extrabold text-orange-400 mt-0.5">{highRiskWithoutIntervention.length}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">High/Critical risk with 0 logs</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Critical Risk Pipeline</span>
                <p className="text-xl font-extrabold text-red-400 mt-0.5">{criticalRiskStudents.length}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">&gt; 80% dropout probability</p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action Required Callouts */}
          {(unassignedStudents.length > 0 || highRiskWithoutIntervention.length > 0) && (
            <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-sm font-bold text-white">Action Required: Mentorship Coverage Gap Detected</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Institutional protocol mandates that every enrolled student must have an assigned faculty counselor, and every student crossing 65% dropout risk must have a logged academic recovery plan within 7 days.
              </p>

              {unassignedStudents.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-amber-300 block mb-2">Unassigned Students Requiring Immediate Allocation:</span>
                  <div className="flex flex-wrap gap-2">
                    {unassignedStudents.map(st => (
                      <div key={st.id} className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{st.name} ({st.id})</span>
                        <RiskBadge risk={st.riskLevel} size="xs" />
                        <button
                          onClick={() => {
                            setAssigningStudent(st);
                            setSelectedNewMentorId(faculty[0]?.id || '');
                          }}
                          className="px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                        >
                          Assign Mentor
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Faculty ↓ Assigned Students ↓ Risk Distribution ↓ Interventions Hierarchy Tree */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Faculty Mentorship Allocation Hierarchy</h3>
                <p className="text-xs text-slate-400">Click any faculty member to inspect assigned student mentees, individual risk vectors, and active interventions.</p>
              </div>
            </div>

            <div className="space-y-3">
              {enrichedFaculty.map((f) => {
                const isExpanded = expandedFacultyId === f.id;

                return (
                  <div key={f.id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all">
                    {/* Faculty Summary Header */}
                    <div
                      onClick={() => setExpandedFacultyId(isExpanded ? null : f.id)}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <button className="text-slate-400 hover:text-white p-1">
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-indigo-400" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{f.name}</h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                              {f.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{f.designation} • {f.department}</p>
                        </div>
                      </div>

                      {/* Right side metrics */}
                      <div className="flex items-center space-x-6 text-xs pl-8 md:pl-0">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mentees</span>
                          <span className="font-bold text-white">{f.studentCount} Students</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">At-Risk</span>
                          <span className={`font-bold ${f.combinedAtRisk > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {f.combinedAtRisk} Students
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Sessions</span>
                          <span className="font-bold text-indigo-400">{f.activeCounselingCount} Sessions</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Mentee List */}
                    {isExpanded && (
                      <div className="border-t border-slate-800/80 bg-slate-950/50 p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">Assigned Student Cohort ({f.assignedStudents.length} Students):</span>
                          <span>Click student row to view diagnostic profile</span>
                        </div>

                        {f.assignedStudents.length === 0 ? (
                          <p className="text-xs text-slate-500 py-3 text-center">No students currently linked to this mentor.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                                  <th className="pb-2 px-3">Student</th>
                                  <th className="pb-2 px-3">Attendance</th>
                                  <th className="pb-2 px-3">Academics</th>
                                  <th className="pb-2 px-3">Risk Level</th>
                                  <th className="pb-2 px-3">Dropout Prob.</th>
                                  <th className="pb-2 px-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/50">
                                {f.assignedStudents.map((st) => (
                                  <tr
                                    key={st.id}
                                    onClick={() => setSelectedStudent(st)}
                                    className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                                  >
                                    <td className="py-2.5 px-3">
                                      <div className="flex items-center space-x-2">
                                        <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-lg object-cover" />
                                        <div>
                                          <p className="font-bold text-white hover:text-indigo-400">{st.name}</p>
                                          <p className="text-[10px] text-slate-400">{st.id} • Sem {st.semester}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className={`font-semibold ${st.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {st.attendance}%
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-300">
                                      CGPA: {st.cgpa} ({st.backlogs} Backlogs)
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <RiskBadge risk={st.riskLevel} size="xs" />
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-white">
                                      {st.dropoutProbability}%
                                    </td>
                                    <td className="py-2.5 px-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => setSelectedStudent(st)}
                                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                        title="View Profile"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setInterventionStudent(st)}
                                        className="p-1 rounded text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 transition-colors"
                                        title="Log Intervention"
                                      >
                                        <HeartHandshake className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setAssigningStudent(st);
                                          setSelectedNewMentorId(f.id);
                                        }}
                                        className="p-1 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-950 transition-colors"
                                        title="Reassign Mentor"
                                      >
                                        <UserPlus className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FACULTY ROSTER TAB */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Filter and Sorting Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="w-full lg:max-w-md">
              <SearchBar value={search} onChange={setSearch} placeholder="Search faculty name, ID, branch or specialization..." />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <FilterDropdown
                label="Department"
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  { value: 'Information Technology', label: 'Information Technology' },
                  { value: 'Computer Engineering', label: 'Computer Engineering' },
                  { value: 'Artificial Intelligence & Data Science', label: 'AI & Data Science' },
                  { value: 'Electronics & Telecommunication', label: 'EXTC' }
                ]}
              />

              <FilterDropdown
                label="Sort Workload By"
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'HIGH_RISK_DESC', label: 'Most High-Risk Mentees' },
                  { value: 'STUDENTS_DESC', label: 'Highest Mentee Load' },
                  { value: 'INTERVENTIONS_DESC', label: 'Most Interventions' },
                  { value: 'NAME_ASC', label: 'Faculty Name (A-Z)' }
                ]}
              />
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((f) => {
              return (
                <div
                  key={f.id}
                  className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Faculty Profile Top */}
                    <div className="flex items-start space-x-4 mb-3">
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-bold text-white truncate">{f.name}</h3>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {f.id}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5">{f.designation}</p>
                        <p className="text-[11px] text-slate-400">{f.department}</p>
                      </div>
                    </div>

                    {/* Contact & Location Details */}
                    <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{f.office}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{f.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{f.phone}</span>
                      </div>
                    </div>

                    {/* Specialization */}
                    <div className="mt-3">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Research & Specialization</span>
                      <p className="text-xs text-slate-200 mt-0.5">{f.specialization}</p>
                    </div>
                  </div>

                  {/* 4 Caseload Metrics (Assigned, High Risk, Critical, Active Sessions) */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Mentees</span>
                        <span className="text-lg font-bold text-white mt-0.5 block">{f.studentCount}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">High/Critical Risk</span>
                        <span className={`text-lg font-bold mt-0.5 block ${f.combinedAtRisk > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {f.combinedAtRisk}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Interventions</span>
                        <span className="text-base font-bold text-indigo-400 mt-0.5 block">{f.totalInterventions}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Counseling</span>
                        <span className="text-base font-bold text-amber-400 mt-0.5 block">{f.activeCounselingCount}</span>
                      </div>
                    </div>

                    {/* Quick drill-down button */}
                    <button
                      onClick={() => {
                        setActiveTab('relationship');
                        setExpandedFacultyId(f.id);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Inspect {f.studentCount} Mentees</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assign Mentor Modal */}
      {assigningStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Assign Faculty Mentor</h3>
            <p className="text-xs text-slate-400">
              Assign a faculty counseling advisor for student <strong className="text-white">{assigningStudent.name}</strong> ({assigningStudent.id}) in {assigningStudent.department}.
            </p>

            <form onSubmit={handleAssignMentor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Faculty Advisor</label>
                <select
                  value={selectedNewMentorId}
                  onChange={(e) => setSelectedNewMentorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500"
                >
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department} - {f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssigningStudent(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
          onRunPrediction={() => {}}
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
