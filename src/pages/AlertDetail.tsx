import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, AlertTriangle, User, FileText, ArrowUpRight, Info, MapPin, Monitor, Server, Clock } from 'lucide-react';
import { getUserById, formatTimestamp, formatBytes } from '../data/seed';
import RadarFingerprint from '../components/RadarFingerprint';
import { SEVERITY_COLORS, EVENT_ICONS, getFactorColor, getFactorBarColor } from '../utils/helpers';
import type { Alert, User as UserType, BaselineProfile, AnomalyFactor } from '../types';

interface AlertDetailProps {
  alerts: Alert[];
  users: UserType[];
  baselines: Map<string, BaselineProfile>;
  onMarkAlert: (alertId: string, status: 'confirmed_threat' | 'false_positive') => void;
}

export default function AlertDetail({ alerts, users, baselines, onMarkAlert }: AlertDetailProps) {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<'confirmed_threat' | 'false_positive' | null>(null);
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

  const handleMark = (status: 'confirmed_threat' | 'false_positive') => {
    setConfirmAction(status);
  };

  const confirmMark = () => {
    if (confirmAction) {
      onMarkAlert(alert.id, confirmAction);
      setConfirmAction(null);
      navigate('/dashboard/alerts');
    }
  };

  const renderEventDetails = () => {
    if (!alert.eventData) return null;
    const eventData = alert.eventData;

    if ('ip' in eventData) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <MapPin size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">IP Address</p>
              <p className="text-xs text-white/70 font-mono truncate">{eventData.ip}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <Monitor size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Device</p>
              <p className="text-xs text-white/70 truncate">{eventData.device}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <MapPin size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Location</p>
              <p className="text-xs text-white/70 truncate">{eventData.location}</p>
            </div>
          </div>
        </div>
      );
    }

    if ('fileName' in eventData) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <FileText size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">File Name</p>
              <p className="text-xs text-white/70 font-mono truncate">{eventData.fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <Server size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Action</p>
              <p className="text-xs text-white/70 capitalize">{eventData.action}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <Clock size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">File Size</p>
              <p className="text-xs text-white/70">{formatBytes(eventData.fileSize)}</p>
            </div>
          </div>
        </div>
      );
    }

    if ('volume' in eventData) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <ArrowUpRight size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Volume</p>
              <p className="text-xs text-white/70">{formatBytes(eventData.volume)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <Server size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Destination</p>
              <p className="text-xs text-white/70 truncate">{eventData.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-800/30">
            <Clock size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/30">Protocol</p>
              <p className="text-xs text-white/70">{eventData.protocol}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-sm mx-4 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                confirmAction === 'confirmed_threat' ? 'bg-red-500/10' : 'bg-emerald-500/10'
              }`}>
                {confirmAction === 'confirmed_threat' ? (
                  <AlertTriangle size={18} className="text-red-400" />
                ) : (
                  <Info size={18} className="text-emerald-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {confirmAction === 'confirmed_threat' ? 'Confirm Threat?' : 'Mark as False Positive?'}
                </h3>
                <p className="text-xs text-white/40">This action will update the detection baseline.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white/60 text-xs font-medium hover:bg-navy-800/50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmMark}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  confirmAction === 'confirmed_threat'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
        {renderEventDetails()}
      </div>

      {/* Action Buttons */}
      {alert.status !== 'confirmed_threat' && alert.status !== 'false_positive' && (
        <div className="flex gap-3">
          <button
            onClick={() => handleMark('confirmed_threat')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
          >
            <AlertTriangle size={16} />
            Mark as Threat
          </button>
          <button
            onClick={() => handleMark('false_positive')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all"
          >
            <Info size={16} />
            False Positive
          </button>
        </div>
      )}

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
                    <span className={`text-sm font-bold ${getFactorColor(factor.score)}`}>
                      +{factor.score}
                    </span>
                  </div>
                </div>
                <div className="ml-9 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getFactorBarColor(factor.score)}`}
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

      {/* Baseline Comparison + Radar */}
      {baseline && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-cyan-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">Baseline Comparison</h3>
                <p className="text-xs text-white/40">How this user&apos;s recent behavior compares to their 30-day baseline</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <RadarFingerprint baseline={baseline} userName={user?.name || 'Unknown'} />
        </div>
      )}
    </div>
  );
}
