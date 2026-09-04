import React, { useState, useMemo } from 'react';
import { Plus, Download, Filter, Eye, BrainCircuit, HeartHandshake, UserX, CheckCircle } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import RiskBadge from '../../components/common/RiskBadge';
import ProgressBar from '../../components/common/ProgressBar';
import StudentProfileModal from '../shared/StudentProfileModal';
import InterventionModal from '../../components/interventions/InterventionModal';
import Modal from '../../components/common/Modal';
import { useStudentData } from '../../context/StudentDataContext';
import { exportToCSV } from '../../utils/exportUtils';
import { calculateStudentRisk } from '../../utils/riskCalculator';

export default function StudentDirectory() {
  const { students, addStudent, updateStudent, runPrediction, logIntervention } = useStudentData();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [attendanceRange, setAttendanceRange] = useState('ALL');
  const [feeFilter, setFeeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RISK_DESC');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    id: `TYIT${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    email: '',
    phone: '',
    department: 'Information Technology',
    semester: 5,
    academicYear: '2025-2026',
    attendance: 75,
    internalMarks: 65,
    unitTestMarks: 60,
    assignmentScore: 70,
    practicalScore: 75,
    backlogs: 0,
    cgpa: 7.0,
    feePending: false,
    distanceKm: 12,
    transportMode: 'Local Train'
  });

  const filteredStudents = useMemo(() => {
    let result = students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                            s.id.toLowerCase().includes(search.toLowerCase()) ||
                            s.department.toLowerCase().includes(search.toLowerCase()) ||
                            (s.mentorName && s.mentorName.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
      const matchesSemester = semesterFilter === 'ALL' || String(s.semester) === String(semesterFilter);
      
      let matchesRisk = true;
      if (riskFilter === 'CRITICAL') matchesRisk = s.riskLevel === 'CRITICAL' || s.dropoutProbability > 80;
      else if (riskFilter === 'HIGH') matchesRisk = s.riskLevel === 'HIGH';
      else if (riskFilter === 'MEDIUM' || riskFilter === 'MODERATE') matchesRisk = s.riskLevel === 'MEDIUM' || s.riskLevel === 'MODERATE';
      else if (riskFilter === 'LOW') matchesRisk = s.riskLevel === 'LOW';

      let matchesAttendance = true;
      if (attendanceRange === 'CRITICAL') matchesAttendance = s.attendance < 65;
      else if (attendanceRange === 'WARNING') matchesAttendance = s.attendance >= 65 && s.attendance < 75;
      else if (attendanceRange === 'COMPLIANT') matchesAttendance = s.attendance >= 75;

      const matchesFee = feeFilter === 'ALL' ||
                         (feeFilter === 'PENDING' && s.feePending) ||
                         (feeFilter === 'PAID' && !s.feePending);

      return matchesSearch && matchesDept && matchesSemester && matchesRisk && matchesAttendance && matchesFee;
    });

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'RISK_DESC') return (b.dropoutProbability || 0) - (a.dropoutProbability || 0);
      if (sortBy === 'ATTENDANCE_ASC') return (a.attendance || 0) - (b.attendance || 0);
      if (sortBy === 'CGPA_DESC') return (Number(b.cgpa) || 0) - (Number(a.cgpa) || 0);
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'ROLL_ASC') return a.id.localeCompare(b.id);
      return 0;
    });

    return result;
  }, [students, search, deptFilter, semesterFilter, riskFilter, attendanceRange, feeFilter, sortBy]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const mlResult = calculateStudentRisk(newStudent);
    const completeStudent = {
      ...newStudent,
      dropoutProbability: mlResult.dropoutProbability,
      riskLevel: mlResult.riskLevel,
      contributingFactors: mlResult.contributingFactors,
      predictionDate: mlResult.predictionDate,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      subjects: [
        { code: "IT501", name: "Software Engineering", internal: newStudent.internalMarks, unitTest: newStudent.unitTestMarks, practical: newStudent.practicalScore, attendance: newStudent.attendance, status: "Passing" }
      ]
    };
    await addStudent(completeStudent);
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const exportData = filteredStudents.map(s => ({
      ID: s.id,
      Name: s.name,
      Department: s.department,
      Attendance: `${s.attendance}%`,
      InternalMarks: s.internalMarks,
      Backlogs: s.backlogs,
      CGPA: s.cgpa,
      RiskLevel: s.riskLevel,
      DropoutProbability: `${s.dropoutProbability}%`,
      FeePending: s.feePending ? 'YES' : 'NO'
    }));
    exportToCSV('Student_Master_Directory.csv', exportData);
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Academic Master Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-department roster with live risk scoring, attendance monitoring, and interventions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by student name, ID or department..." />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            label="Semester"
            value={semesterFilter}
            onChange={setSemesterFilter}
            options={[
              { value: 'ALL', label: 'All Semesters' },
              { value: '3', label: 'Semester 3 (SY)' },
              { value: '4', label: 'Semester 4 (SY)' },
              { value: '5', label: 'Semester 5 (TY)' },
              { value: '6', label: 'Semester 6 (TY)' }
            ]}
          />

          <FilterDropdown
            label="Risk Level"
            value={riskFilter}
            onChange={setRiskFilter}
            options={[
              { value: 'ALL', label: 'All Risk Tiers' },
              { value: 'CRITICAL', label: 'Critical Risk (>80%)' },
              { value: 'HIGH', label: 'High Risk (65-80%)' },
              { value: 'MEDIUM', label: 'Moderate Risk (35-65%)' },
              { value: 'LOW', label: 'Low Risk (<35%)' }
            ]}
          />

          <FilterDropdown
            label="Attendance"
            value={attendanceRange}
            onChange={setAttendanceRange}
            options={[
              { value: 'ALL', label: 'All Attendance' },
              { value: 'CRITICAL', label: 'Critical (<65%)' },
              { value: 'WARNING', label: 'Deficit (65-75%)' },
              { value: 'COMPLIANT', label: 'Compliant (≥75%)' }
            ]}
          />

          <FilterDropdown
            label="Fee Status"
            value={feeFilter}
            onChange={setFeeFilter}
            options={[
              { value: 'ALL', label: 'All Fee States' },
              { value: 'PENDING', label: 'Fee Dues Pending' },
              { value: 'PAID', label: 'All Fees Cleared' }
            ]}
          />

          <FilterDropdown
            label="Sort By"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'RISK_DESC', label: 'Highest Risk First' },
              { value: 'ATTENDANCE_ASC', label: 'Lowest Attendance' },
              { value: 'CGPA_DESC', label: 'Highest CGPA' },
              { value: 'NAME_ASC', label: 'Student Name (A-Z)' },
              { value: 'ROLL_ASC', label: 'Roll No / ID' }
            ]}
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredStudents.length}</strong> of {students.length} students</span>
          <span>Click any student row to view diagnostic profile</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Student & ID</th>
                <th className="py-3.5 px-4">Department & Sem</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Academics</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4">ML Risk Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white hover:text-indigo-400 transition-colors">{student.name}</p>
                        <p className="text-[11px] text-slate-400">{student.id} • {student.gender}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-slate-200 font-medium">{student.department}</p>
                    <p className="text-[10px] text-slate-400">Semester {student.semester}</p>
                  </td>

                  <td className="py-3.5 px-4 min-w-[130px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${student.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {student.attendance}%
                      </span>
                      <span className="text-[10px] text-slate-500">Min 75%</span>
                    </div>
                    <ProgressBar value={student.attendance} max={100} target={75} showPercentage={false} color="gradient" />
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">CGPA: {student.cgpa} / 10</p>
                    <p className={`text-[10px] font-medium ${student.backlogs > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                      {student.backlogs === 0 ? '0 Backlogs' : `${student.backlogs} Active Backlog(s)`}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    {student.feePending ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Paid
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <RiskBadge risk={student.riskLevel} size="sm" />
                      <span className="font-bold text-white">{student.dropoutProbability}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="View Student Diagnostic Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        await runPrediction(student.id);
                      }}
                      className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 transition-colors"
                      title="Run Real-time AI Prediction"
                    >
                      <BrainCircuit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setInterventionStudent(student)}
                      className="p-1.5 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-950 transition-colors"
                      title="Log Mentorship Intervention"
                    >
                      <HeartHandshake className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
          onRunPrediction={(st) => runPrediction(st.id)}
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

      {/* Add Student Record Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student to Academic Roster"
        subtitle="Entering metrics will automatically execute the ML inference pipeline"
        size="lg"
      >
        <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Student Name</label>
              <input
                type="text"
                required
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="e.g. Tanmay Deshpande"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Student Roll / ID</label>
              <input
                type="text"
                required
                value={newStudent.id}
                onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <select
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Electronics & Telecommunication">EXTC</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="student@edurisk.edu"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Attendance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.attendance}
                onChange={(e) => setNewStudent({ ...newStudent, attendance: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Internal Marks (/100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.internalMarks}
                onChange={(e) => setNewStudent({ ...newStudent, internalMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="10"
                value={newStudent.backlogs}
                onChange={(e) => setNewStudent({ ...newStudent, backlogs: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={newStudent.cgpa}
                onChange={(e) => setNewStudent({ ...newStudent, cgpa: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-2 pt-3">
              <input
                type="checkbox"
                id="feePending"
                checked={newStudent.feePending}
                onChange={(e) => setNewStudent({ ...newStudent, feePending: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
              />
              <label htmlFor="feePending" className="text-slate-300 font-medium">
                Tuition Fee Arrears Pending
              </label>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Commute Distance (km)</label>
              <input
                type="number"
                value={newStudent.distanceKm}
                onChange={(e) => setNewStudent({ ...newStudent, distanceKm: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
            >
              Save & Score with ML
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
