import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, AlertTriangle, User, FileText, ArrowUpRight, LogIn, Info } from 'lucide-react';
import { getUserById, formatTimestamp } from '../data/seed';
import type { Alert, User as UserType, BaselineProfile, AnomalyFactor } from '../types';
import type { LucideIcon } from 'lucide-react';

interface AlertDetailProps {
  alerts: Alert[];
  users: UserType[];
  baselines: Map<string, BaselineProfile>;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

const EVENT_ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  file_access: FileText,
  data_transfer: ArrowUpRight,
};

export default function AlertDetail({ alerts, users, baselines }: AlertDetailProps) {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const alert = alerts.find((a: Alert) => a.id === alertId);

  if (!alert) {
    return (
      <div className="text-center py-20">
        <AlertTriangle size={48} className="mx-auto mb-4 text-white/10" />
        <p className="text-white/40">Alert not found</p>
        <button onClick={() => navigate('/dashboard/alerts')} className="mt-4 text-cyan-400 text-sm hover:underline">
          Back to Alerts
        </button>
      </div>
    );
  }

  const user = getUserById(users, alert.userId);
  const baseline = baselines.get(alert.userId);
  const EventIcon = EVENT_ICONS[alert.eventType];
  const totalFactorScore = alert.factors.reduce((sum: number, f: AnomalyFactor) => sum + f.score, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate('/dashboard/alerts')}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Alerts
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: `${user?.avatarColor}20`, color: user?.avatarColor }}
          >
            {user?.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{user?.name || 'Unknown User'}</h1>
            <p className="text-sm text-white/40">{user?.department} · {user?.role} · {alert.userId}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${SEVERITY_COLORS[alert.severity]}`}>
          {alert.severity.toUpperCase()} — Risk Score: {alert.riskScore}/100
        </div>
      </div>

      {/* Alert Summary */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          {EventIcon && <EventIcon size={20} className="text-cyan-400" />}
          <div>
            <h3 className="text-sm font-semibold text-white capitalize">{alert.eventType.replace('_', ' ')} Event</h3>
            <p className="text-xs text-white/40">{formatTimestamp(alert.timestamp)}</p>
          </div>
        </div>
        <div className="bg-navy-800/50 rounded-lg p-4 border-l-2 border-cyan-500/40">
          <p className="text-sm text-white/70 leading-relaxed">{alert.explanation}</p>
        </div>
      </div>

      {/* Explainable AI Panel */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain size={20} className="text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Explainability Breakdown</h3>
            <p className="text-xs text-white/40">Why this event was flagged — contributing factors</p>
          </div>
        </div>

        <div className="space-y-4">
          {alert.factors.map((factor: AnomalyFactor, i: number) => {
            const percentage = totalFactorScore > 0 ? (factor.score / totalFactorScore) * 100 : 0;
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30 w-6">0{i + 1}</span>
                    <span className="text-sm font-medium text-white">{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{factor.description}</span>
                    <span className={`text-sm font-bold ${
                      factor.score > 30 ? 'text-red-400' : factor.score > 15 ? 'text-amber-400' : 'text-cyan-400'
                    }`}>
                      +{factor.score}
                    </span>
                  </div>
                </div>
                <div className="ml-9 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      factor.score > 30 ? 'bg-red-500' : factor.score > 15 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${percentage}%`, animationDelay: `${i * 0.15}s` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-white/50 leading-relaxed">
                <strong className="text-white/70">How this works:</strong> Each factor&apos;s score is calculated from the z-score
                of the deviation multiplied by its weight. The risk score is the sum of all weighted deviations,
                normalized to 0–100. No hardcoded rules — purely statistical behavioral analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Baseline Comparison */}
      {baseline && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Baseline Comparison</h3>
              <p className="text-xs text-white/40">How this user&apos;s recent behavior compares to their 30-day baseline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-navy-800/30">
              <p className="text-xs text-white/40 mb-1">Avg Logins/Day</p>
              <p className="text-lg font-bold text-white">{baseline.avgLoginsPerDay.toFixed(1)}</p>
              <p className="text-xs text-white/30">σ = {baseline.stdLoginsPerDay.toFixed(1)}</p>
            </div>
            <div className="p-4 rounded-lg bg-navy-800/30">
              <p className="text-xs text-white/40 mb-1">Avg File Access/Day</p>
              <p className="text-lg font-bold text-white">{baseline.avgFileAccessPerDay.toFixed(1)}</p>
              <p className="text-xs text-white/30">σ = {baseline.stdFileAccessPerDay.toFixed(1)}</p>
            </div>
            <div className="p-4 rounded-lg bg-navy-800/30">
              <p className="text-xs text-white/40 mb-1">Avg Transfers/Day</p>
              <p className="text-lg font-bold text-white">{baseline.avgDataTransferPerDay.toFixed(1)}</p>
              <p className="text-xs text-white/30">σ = {baseline.stdDataTransferPerDay.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
