import React, { useState } from 'react';
import {
  HeartHandshake, Calendar, Clock, CheckCircle2, User, FileText,
  AlertCircle, ChevronRight, Plus, X, MessageSquare, Send, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';

export default function StudentInterventions() {
  const { user } = useAuth();
  const { students, interventions, saveIntervention } = useStudentData();

  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];
  const myInterventions = (interventions || []).filter(i => i.studentId === student?.id);

  // Status Filter: ALL, Scheduled, In Progress, Completed, Follow-up Required
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Request new counseling session state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('Academic Counseling & Study Guidance');
  const [requestReason, setRequestReason] = useState('');
  const [requestedDate, setRequestedDate] = useState('2026-09-22');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const filteredInterventions = myInterventions.filter(item => {
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestReason.trim()) return;

    setIsSubmitting(true);
    try {
      const newIntervention = {
        id: `INT-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        studentDepartment: student.department,
        studentRisk: student.riskLevel,
        facultyId: "FAC001",
        facultyName: student.mentorName || "Dr. Anjali Deshmukh",
        type: requestType,
        date: requestedDate,
        reason: requestReason.trim(),
        notes: "Student-initiated counseling appointment request submitted via student portal.",
        actionPlan: "Pending initial mentor intake and verification during scheduled review.",
        followUpDate: "To be scheduled",
        status: "Scheduled",
        remarks: "Automated student scheduling workflow"
      };

      if (saveIntervention) {
        await saveIntervention(newIntervention);
      }

      setSuccessToast("Counseling appointment requested successfully! Your mentor has been notified.");
      setIsRequestModalOpen(false);
      setRequestReason('');
      setTimeout(() => setSuccessToast(''), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Follow-up Required':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mentorship & Counseling History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Official records of one-on-one advising sessions, study contracts, action plans, and scheduled follow-ups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Counseling Session</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Assigned Mentor Header Card */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/30">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150"
            alt={student.mentorName || "Mentor"}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{student.mentorName || "Dr. Anjali Deshmukh"}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Assigned Mentor
              </span>
            </div>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">Associate Professor & HOD (Information Technology)</p>
            <p className="text-[11px] text-slate-400">Department Office: Room 402 • Office Hours: Mon-Thu 3:30 - 4:30 PM</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Total Sessions</span>
            <span className="text-base font-bold text-white">{myInterventions.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Next Review</span>
            <span className="text-xs font-bold text-cyan-400">Sep 18, 2026</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'ALL', label: 'All Sessions', count: myInterventions.length },
          { id: 'Scheduled', label: 'Scheduled', count: myInterventions.filter(i => i.status === 'Scheduled').length },
          { id: 'In Progress', label: 'In Progress', count: myInterventions.filter(i => i.status === 'In Progress').length },
          { id: 'Completed', label: 'Completed', count: myInterventions.filter(i => i.status === 'Completed').length },
          { id: 'Follow-up Required', label: 'Follow-up Required', count: myInterventions.filter(i => i.status === 'Follow-up Required').length }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              statusFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {filteredInterventions.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-6 sm:-left-8 top-5 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center ${
              item.status === 'Completed' ? 'bg-emerald-500' :
              item.status === 'In Progress' ? 'bg-amber-500' :
              item.status === 'Scheduled' ? 'bg-blue-500' : 'bg-rose-500'
            }`} />

            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.type}</h3>
                    <p className="text-xs text-slate-400">
                      Conducted by <strong className="text-slate-300">{item.facultyName}</strong> • Session Ref: <span className="font-mono text-indigo-400">{item.id}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </span>

                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Reason */}
              {item.reason && (
                <div className="text-xs text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Session Purpose / Trigger Reason:</span>
                  <p className="text-slate-200">{item.reason}</p>
                </div>
              )}

              {/* Action Plan */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block text-indigo-400">
                  Assigned Action Plan & Academic Milestones
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {item.actionPlan}
                </p>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Counselor Clinical Notes: </span>
                  <span>{item.notes}</span>
                </div>
              )}

              {/* Follow up date */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Scheduled Follow-Up: {item.followUpDate || "Term Review"}</span>
                </div>

                {item.improvementStatus && (
                  <span className="text-emerald-400 font-medium">
                    Status: {item.improvementStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredInterventions.length === 0 && (
          <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-2">
            <HeartHandshake className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-white text-sm">No records found for status: {statusFilter}</p>
            <p className="text-xs text-slate-400">Select "All Sessions" to view the complete mentorship timeline.</p>
          </div>
        )}
      </div>

      {/* Modal for Requesting Counseling Session */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 rounded-2xl border border-indigo-500/40 bg-slate-900 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <HeartHandshake className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Request Mentorship Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Counseling Type / Domain</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Academic Counseling & Study Guidance">Academic Counseling & Study Guidance</option>
                  <option value="Attendance Recovery & Exam Eligibility">Attendance Recovery & Exam Eligibility</option>
                  <option value="Backlog Clearance & Peer Tutoring Support">Backlog Clearance & Peer Tutoring Support</option>
                  <option value="Financial / Fee Installment Guidance">Financial / Fee Installment Guidance</option>
                  <option value="Personal Well-being & Stress Management">Personal Well-being & Stress Management</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reason / Discussion Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Explain what specific challenges or questions you would like to review with your mentor..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                Mentor: <strong className="text-white">{student.mentorName || "Dr. Anjali Deshmukh"}</strong>.
                Session will be logged in the department calendar and confirmation sent to your email.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
