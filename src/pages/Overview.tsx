import { Activity, AlertTriangle, Users, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import type { Alert, User, BaselineProfile } from '../types';

interface TopRiskUser {
  user: User;
  maxScore: number;
  alertCount: number;
}

interface AlertByDay {
  day: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface OverviewProps {
  data: {
    users: User[];
    alerts: Alert[];
    baselines: Map<string, BaselineProfile>;
  };
  activeAlerts: Alert[];
  alertsByDay: AlertByDay[];
  topRiskUsers: TopRiskUser[];
  sensitivity: number;
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-xs">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p: TooltipPayloadItem, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview({ data, activeAlerts, alertsByDay, topRiskUsers, sensitivity }: OverviewProps) {
  const criticalCount = activeAlerts.filter((a: Alert) => a.severity === 'critical').length;
  const highCount = activeAlerts.filter((a: Alert) => a.severity === 'high').length;
  const confirmedThreats = data.alerts.filter((a: Alert) => a.status === 'confirmed_threat').length;

  const riskDist = [
    { name: 'Critical', value: data.alerts.filter((a: Alert) => a.severity === 'critical').length, color: '#ef4444' },
    { name: 'High', value: data.alerts.filter((a: Alert) => a.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: data.alerts.filter((a: Alert) => a.severity === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: data.alerts.filter((a: Alert) => a.severity === 'low').length, color: '#22d3ee' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Organization Overview</h1>
          <p className="text-sm text-white/40 mt-1">Real-time insider threat monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Users Monitored"
          value={data.users.length}
          sublabel="Across 10 departments"
          icon={<Users size={18} />}
          color="cyan"
        />
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          sublabel={`${criticalCount} critical, ${highCount} high`}
          icon={<AlertTriangle size={18} />}
          color={criticalCount > 0 ? 'red' : 'amber'}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          label="Threats Confirmed"
          value={confirmedThreats}
          sublabel="Admin verified"
          icon={<Shield size={18} />}
          color="emerald"
        />
        <StatCard
          label="Detection Sensitivity"
          value={`${sensitivity.toFixed(1)}x`}
          sublabel={sensitivity < 1 ? 'Conservative' : sensitivity < 1.5 ? 'Balanced' : 'Aggressive'}
          icon={<TrendingUp size={18} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Alert Trend (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alertsByDay}>
                <defs>
                  <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#gradCritical)" strokeWidth={2} name="Critical" />
                <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#gradHigh)" strokeWidth={2} name="High" />
                <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#gradMedium)" strokeWidth={2} name="Medium" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Risk Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDist} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Count">
                  {riskDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Top 5 Highest-Risk Users This Week</h3>
        <div className="space-y-3">
          {topRiskUsers.map((item: TopRiskUser, i: number) => (
            <div key={item.user.id} className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/30 hover:bg-navy-800/50 transition-colors">
              <span className="text-xs text-white/30 font-mono w-6">#{i + 1}</span>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${item.user.avatarColor}20`, color: item.user.avatarColor }}
              >
                {item.user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.user.name}</p>
                <p className="text-xs text-white/40">{item.user.department} · {item.alertCount} alert{item.alertCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.maxScore >= 80 ? (
                  <TrendingUp size={14} className="text-red-400" />
                ) : (
                  <TrendingDown size={14} className="text-emerald-400" />
                )}
                <span className={`text-sm font-bold ${
                  item.maxScore >= 80 ? 'text-red-400' :
                  item.maxScore >= 60 ? 'text-orange-400' :
                  item.maxScore >= 35 ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {item.maxScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
