import os

def write_file(rel_path, content):
    full = os.path.join(os.getcwd(), rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created " + rel_path)

# 1. Navbar.jsx (For Landing Page)
write_file("src/components/common/Navbar.jsx", """
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, role } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'student') navigate('/student/dashboard');
    else navigate('/roles');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 dark:bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-white tracking-tight">EduRisk</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI ML</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Early Dropout Prediction</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors">Key Features</a>
          <a href="#problem-solution" className="hover:text-blue-400 transition-colors">Why It Matters</a>
          <a href="#workflow" className="hover:text-blue-400 transition-colors">ML Workflow</a>
          <a href="#risk-levels" className="hover:text-blue-400 transition-colors">Risk Classification</a>
          <a href="#preview" className="hover:text-blue-400 transition-colors">Live Telemetry</a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleDashboardRedirect}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-500/25 transition-all"
            >
              <span>Dashboard ({role?.toUpperCase()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/roles"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
""")

# 2. RiskBadge.jsx
write_file("src/components/common/RiskBadge.jsx", """
import React from 'react';
import { getRiskColorClass } from '../../utils/formatters';

export default function RiskBadge({ risk, showDot = true, size = "md" }) {
  const riskClass = getRiskColorClass(risk);
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3.5 py-1.5 font-bold"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${riskClass.badge} ${sizeClasses[size] || sizeClasses.md}`}>
      {showDot && (
        <span className={`relative flex ${dotSizes[size] || dotSizes.md}`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: riskClass.accent }} />
          <span className={`relative inline-flex rounded-full h-full w-full`} style={{ backgroundColor: riskClass.accent }} />
        </span>
      )}
      <span>{risk?.toUpperCase() || "UNKNOWN"} RISK</span>
    </span>
  );
}
""")

# 3. StatCard.jsx
write_file("src/components/common/StatCard.jsx", """
import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = "blue", onClick }) {
  const colorStyles = {
    blue: "from-blue-600/20 to-indigo-600/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40",
    emerald: "from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40",
    amber: "from-amber-600/20 to-orange-600/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40",
    red: "from-red-600/20 to-rose-600/10 text-red-400 border-red-500/20 group-hover:border-red-500/40",
    purple: "from-purple-600/20 to-indigo-600/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40",
    cyan: "from-cyan-600/20 to-blue-600/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40"
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${colorStyles[color] || colorStyles.blue}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 group-hover:scale-110 transition-transform shadow-inner">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center text-xs">
          <span className={`font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400 ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
""")

# 4. ProgressBar.jsx
write_file("src/components/common/ProgressBar.jsx", """
import React from 'react';

export default function ProgressBar({ value, max = 100, target = 75, label, showPercentage = true, color = "blue" }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorVariants = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    gradient: percent >= 75 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : percent >= 60 ? "bg-gradient-to-r from-amber-500 to-orange-400" : "bg-gradient-to-r from-red-600 to-rose-500"
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percent}%</span>}
        </div>
      )}
      <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorVariants[color] || colorVariants.blue}`}
          style={{ width: `${percent}%` }}
        />
        {target && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
            style={{ left: `${target}%` }}
            title={`Target: ${target}%`}
          />
        )}
      </div>
    </div>
  );
}
""")

# 5. Modal.jsx
write_file("src/components/common/Modal.jsx", """
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, size = "md" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[95vw]"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-10 my-8 transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
""")

# 6. ConfirmationDialog.jsx
write_file("src/components/common/ConfirmationDialog.jsx", """
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message, confirmText = "Confirm", isDestructive = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${isDestructive ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-slate-800">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/25'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
""")

# 7. SearchBar.jsx
write_file("src/components/common/SearchBar.jsx", """
import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search students, ID, department..." }) {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
""")

# 8. FilterDropdown.jsx
write_file("src/components/common/FilterDropdown.jsx", """
import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ label, value, onChange, options }) {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
""")

# 9. DemoRoleSwitcher.jsx (For Viva / Evaluation presentation)
write_file("src/components/common/DemoRoleSwitcher.jsx", """
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, GraduationCap, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DemoRoleSwitcher() {
  const { role, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwap = async (newRole) => {
    await quickDemoLogin(newRole);
    if (newRole === 'admin') navigate('/admin/dashboard');
    else if (newRole === 'faculty') navigate('/faculty/dashboard');
    else if (newRole === 'student') navigate('/student/dashboard');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-950/90 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-2 shadow-2xl shadow-indigo-500/20 flex items-center space-x-2">
      <div className="px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-indigo-400 border-r border-slate-800 hidden sm:block">
        Demo Persona
      </div>
      <button
        onClick={() => handleRoleSwap('admin')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          role === 'admin'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>

      <button
        onClick={() => handleRoleSwap('faculty')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          role === 'faculty'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Faculty</span>
      </button>

      <button
        onClick={() => handleRoleSwap('student')}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          role === 'student'
            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Student</span>
      </button>
    </div>
  );
}
""")

# 10. Sidebar.jsx (Role-Aware Dashboard Sidebar)
write_file("src/components/common/Sidebar.jsx", """
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
        { label: 'My Progress', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Academic Health', path: '/student/performance', icon: BarChart3 },
        { label: 'Risk Analysis & SHAP', path: '/student/risk', icon: BrainCircuit },
        { label: 'Actionable Goals', path: '/student/recommendations', icon: Target, badge: 'Tips' },
        { label: 'Mentorship History', path: '/student/interventions', icon: HeartHandshake },
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
""")

# 11. Topbar.jsx (Dashboard Topbar with Notifications, Quick Search, Theme Toggle)
write_file("src/components/common/Topbar.jsx", """
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, Shield, Sparkles, CheckCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Topbar({ onToggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">TYIT Academic Portal</span>
          <span>/</span>
          <span className="capitalize text-indigo-400">{role} Workspace</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.actionUrl) navigate(notif.actionUrl);
                      setShowNotifs(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      notif.read
                        ? 'bg-slate-900/50 border-slate-800/50 text-slate-400'
                        : 'bg-slate-800/60 border-indigo-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt="Profile"
            className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40"
          />
        </div>
      </div>
    </header>
  );
}
""")

# 12. EmptyState.jsx & LoadingState.jsx
write_file("src/components/common/EmptyState.jsx", """
import React from 'react';
import { FolderSearch, Plus } from 'lucide-react';

export default function EmptyState({ title = "No records found", description = "Try adjusting your search criteria or add a new record.", onAction, actionLabel = "Add Record" }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 mb-4">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
""")

write_file("src/components/common/LoadingState.jsx", """
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Processing academic analytics..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
}
""")
