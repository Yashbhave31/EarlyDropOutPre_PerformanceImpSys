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
