import React, { useState, useEffect } from 'react';
import {
  Sparkles, CheckCircle2, Circle, BookOpen, Clock, Calendar,
  ArrowRight, Check, AlertTriangle, ShieldCheck, Plus, Filter,
  Target, Award, Trash2, HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudentData } from '../../context/StudentDataContext';
import { generateRecommendations } from '../../utils/riskCalculator';

export default function StudentRecommendations() {
  const { user } = useAuth();
  const { students } = useStudentData();

  const student = students.find(s => s.id === (user?.studentId || user?.id)) || students[0];

  // System generated recommendations
  const systemRecs = generateRecommendations(student);

  // Expanded default actionable recommendations covering all required categories
  const defaultActionItems = [
    {
      id: "REC-001",
      title: "Mandatory Biometric Lecture Attendance Sprint",
      category: "Attendance Recovery",
      priority: "Critical",
      area: "Attendance",
      impact: "-14% Risk",
      details: "Attend next 12 consecutive lectures across Software Engineering (IT501) and Database Systems to restore compliance with university 75% attendance criteria.",
      deadline: "Within 2 Weeks",
      mentorAction: "Report weekly attendance slip to Dr. Anjali Deshmukh",
      status: "In Progress"
    },
    {
      id: "REC-002",
      title: "ATKT Backlog Recovery Plan for Database Systems (IT505)",
      category: "Backlog Recovery",
      priority: "Critical",
      area: "Exams & Backlogs",
      impact: "-12% Risk",
      details: "Solve previous 3 years' university question papers and attend 3 hours weekly remedial peer tutoring sessions with Sneha Kulkarni.",
      deadline: "End of Month",
      mentorAction: "Verify solved mock paper solutions with faculty instructor",
      status: "In Progress"
    },
    {
      id: "REC-003",
      title: "Advanced Java Programming Laboratory Practical Journal Freeze",
      category: "Academic Improvement",
      priority: "High Priority",
      area: "Continuous Assessment",
      impact: "-8% Risk",
      details: "Submit pending code executions for Experiment 3 (Multithreading) and Experiment 4 (JDBC connectivity) in evening open lab hours.",
      deadline: "Friday, Sep 08",
      mentorAction: "Obtain lab in-charge signature on practical index",
      status: "In Progress"
    },
    {
      id: "REC-004",
      title: "Semester 5 Structured Weekly Revision Study Schedule",
      category: "Study Planning",
      priority: "High Priority",
      area: "Study Habit",
      impact: "-6% Risk",
      details: "Dedicate 2 hours daily (6:00 PM - 8:00 PM) for technical problem solving, spacing Computer Networks theory on Mon/Wed and Java programming on Tue/Thu.",
      deadline: "Daily Habit",
      mentorAction: "Review weekly study diary with peer study circle",
      status: "In Progress"
    },
    {
      id: "REC-005",
      title: "Schedule Bi-Weekly 1-on-1 Mentorship Progress Review",
      category: "Mentor / Counselor",
      priority: "Recommended",
      area: "Counseling",
      impact: "-5% Risk",
      details: "Meet Dr. Anjali Deshmukh (Room 402, IT Department) during office hours (3:30 PM - 4:30 PM) to review academic progress and fee installment receipts.",
      deadline: "Sep 18, 2026",
      mentorAction: "Log session outcome in institutional student tracking portal",
      status: "In Progress"
    },
    {
      id: "REC-006",
      title: "Library Book Bank & Reference Material Requisition",
      category: "Academic Improvement",
      priority: "Recommended",
      area: "Coursework",
      impact: "-4% Risk",
      details: "Collect reserved syllabus reference books (Galvin Operating Systems & Korth Database Concepts) from Central Library counter.",
      deadline: "Next Week",
      mentorAction: "Issue sanctioned under student welfare book bank scheme",
      status: "In Progress"
    }
  ];

  // State for all items (persisted in localStorage)
  const [recommendations, setRecommendations] = useState(() => {
    try {
      const saved = localStorage.getItem(`student_recommendations_${student.id}`);
      return saved ? JSON.parse(saved) : defaultActionItems;
    } catch {
      return defaultActionItems;
    }
  });

  // State for completed IDs
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`student_rec_completed_ids_${student.id}`);
      return saved ? JSON.parse(saved) : ["REC-006"];
    } catch {
      return ["REC-006"];
    }
  });

  // Category & Priority filter tab: ALL, CRITICAL, HIGH, RECOMMENDED, COMPLETED
  const [activeTab, setActiveTab] = useState('ALL');

  // Custom task creation state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Study Planning');
  const [newTaskPriority, setNewTaskPriority] = useState('High Priority');
  const [newTaskDeadline, setNewTaskDeadline] = useState('Upcoming Weekend');

  useEffect(() => {
    try {
      localStorage.setItem(`student_recommendations_${student.id}`, JSON.stringify(recommendations));
    } catch (e) {
      console.error(e);
    }
  }, [recommendations, student.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`student_rec_completed_ids_${student.id}`, JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedIds, student.id]);

  const toggleComplete = (id) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter(i => i !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  const handleAddCustomGoal = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newItem = {
      id: `CUSTOM-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      area: newTaskCategory,
      impact: "-5% Risk",
      details: `Self-directed action created by ${student.name} to enhance Semester ${student.semester} performance.`,
      deadline: newTaskDeadline || "This Term",
      mentorAction: "Self-monitored study objective",
      status: "In Progress"
    };

    setRecommendations([newItem, ...recommendations]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    setRecommendations(recommendations.filter(r => r.id !== id));
    setCompletedIds(completedIds.filter(i => i !== id));
  };

  // Filter recommendations according to activeTab
  const filteredRecommendations = recommendations.filter(item => {
    const isCompleted = completedIds.includes(item.id);
    if (activeTab === 'COMPLETED') return isCompleted;
    if (activeTab === 'CRITICAL') return !isCompleted && item.priority === 'Critical';
    if (activeTab === 'HIGH') return !isCompleted && item.priority === 'High Priority';
    if (activeTab === 'RECOMMENDED') return !isCompleted && item.priority === 'Recommended';
    return true; // 'ALL'
  });

  const completedCount = completedIds.length;
  const totalCount = recommendations.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Personalized Academic Recovery Plan</h1>
          <p className="text-xs text-slate-400 mt-1">
            Actionable study milestones, attendance sprints, and mentor recommendations designed to restore good standing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Progress & Category Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recovery Progress</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-white">{completedCount}</span>
            <span className="text-xs text-slate-400">/ {totalCount} Goals Accomplished</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Actions</span>
          <p className="text-2xl font-extrabold text-rose-400 mt-1">
            {recommendations.filter(r => r.priority === 'Critical' && !completedIds.includes(r.id)).length}
          </p>
          <span className="text-[11px] text-slate-400">Immediate attention needed</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Priority</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">
            {recommendations.filter(r => r.priority === 'High Priority' && !completedIds.includes(r.id)).length}
          </p>
          <span className="text-[11px] text-slate-400">Target for next 14 days</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Actions</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {completedCount}
          </p>
          <span className="text-[11px] text-emerald-400/80 font-medium">Restoring academic eligibility</span>
        </div>
      </div>

      {/* Add Custom Task Form Modal / Inline Box */}
      {isAddingTask && (
        <form onSubmit={handleAddCustomGoal} className="glass-card p-5 rounded-2xl border border-cyan-500/40 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Define Personalized Study / Recovery Milestone</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Milestone Objective Title</label>
              <input
                type="text"
                placeholder="e.g. Complete 5 practice questions for Computer Networks exam..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Academic Improvement">Academic Improvement</option>
                <option value="Attendance Recovery">Attendance Recovery</option>
                <option value="Backlog Recovery">Backlog Recovery</option>
                <option value="Study Planning">Study Planning</option>
                <option value="Mentor / Counselor">Mentor / Counselor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Critical">Critical</option>
                <option value="High Priority">High Priority</option>
                <option value="Recommended">Recommended</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs: Critical, High Priority, Recommended, Completed */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'ALL', label: 'All Actions', count: recommendations.length },
          { id: 'CRITICAL', label: 'Critical', count: recommendations.filter(r => r.priority === 'Critical' && !completedIds.includes(r.id)).length },
          { id: 'HIGH', label: 'High Priority', count: recommendations.filter(r => r.priority === 'High Priority' && !completedIds.includes(r.id)).length },
          { id: 'RECOMMENDED', label: 'Recommended', count: recommendations.filter(r => r.priority === 'Recommended' && !completedIds.includes(r.id)).length },
          { id: 'COMPLETED', label: 'Completed', count: completedCount }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredRecommendations.map((item) => {
          const isDone = completedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleComplete(item.id)}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                  : item.priority === 'Critical'
                  ? 'border-rose-500/30 bg-rose-950/5 hover:border-rose-500/50'
                  : item.priority === 'High Priority'
                  ? 'border-amber-500/30 bg-amber-950/5 hover:border-amber-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(item.id);
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-slate-700 bg-slate-950 text-transparent hover:border-cyan-500'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.priority === 'High Priority'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium">
                      Impact: {item.impact}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {item.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Target: <strong className="text-slate-200">{item.deadline}</strong></span>
                    </span>
                    {item.mentorAction && (
                      <span className="flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Mentor check: <strong className="text-indigo-300">{item.mentorAction}</strong></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {isDone ? 'Completed ✓' : 'Mark Complete'}
                </button>

                {item.id.startsWith('CUSTOM-') && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete custom milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredRecommendations.length === 0 && (
          <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No pending items in this category</h4>
            <p className="text-xs text-slate-400">
              All milestones under this filter are either accomplished or not applicable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
