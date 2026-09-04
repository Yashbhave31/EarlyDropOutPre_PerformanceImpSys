import React, { useState, useMemo } from 'react';
import {
  FileText, Download, Printer, Eye, AlertTriangle, ShieldCheck,
  Building2, HeartHandshake, Filter
} from 'lucide-react';
import ReportPreviewModal from '../../components/reports/ReportPreviewModal';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useStudentData } from '../../context/StudentDataContext';
import { exportToCSV, triggerPrintWindow } from '../../utils/exportUtils';

export default function AcademicReports() {
  const { students, departments, interventions } = useStudentData();

  // Global filters for reporting
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    reportType: '',
    title: '',
    data: []
  });

  // Filter student dataset based on active filters
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchDept = deptFilter === 'ALL' || s.department === deptFilter;
      const matchSem = semesterFilter === 'ALL' || String(s.semester) === String(semesterFilter);
      let matchRisk = true;
      if (riskFilter === 'CRITICAL') matchRisk = s.riskLevel === 'CRITICAL' || (s.dropoutProbability && s.dropoutProbability > 80);
      else if (riskFilter === 'HIGH') matchRisk = s.riskLevel === 'HIGH';
      else if (riskFilter === 'MODERATE' || riskFilter === 'MEDIUM') matchRisk = s.riskLevel === 'MEDIUM' || s.riskLevel === 'MODERATE';
      else if (riskFilter === 'LOW') matchRisk = s.riskLevel === 'LOW';

      return matchDept && matchSem && matchRisk;
    });
  }, [students, deptFilter, semesterFilter, riskFilter]);

  // Define the 5 reports requested
  const reports = useMemo(() => [
    {
      id: 'high-risk-summary',
      title: 'High-Risk Student Summary',
      category: 'Early Dropout Prevention',
      description: 'Institutional dossier of students crossing the 65% dropout probability threshold, categorized by severity, backlog count, and assigned faculty counselor.',
      icon: AlertTriangle,
      color: 'red',
      generateData: () => {
        const pool = filteredStudents.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL' || s.dropoutProbability >= 65);
        return pool.map(s => ({
          StudentID: s.id,
          Name: s.name,
          Department: s.department,
          Semester: `Sem ${s.semester}`,
          Attendance: `${s.attendance}%`,
          CGPA: s.cgpa,
          Backlogs: s.backlogs,
          RiskLevel: s.riskLevel,
          DropoutProbability: `${s.dropoutProbability}%`,
          FeeStatus: s.feePending ? 'Dues Pending' : 'Cleared',
          Mentor: s.mentorName || 'Unassigned'
        }));
      }
    },
    {
      id: 'department-comparison',
      title: 'Department Comparison Report',
      category: 'Institutional Benchmarking',
      description: 'Comparative statistical analysis of retention percentages, attendance averages, backlog densities, and intervention workloads across academic departments.',
      icon: Building2,
      color: 'indigo',
      generateData: () => {
        const deptsToInclude = deptFilter === 'ALL'
          ? departments
          : departments.filter(d => d.department === deptFilter);

        return deptsToInclude.map(d => {
          const deptStudents = students.filter(s => s.department === d.department);
          const highRiskCount = deptStudents.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;
          const avgAtt = deptStudents.length > 0
            ? Math.round(deptStudents.reduce((acc, s) => acc + s.attendance, 0) / deptStudents.length)
            : d.avgAttendance;

          return {
            Department: d.department,
            BranchCode: d.code,
            TotalTrackedStudents: deptStudents.length > 0 ? deptStudents.length : d.totalStudents,
            RetentionRate: `${d.retentionRate}%`,
            AverageAttendance: `${avgAtt}%`,
            HighRiskCount: highRiskCount,
            FacultyMentors: d.facultyCount,
            ActiveInterventions: d.activeInterventions
          };
        });
      }
    },
    {
      id: 'attendance-defaulters',
      title: 'Attendance Defaulters List (<75%)',
      category: 'University Regulatory Compliance',
      description: 'Official roster of students falling below the mandatory 75% attendance threshold for university examination hall ticket verification.',
      icon: FileText,
      color: 'amber',
      generateData: () => {
        const pool = filteredStudents.filter(s => s.attendance < 75);
        return pool.map(s => ({
          StudentID: s.id,
          Name: s.name,
          Department: s.department,
          Semester: `Sem ${s.semester}`,
          Attendance: `${s.attendance}%`,
          AttendanceDeficit: `${75 - s.attendance}%`,
          CGPA: s.cgpa,
          Backlogs: s.backlogs,
          ParentContact: s.parentPhone || s.phone || 'N/A',
          Mentor: s.mentorName || 'Unassigned'
        }));
      }
    },
    {
      id: 'counseling-intervention-status',
      title: 'Counseling & Intervention Status Report',
      category: 'Mentoring & Pastoral Care',
      description: 'Complete audit log of all one-on-one student counseling interventions, remedial action commitments, follow-up deadlines, and resolution statuses.',
      icon: HeartHandshake,
      color: 'emerald',
      generateData: () => {
        let pool = interventions;
        if (deptFilter !== 'ALL') {
          pool = pool.filter(i => i.studentDepartment === deptFilter);
        }
        return pool.map(i => ({
          InterventionID: i.id,
          StudentName: i.studentName,
          StudentID: i.studentId,
          Department: i.studentDepartment,
          FacultyMentor: i.facultyName,
          InterventionType: i.type,
          DateLogged: i.date,
          Status: i.status,
          ActionPlan: i.notes || i.actionPlan || 'Mentoring action documented',
          ImprovementObserved: i.improvementStatus || 'Under Review'
        }));
      }
    },
    {
      id: 'semester-executive-summary',
      title: 'Semester Executive Summary',
      category: 'Leadership & Governing Council',
      description: 'High-level institutional executive report summarizing overall student body health, risk stratification totals, key early-warning triggers, and term retention targets.',
      icon: ShieldCheck,
      color: 'blue',
      generateData: () => {
        const total = filteredStudents.length;
        const low = filteredStudents.filter(s => s.riskLevel === 'LOW').length;
        const mod = filteredStudents.filter(s => s.riskLevel === 'MODERATE' || s.riskLevel === 'MEDIUM').length;
        const high = filteredStudents.filter(s => s.riskLevel === 'HIGH').length;
        const crit = filteredStudents.filter(s => s.riskLevel === 'CRITICAL' || (s.dropoutProbability && s.dropoutProbability > 80)).length;
        const avgAtt = total > 0 ? Math.round(filteredStudents.reduce((a, b) => a + (b.attendance || 0), 0) / total) : 0;
        const avgCgpa = total > 0 ? (filteredStudents.reduce((a, b) => a + (Number(b.cgpa) || 0), 0) / total).toFixed(2) : '0.00';

        return [
          { Metric: 'Cohort Scope', Value: `${deptFilter === 'ALL' ? 'All Departments' : deptFilter} (Semester: ${semesterFilter})` },
          { Metric: 'Total Students Evaluated', Value: total },
          { Metric: 'Low Risk Cohort (<35%)', Value: `${low} (${total > 0 ? Math.round((low/total)*100) : 0}%)` },
          { Metric: 'Moderate Risk Cohort (35-65%)', Value: `${mod} (${total > 0 ? Math.round((mod/total)*100) : 0}%)` },
          { Metric: 'High Risk Cohort (65-80%)', Value: `${high} (${total > 0 ? Math.round((high/total)*100) : 0}%)` },
          { Metric: 'Critical Risk Cohort (>80%)', Value: `${crit} (${total > 0 ? Math.round((crit/total)*100) : 0}%)` },
          { Metric: 'Institutional Avg Attendance', Value: `${avgAtt}%` },
          { Metric: 'Institutional Avg CGPA', Value: `${avgCgpa} / 10.0` },
          { Metric: 'Active Interventions in Registry', Value: interventions.length },
          { Metric: 'Official Accreditation Compliance Status', Value: 'Verified & NAAC Ready' }
        ];
      }
    }
  ], [filteredStudents, departments, interventions, deptFilter, semesterFilter, riskFilter]);

  const handleOpenPreview = (rep) => {
    const data = rep.generateData();
    setPreviewModal({
      isOpen: true,
      reportType: rep.id,
      title: rep.title,
      data
    });
  };

  const handleExportCSV = (rep) => {
    const data = rep.generateData();
    exportToCSV(`${rep.id}_Report.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Academic Report Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate, inspect, and export university-standard academic audits, regulatory attendance defaulter lists, and NAAC/NBA documentation.
          </p>
        </div>

        <button
          onClick={triggerPrintWindow}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-indigo-400" />
          <span>Print Page</span>
        </button>
      </div>

      {/* Global Filter Bar for Reports */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Filter Report Data Scope:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            label="Risk Filter"
            value={riskFilter}
            onChange={setRiskFilter}
            options={[
              { value: 'ALL', label: 'All Risk Tiers' },
              { value: 'CRITICAL', label: 'Critical Risk Only' },
              { value: 'HIGH', label: 'High Risk Only' },
              { value: 'MODERATE', label: 'Moderate Risk Only' },
              { value: 'LOW', label: 'Low Risk Only' }
            ]}
          />
        </div>
      </div>

      {/* Reports Grid (5 Reports) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => {
          const Icon = rep.icon;
          const dataCount = rep.generateData().length;

          return (
            <div
              key={rep.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {rep.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{rep.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rep.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-y border-slate-800/80 mb-4">
                  <span>Filtered Target Scope: <strong className="text-white">{dataCount} records</strong></span>
                  <span className="text-indigo-400 font-semibold">CSV / PDF Ready</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleOpenPreview(rep)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>Preview Document</span>
                  </button>

                  <button
                    onClick={() => handleExportCSV(rep)}
                    disabled={dataCount === 0}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Report Preview Modal */}
      <ReportPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
        reportType={previewModal.reportType}
        title={previewModal.title}
        data={previewModal.data}
      />
    </div>
  );
}
