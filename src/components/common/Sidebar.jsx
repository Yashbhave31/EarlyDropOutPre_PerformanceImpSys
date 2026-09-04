import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Building2, BrainCircuit,
  BarChart3, FileText, Bell, Activity, Settings, User, LogOut,
  GraduationCap, ClipboardList, Target, Compass, HeartHandshake, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Students Master', path: '/admin/students', icon: Users },
        { label: 'Faculty Roster', path: '/admin/faculty', icon: UserCheck },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'AI Risk Engine', path: '/admin/predictions', icon: BrainCircuit, badge: 'ML' },
        { label: 'Institution Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Academic Reports', path: '/admin/reports', icon: FileText },
        { label: 'System Logs', path: '/admin/logs', icon: Activity },
        { label: 'System Settings', path: '/admin/settings', icon: Settings }
      ];
    } else if (role === 'faculty') {
      return [
        { label: 'Faculty Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
        { label: 'My Students', path: '/faculty/students', icon: Users },
        { label: 'Data Collection', path: '/faculty/data-collection', icon: ClipboardList, badge: 'Intake' },
        { label: 'Academic Performance', path: '/faculty/performance', icon: BarChart3 },
        { label: 'AI Risk Analysis', path: '/faculty/predictions', icon: BrainCircuit, badge: 'AI' },
        { label: 'Interventions Tracking', path: '/faculty/interventions', icon: HeartHandshake },
        { label: 'Cohort Reports', path: '/faculty/reports', icon: FileText }
      ];
    } else {
      return [
        { label: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Academic Performance', path: '/student/performance', icon: BarChart3 },
        { label: 'AI Risk Analysis', path: '/student/risk-analysis', icon: BrainCircuit, badge: 'SHAP' },
        { label: 'Recommendations', path: '/student/recommendations', icon: Target, badge: 'Plan' },
        { label: 'Counseling & Interventions', path: '/student/interventions', icon: HeartHandshake },
        { label: 'Student Profile', path: '/student/profile', icon: User }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">EduRisk AI</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{role} Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={user?.name || "User"}
              className="w-9 h-9 rounded-xl object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.designation || user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
