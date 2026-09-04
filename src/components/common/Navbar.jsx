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
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDashboardRedirect}
                className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors hidden sm:inline-flex items-center space-x-1"
              >
                <span className="capitalize">{role} Dashboard</span>
              </button>
              <Link
                to="/roles"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-500/25 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
