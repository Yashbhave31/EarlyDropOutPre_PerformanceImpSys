import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserCheck, GraduationCap, ArrowRight, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';

export default function RoleSelectPage() {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate(`/login?role=${role}`);
  };

  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      badge: 'Institutional Level',
      accentColor: 'blue',
      icon: Shield,
      buttonText: 'Continue as Admin',
      description: 'Institutional administration and macro-level dropout risk oversight across departments.',
      features: [
        'Institutional administration',
        'Monitor overall student risk',
        'Department analytics',
        'Faculty management',
        'Reports and system controls'
      ]
    },
    {
      id: 'faculty',
      title: 'Faculty',
      badge: 'Mentorship Level',
      accentColor: 'indigo',
      icon: UserCheck,
      buttonText: 'Continue as Faculty',
      description: 'Active student tracking, academic data intake, and timely mentoring interventions.',
      features: [
        'Monitor assigned students',
        'Update academic information',
        'View predictions',
        'Track interventions',
        'Mentor at-risk students'
      ]
    },
    {
      id: 'student',
      title: 'Student',
      badge: 'Self-Service Level',
      accentColor: 'cyan',
      icon: GraduationCap,
      buttonText: 'Continue as Student',
      description: 'Personal academic performance transparency, explainable AI risk factors, and guidance.',
      features: [
        'View personal academic performance',
        'View dropout-risk analysis',
        'Understand risk factors',
        'View recommendations',
        'Track interventions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>EduRisk AI • Role-Based Academic Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Choose Your Role
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Select how you will participate in the Early Dropout Prediction and Academic Intervention System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                id={`role-card-${r.id}`}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/60 transition-all flex flex-col justify-between group hover:-translate-y-1.5 duration-300 hover:shadow-xl hover:shadow-indigo-950/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{r.title}</h3>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">{r.description}</p>

                  <div className="space-y-2.5 mb-6">
                    {r.features.map((f, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole(r.id)}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all group-hover:shadow-indigo-500/40"
                >
                  <span>{r.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to System Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
