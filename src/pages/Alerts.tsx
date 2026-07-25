import { useState, useMemo } from 'react';
import { AlertTriangle, Filter, Search } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import SensitivitySlider from '../components/SensitivitySlider';
import { buildUserMap } from '../data/seed';
import type { Alert, User } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  users: User[];
  sensitivity: number;
  onSensitivityChange: (v: number) => void;
}

export default function AlertsPage({ alerts, users, sensitivity, onSensitivityChange }: AlertsPageProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userMap = useMemo(() => buildUserMap(users), [users]);
  const departments = useMemo(() => [...new Set(users.map(u => u.department))].sort(), [users]);

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (departmentFilter !== 'all') {
        const user = userMap.get(a.userId);
        if (user?.department !== departmentFilter) return false;
      }
      if (searchQuery) {
        const user = userMap.get(a.userId);
        const q = searchQuery.toLowerCase();
        return (
          user?.name.toLowerCase().includes(q) ||
          user?.department.toLowerCase().includes(q) ||
          a.explanation.toLowerCase().includes(q) ||
          a.userId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, departmentFilter, searchQuery, userMap]);

  const selectClass = "px-3 py-2 rounded-lg bg-navy-800/50 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/30 appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Alert Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">{filtered.length} alerts · {alerts.filter(a => a.severity === 'critical').length} critical</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={14} className="text-red-400 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">Real-time Feed</span>
        </div>
      </div>

      <SensitivitySlider value={sensitivity} onChange={onSensitivityChange} />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-navy-800/50 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-white/30" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="investigating">Investigating</option>
          <option value="confirmed_threat">Confirmed Threat</option>
          <option value="false_positive">False Positive</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} userMap={userMap} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/40 text-sm">No alerts match your filters</p>
        </div>
      )}
    </div>
  );
}
