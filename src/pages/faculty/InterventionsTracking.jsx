import React, { useState, useMemo } from 'react';
import {
  HeartHandshake, Plus, CheckCircle, Clock, Calendar, AlertCircle,
  Filter, Search, Download, FileText, ArrowRight, UserCheck, ShieldAlert,
  ChevronRight, Edit3, MessageSquare
} from 'lucide-react';
import InterventionTimeline from '../../components/interventions/InterventionTimeline';
import InterventionModal from '../../components/interventions/InterventionModal';
import StudentProfileModal from '../shared/StudentProfileModal';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { exportToCSV } from '../../utils/exportUtils';

export default function InterventionsTracking() {
  const { user } = useAuth();
  const { interventions, students, logIntervention, updateInterventionStatus } = useStudentData();

  const [statusTab, setStatusTab] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentForNew, setSelectedStudentForNew] = useState(null);
  const [selectedProfileModal, setSelectedProfileModal] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Mentees assigned to faculty or department
  const myStudents = useMemo(() => {
    return students.filter(s =>
      s.mentorId === user?.id ||
      s.mentorName?.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
      s.department === (user?.department || 'Information Technology')
    );
  }, [students, user]);

  // Metrics
  const totalInterventions = interventions.length;
  const completedCount = interventions.filter(i => i.status === 'Completed').length;
  const inProgressCount = interventions.filter(i => i.status === 'In Progress').length;
  const scheduledCount = interventions.filter(i => i.status === 'Scheduled' || i.status === 'Follow-up Required').length;
  const improvedStudentsCount = interventions.filter(i =>
    i.improvementStatus?.toLowerCase().includes('improved') ||
    i.status === 'Completed'
  ).length;

  const filteredInterventions = useMemo(() => {
    return interventions.filter(item => {
      const matchesStatus =
        statusTab === 'ALL' ||
        item.status?.toLowerCase() === statusTab.toLowerCase();

      const matchesType =
        typeFilter === 'ALL' ||
        item.type === typeFilter;

      const matchesSearch =
        item.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        item.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.actionPlan?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [interventions, statusTab, typeFilter, search]);

  const handleExportCSV = () => {
    const data = filteredInterventions.map(i => ({
      InterventionID: i.id,
      StudentID: i.studentId,
      StudentName: i.studentName,
      Category: i.type,
      Status: i.status,
      Date: i.date,
      FollowUpMilestone: i.followUpDate,
      MentorName: i.facultyName,
      DiagnosticReason: i.reason || i.description || '',
      ActionPlan: i.actionPlan || '',
      Remarks: i.remarks || ''
    }));
    exportToCSV(`Interventions_Log_${new Date().toISOString().split('T')[0]}.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <HeartHandshake className="w-3 h-3 text-indigo-400" />
              Proactive Academic Counseling Command
            </span>
            <span className="text-xs text-slate-400">Institutional Early Warning Response</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Interventions & Counseling Management Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document diagnostic counseling sessions, track recovery action plans, and audit student improvement milestones.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForNew(myStudents[0] || students[0]);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule / Log Intervention</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Interventions</span>
          <p className="text-2xl font-bold text-white mt-1">{totalInterventions}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Logged this academic year</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Completed & Resolved</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Milestones satisfied</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">In Progress & Scheduled</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{inProgressCount + scheduledCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">{scheduledCount} awaiting follow-up</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Demonstrated Improvement</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{improvedStudentsCount}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Positive trajectory tracked</span>
        </div>
      </div>

      {/* Filters, Type Dropdown, Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, roll number, or action plan keyword..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Status Tabs (4 cols) */}
          <div className="md:col-span-4 flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
            {['ALL', 'Scheduled', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? `All (${interventions.length})` : tab}
              </button>
            ))}
          </div>

          {/* Intervention Category Dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Academic Counseling">Academic Counseling</option>
              <option value="Attendance Counseling">Attendance Counseling</option>
              <option value="Backlog Support">Backlog Support</option>
              <option value="Performance Improvement">Performance Improvement</option>
              <option value="Parent/Guardian Meeting">Parent/Guardian Meeting</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Other">Other Remedial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Session Cards & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Intervention Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredInterventions.map((item) => {
            const studentObj = students.find(s => s.id === item.studentId);

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <img
                      src={studentObj?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={item.studentName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3
                          onClick={() => studentObj && setSelectedProfileModal(studentObj)}
                          className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer"
                        >
                          {item.studentName}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">({item.studentId})</span>
                      </div>
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">{item.type}</p>
                    </div>
                  </div>

                  {/* Status Badges & Controls */}
                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'In Progress'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>

                    {/* Status Changer Menu */}
                    <select
                      value={item.status}
                      onChange={(e) => updateInterventionStatus(item.id, e.target.value)}
                      className="text-[10px] bg-slate-900 border border-slate-700 rounded-lg text-slate-300 p-1 focus:outline-none"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Follow-up Required">Follow-up Required</option>
                    </select>
                  </div>
                </div>

                {/* Reason / Trigger */}
                {item.reason && (
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400">Diagnostic Trigger:</strong> {item.reason}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400">Observations:</strong> {item.description}
                  </p>
                )}

                {/* Action Plan Box */}
                {item.actionPlan && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Action Plan & Remedial Contract</span>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line">{item.actionPlan}</p>
                  </div>
                )}

                {/* Remarks */}
                {item.remarks && (
                  <p className="text-xs text-slate-400 italic">
                    "{item.remarks}"
                  </p>
                )}

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Logged: {item.date}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span className="text-slate-300">Follow-up Milestone: {item.followUpDate || 'TBD'}</span>
                  </span>

                  <span className="text-indigo-300 font-medium">Faculty: {item.facultyName}</span>
                </div>
              </div>
            );
          })}

          {filteredInterventions.length === 0 && (
            <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <HeartHandshake className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-bold text-white text-sm">No Interventions Found</p>
              <p>No records match your selected filter or keyword search.</p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Intervention History Timeline Activity Feed */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Chronological Activity Timeline</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Audit Stream
            </span>
          </div>

          <InterventionTimeline interventions={interventions} />
        </div>
      </div>

      {/* New Intervention Modal */}
      {isModalOpen && (
        <InterventionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudentForNew}
          onSubmit={async (data) => {
            await logIntervention(data);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Student Profile Modal */}
      {selectedProfileModal && (
        <StudentProfileModal
          isOpen={Boolean(selectedProfileModal)}
          onClose={() => setSelectedProfileModal(null)}
          student={selectedProfileModal}
          onLogIntervention={(st) => {
            setSelectedStudentForNew(st);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
