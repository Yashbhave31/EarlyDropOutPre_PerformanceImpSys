import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  GraduationCap, Shield, UserCheck, User, ArrowRight,
  Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read role from query param (?role=admin|faculty|student)
  const initialRoleParam = searchParams.get('role');
  const validRoles = ['admin', 'faculty', 'student'];
  const initialRole = validRoles.includes(initialRoleParam?.toLowerCase())
    ? initialRoleParam.toLowerCase()
    : 'admin';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo Credentials Map matching specifications
  const roleConfig = {
    admin: {
      title: 'Admin',
      role: 'admin',
      icon: Shield,
      email: 'admin@edurisk.ai',
      password: 'Admin@123',
      name: 'Dr. Ramanathan Iyer',
      designation: 'Principal & Dean',
      desc: 'Institutional analytics, cohort risk telemetry & department oversight',
      redirect: '/admin/dashboard',
      accent: 'blue'
    },
    faculty: {
      title: 'Faculty',
      role: 'faculty',
      icon: UserCheck,
      email: 'faculty@edurisk.ai',
      password: 'Faculty@123',
      name: 'Dr. Anjali Deshmukh',
      designation: 'Associate Professor (IT)',
      desc: 'Mentee student tracking, continuous evaluation & counseling logs',
      redirect: '/faculty/dashboard',
      accent: 'indigo'
    },
    student: {
      title: 'Student',
      role: 'student',
      icon: GraduationCap,
      email: 'student@edurisk.ai',
      password: 'Student@123',
      name: 'Aarav Patil',
      designation: 'TYIT Cohort A (Roll #01)',
      desc: 'Personal academic performance, Explainable AI SHAP factors & support',
      redirect: '/student/dashboard',
      accent: 'cyan'
    }
  };

  const [email, setEmail] = useState(roleConfig[initialRole].email);
  const [password, setPassword] = useState(roleConfig[initialRole].password);

  // Synchronize state if URL query param changes
  useEffect(() => {
    const paramRole = searchParams.get('role');
    if (paramRole && validRoles.includes(paramRole.toLowerCase())) {
      const normalized = paramRole.toLowerCase();
      setSelectedRole(normalized);
      setEmail(roleConfig[normalized].email);
      setPassword(roleConfig[normalized].password);
    }
  }, [searchParams]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setEmail(roleConfig[role].email);
    setPassword(roleConfig[role].password);
    setError('');
    setSearchParams({ role });
  };

  const handleFillDemoCredentials = () => {
    setEmail(roleConfig[selectedRole].email);
    setPassword(roleConfig[selectedRole].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both institutional email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password, selectedRole);
      if (res.success) {
        // Check if there was a previous redirect path requested that belongs to this role
        const redirectParam = searchParams.get('redirect');
        if (redirectParam && redirectParam.startsWith(`/${selectedRole}`)) {
          navigate(redirectParam);
        } else {
          navigate(roleConfig[selectedRole].redirect);
        }
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin(role);
      navigate(roleConfig[role].redirect);
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = roleConfig[selectedRole];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center space-x-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xl text-white tracking-tight">EduRisk AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400">Dropout Early Warning System</p>
          </div>
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mb-2">
            <IconComponent className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Persona: <strong className="text-white capitalize">{currentConfig.title}</strong></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign in as {currentConfig.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            {currentConfig.desc}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-card py-7 px-6 sm:px-9 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Role selector switcher tabs */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Role Persona:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                type="button"
                id="role-tab-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                id="role-tab-faculty"
                onClick={() => handleRoleChange('faculty')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                id="role-tab-student"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === 'student'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Institutional Email
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Reset Demo Creds
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={`${selectedRole}@edurisk.ai`}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Demo Note */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                />
                <span>Remember session</span>
              </label>

              <div className="text-[11px] text-slate-400">
                Demo: <span className="text-slate-300 font-mono">{currentConfig.password}</span>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-button"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${currentConfig.title}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Evaluation Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Click Quick Demo Sign In</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Evaluator shortcut</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-demo-admin"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-semibold text-center transition-all hover:scale-[1.02]"
              >
                Admin Demo
              </button>
              <button
                type="button"
                id="quick-demo-faculty"
                onClick={() => handleQuickLogin('faculty')}
                className="p-2.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold text-center transition-all hover:scale-[1.02]"
              >
                Faculty Demo
              </button>
              <button
                type="button"
                id="quick-demo-student"
                onClick={() => handleQuickLogin('student')}
                className="p-2.5 rounded-xl bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold text-center transition-all hover:scale-[1.02]"
              >
                Student Demo
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 px-1">
          <Link
            to="/roles"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Role Selection</span>
          </Link>
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
