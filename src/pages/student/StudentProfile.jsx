import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase, BookOpen, Save,
  CheckCircle2, Bell, Shield, Sliders, GraduationCap, Award,
  Smartphone, Building, Calendar, HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const { students, saveStudent } = useStudentData();

  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    phone: student.phone || '+91 98201 23456',
    email: student.email || 'aarav.patil@student.edu',
    division: student.division || 'Division A',
    rollNo: student.rollNo || '24',
    distanceKm: student.distanceKm || 15,
    transportMode: student.transportMode || 'Local Train & Bus',
    address: student.address || 'Flat 302, Sai Vihar, Dombivli East, Thane'
  });

  // Notification / Account Preferences
  const [preferences, setPreferences] = useState({
    attendanceAlerts: true,
    examReminders: true,
    mentorUpdates: true,
    weeklyDigest: false
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (saveStudent) {
      await saveStudent({
        ...student,
        ...formData
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Academic & Personal Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional enrollment records, contact coordinates, academic summary, and account preferences.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile coordinates and settings successfully updated in the institutional database.</span>
        </div>
      )}

      {/* Primary Identity Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/20">
        <img
          src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"}
          alt={student.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white">{student.name}</h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Active Student
            </span>
          </div>

          <p className="text-xs text-indigo-400 font-semibold">
            Student PRN: <span className="font-mono">{student.id}</span> • {student.department}
          </p>

          <p className="text-xs text-slate-400">
            Semester {student.semester} ({student.academicYear || "2025-2026"}) • {formData.division} (Roll No: {formData.rollNo})
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <HeartHandshake className="w-4 h-4 text-indigo-400" />
              <span>Assigned Mentor: <strong className="text-white">{student.mentorName || "Dr. Anjali Deshmukh"}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Summary Dashboard */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span>Academic Milestones & Eligibility Summary</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">10th Standard</span>
            <p className="font-bold text-white text-base mt-0.5">{student.tenthPercent}%</p>
            <span className="text-[9px] text-slate-500">Board Exam</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">12th Standard</span>
            <p className="font-bold text-white text-base mt-0.5">{student.twelfthPercent}%</p>
            <span className="text-[9px] text-slate-500">HSC Science</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">Cumulative CGPA</span>
            <p className="font-bold text-cyan-400 text-base mt-0.5">{student.cgpa} / 10</p>
            <span className="text-[9px] text-slate-500">Sem 1 - 4 Avg</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">Credits Earned</span>
            <p className="font-bold text-white text-base mt-0.5">117 / 138</p>
            <span className="text-[9px] text-slate-500">Degree Progress</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">Current Attendance</span>
            <p className={`font-bold text-base mt-0.5 ${student.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {student.attendance}%
            </p>
            <span className="text-[9px] text-slate-500">Target: 75%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block">Active Backlogs</span>
            <p className={`font-bold text-base mt-0.5 ${student.backlogs > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {student.backlogs} Paper(s)
            </p>
            <span className="text-[9px] text-slate-500">Database Systems</span>
          </div>
        </div>
      </div>

      {/* Institutional Details & Enrollment Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Contact & Commute Coordinates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Institutional Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Class Division & Roll Number</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  placeholder="Division A"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="Roll 24"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">One-Way Commute Distance (km)</label>
              <input
                type="number"
                value={formData.distanceKm}
                onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Used by ML risk engine for commute factor weighting</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Transport Mode</label>
              <input
                type="text"
                value={formData.transportMode}
                onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Account & Notification Preferences */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Academic Notification Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Attendance Deficit Alerts</p>
                <p className="text-[11px] text-slate-400">Receive SMS / Email alert when course attendance falls under 75%</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.attendanceAlerts}
                onChange={(e) => setPreferences({ ...preferences, attendanceAlerts: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Examination & Lab Submission Reminders</p>
                <p className="text-[11px] text-slate-400">Notifications for Unit Tests, practical vivas, and journal freezes</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.examReminders}
                onChange={(e) => setPreferences({ ...preferences, examReminders: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Mentorship & Counseling Updates</p>
                <p className="text-[11px] text-slate-400">Direct notifications when mentor schedules follow-ups or reviews</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.mentorUpdates}
                onChange={(e) => setPreferences({ ...preferences, mentorUpdates: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Weekly Academic Performance Digest</p>
                <p className="text-[11px] text-slate-400">Weekly progress summary email every Sunday evening</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(e) => setPreferences({ ...preferences, weeklyDigest: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Coordinates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
