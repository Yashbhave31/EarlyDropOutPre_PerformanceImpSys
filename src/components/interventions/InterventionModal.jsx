import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

export default function InterventionModal({ isOpen, onClose, student, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "Counseling Session",
    description: "",
    actionPlan: "",
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    remarks: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      studentId: student?.id,
      studentName: student?.name,
      studentDepartment: student?.department,
      studentRisk: student?.riskLevel,
      facultyId: user?.facultyId || "FAC001",
      facultyName: user?.name || "Dr. Anjali Deshmukh",
      ...formData,
      status: "In Progress",
      improvementStatus: "Plan initiated"
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Preventive Intervention - ${student?.name || ''}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Intervention Category</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="Counseling Session">Counseling Session (One-on-One)</option>
              <option value="Academic Mentoring">Academic Mentoring & Remedial Tutoring</option>
              <option value="Attendance Improvement Plan">Attendance Improvement Contract</option>
              <option value="Parent/Guardian Meeting">Parent / Guardian Conference</option>
              <option value="Financial Assistance Guidance">Financial Assistance & Scholarship Desk</option>
            </select>
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
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Diagnostic Observations & Key Triggers</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Document student's primary academic/personal bottlenecks..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Actionable Recovery Steps (Prescribed Plan)</label>
          <textarea
            rows="3"
            value={formData.actionPlan}
            onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
            placeholder="1. Attend 2 hrs remedial lab every Tuesday
2. Submit Unit Test 1 revision assignments
3. Maintain 75% weekly attendance"
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
            placeholder="e.g., Student acknowledged concern and agreed to weekly checkpoint"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30">
            Save Intervention Record
          </button>
        </div>
      </form>
    </Modal>
  );
}
