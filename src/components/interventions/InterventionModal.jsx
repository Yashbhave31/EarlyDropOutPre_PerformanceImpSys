import React, { useState } from 'react';
import Modal from '../common/Modal';
import RiskBadge from '../common/RiskBadge';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, Calendar, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function InterventionModal({ isOpen, onClose, student, onSave, onSubmit }) {
  const { user } = useAuth();
  const saveHandler = onSave || onSubmit;

  const [formData, setFormData] = useState({
    type: "Academic Counseling",
    status: "Scheduled",
    priority: "High",
    date: new Date().toISOString().split('T')[0],
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    reason: student ? `Identified as ${student.riskLevel || 'At-Risk'} with ${student.attendance}% attendance and ${student.backlogs || 0} backlogs` : "",
    description: "",
    actionPlan: "1. Weekly attendance monitoring contract\n2. Mandatory remedial tutorial sessions\n3. Bi-weekly progress review with mentor",
    remarks: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saveHandler) {
      saveHandler({
        studentId: student?.id,
        studentName: student?.name,
        studentDepartment: student?.department,
        studentRisk: student?.riskLevel,
        facultyId: user?.facultyId || user?.id || "FAC001",
        facultyName: user?.name || "Dr. Rajesh Sharma",
        ...formData,
        improvementStatus: formData.status === 'Completed' ? 'Completed' : 'Plan active'
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Schedule / Log Intervention - ${student?.name || 'Student'}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {student && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-3">
              <img
                src={student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <p className="font-bold text-white text-sm">{student.name}</p>
                <p className="text-[11px] text-slate-400">{student.id} • {student.department || 'Information Technology'}</p>
              </div>
            </div>
            <div className="text-right">
              <RiskBadge risk={student.riskLevel} size="sm" />
              <p className="text-[10px] text-slate-400 mt-1">Attendance: <strong className={student.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}>{student.attendance}%</strong></p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Intervention Category *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Academic Counseling">Academic Counseling</option>
              <option value="Attendance Counseling">Attendance Counseling</option>
              <option value="Backlog Support">Backlog Support</option>
              <option value="Performance Improvement">Performance Improvement</option>
              <option value="Parent/Guardian Meeting">Parent/Guardian Meeting</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Other">Other Remedial Intervention</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Intervention Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Follow-up Required">Follow-up Required</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Session Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Follow-up Milestone Date</label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Urgent">Urgent (Immediate)</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low / Routine</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Discussion Reason / Diagnostic Trigger</label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="e.g. Critical attendance deficit, repeated test failures"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Counseling Notes & Key Observations *</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Document student explanation, root causes (commute, health, difficulty understanding coursework), and counselor guidance..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Action Plan & Remedial Prescriptions *</label>
          <textarea
            rows="3"
            value={formData.actionPlan}
            onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
            placeholder="Specific deliverables, e.g. attend 2 remedial tutorials/week, submit backlog assignment by Friday, biometric attendance sign-off..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Faculty / Counselor Remarks</label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="e.g. Student acknowledged concern and pledged compliance"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5">
            <HeartHandshake className="w-4 h-4" />
            <span>Save Intervention Record</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
