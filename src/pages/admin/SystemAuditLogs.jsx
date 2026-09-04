import React, { useState, useMemo } from 'react';
import {
  Activity, Search, Shield, CheckCircle, Clock, Download, Filter,
  FileText, BrainCircuit, HeartHandshake, User, Settings, ArrowUpDown, X, Eye
} from 'lucide-react';
import { systemLogs } from '../../data/mockData';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import { exportToCSV } from '../../utils/exportUtils';

export default function SystemAuditLogs() {
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [actorFilter, setActorFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  // Enriched initial audit log entries
  const extendedLogs = useMemo(() => {
    return [
      ...systemLogs,
      {
        id: "LOG-1005",
        timestamp: "2026-09-03 11:20:04",
        event: "STUDENT_PROFILE_UPDATED",
        user: "Dr. Vikram Joshi (Admin)",
        status: "SUCCESS",
        details: "Assigned mentor Prof. Sandeep Rao to student Amit Sharma (TYEXTC001). Updated attendance threshold flag."
      },
      {
        id: "LOG-1006",
        timestamp: "2026-09-03 10:55:18",
        event: "RISK_THRESHOLD_MODIFIED",
        user: "Dr. Vikram Joshi (Admin)",
        status: "SUCCESS",
        details: "Adjusted institutional High-Risk threshold from 65% to 65% and Critical Risk alert from 80% to 80%."
      },
      {
        id: "LOG-1007",
        timestamp: "2026-09-03 09:30:45",
        event: "REPORT_EXPORT_GENERATED",
        user: "Prof. Rajesh Shinde (Faculty)",
        status: "SUCCESS",
        details: "Exported 'Attendance Defaulters List (<75%)' containing 28 student records in CSV format."
      },
      {
        id: "LOG-1008",
        timestamp: "2026-09-03 08:45:12",
        event: "AUTH_LOGIN_SUCCESS",
        user: "Dr. Vikram Joshi (Admin)",
        status: "SUCCESS",
        details: "Multi-factor authentication verified from campus IP 192.168.10.45."
      }
    ];
  }, []);

  const filteredLogs = useMemo(() => {
    return extendedLogs.filter(log => {
      const matchSearch = log.id.toLowerCase().includes(search.toLowerCase()) ||
                          log.event.toLowerCase().includes(search.toLowerCase()) ||
                          log.user.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());

      let matchType = true;
      if (eventTypeFilter === 'PREDICTION') matchType = log.event.includes('PREDICTION') || log.event.includes('ML');
      else if (eventTypeFilter === 'INTERVENTION') matchType = log.event.includes('INTERVENTION');
      else if (eventTypeFilter === 'STUDENT') matchType = log.event.includes('STUDENT');
      else if (eventTypeFilter === 'SETTINGS') matchType = log.event.includes('THRESHOLD') || log.event.includes('SETTING');
      else if (eventTypeFilter === 'EXPORT') matchType = log.event.includes('EXPORT') || log.event.includes('REPORT');
      else if (eventTypeFilter === 'AUTH') matchType = log.event.includes('AUTH');

      let matchActor = true;
      if (actorFilter === 'ADMIN') matchActor = log.user.includes('Admin');
      else if (actorFilter === 'FACULTY') matchActor = log.user.includes('Faculty') || log.user.includes('Prof') || log.user.includes('Counselor');
      else if (actorFilter === 'SYSTEM') matchActor = log.user.includes('System');

      return matchSearch && matchType && matchActor;
    });
  }, [extendedLogs, search, eventTypeFilter, actorFilter]);

  const handleExportLogs = () => {
    const exportData = filteredLogs.map(l => ({
      LogID: l.id,
      Timestamp: l.timestamp,
      Event: l.event,
      InitiatedBy: l.user,
      Status: l.status,
      Details: l.details
    }));
    exportToCSV('System_Audit_Logs_Export.csv', exportData);
  };

  const getEventBadge = (event) => {
    if (event.includes('PREDICTION') || event.includes('ML')) {
      return { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: BrainCircuit };
    }
    if (event.includes('INTERVENTION')) {
      return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: HeartHandshake };
    }
    if (event.includes('STUDENT')) {
      return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: User };
    }
    if (event.includes('THRESHOLD') || event.includes('SETTING')) {
      return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: Settings };
    }
    if (event.includes('EXPORT')) {
      return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: FileText };
    }
    return { bg: 'bg-slate-800 text-slate-300 border-slate-700', icon: Shield };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Audit & Regulatory Telemetry Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit record of ML prediction runs, intervention updates, parameter threshold revisions, and compliance report exports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Audit Status: <strong className="text-emerald-400">Encrypted & Active</strong></span>
          </div>

          <button
            onClick={handleExportLogs}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Filter audit logs by ID, event type, actor, or details..." />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <FilterDropdown
            label="Event Type"
            value={eventTypeFilter}
            onChange={setEventTypeFilter}
            options={[
              { value: 'ALL', label: 'All Event Types' },
              { value: 'PREDICTION', label: 'ML Prediction Runs' },
              { value: 'INTERVENTION', label: 'Interventions Logged' },
              { value: 'STUDENT', label: 'Student Profile Updates' },
              { value: 'SETTINGS', label: 'Threshold Revisions' },
              { value: 'EXPORT', label: 'Report Exports' },
              { value: 'AUTH', label: 'Authentication & Security' }
            ]}
          />

          <FilterDropdown
            label="Actor"
            value={actorFilter}
            onChange={setActorFilter}
            options={[
              { value: 'ALL', label: 'All Initiators' },
              { value: 'ADMIN', label: 'Institutional Admins' },
              { value: 'FACULTY', label: 'Faculty Counselors' },
              { value: 'SYSTEM', label: 'System Daemons (Automated)' }
            ]}
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredLogs.length}</strong> immutable audit entries</span>
          <span>Click any row for complete event metadata payload</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Log ID & Timestamp</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Initiated By</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Execution Summary</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => {
                const badge = getEventBadge(log.event);
                const Icon = badge.icon;

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-white font-mono">{log.id}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{log.event}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                      {log.user}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        <span>{log.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 max-w-md truncate">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Audit Event Telemetry Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Audit Identifier</span>
                  <span className="font-mono font-bold text-white mt-0.5 block">{selectedLog.id}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Execution Status</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{selectedLog.status}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Event Type</span>
                <span className="font-mono font-bold text-indigo-400 mt-0.5 block">{selectedLog.event}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actor / Origin</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedLog.user}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Timestamp: {selectedLog.timestamp}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Execution Payload / Details</span>
                <p className="text-slate-200 leading-relaxed">{selectedLog.details}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                Cryptographic Checksum: SHA256-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
