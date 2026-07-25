import type { Alert, User } from '../types';
import { formatTimestamp } from '../data/seed';
import { SEVERITY_BADGES, STATUS_BADGES, EVENT_ICONS, getRiskBarColor } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface AlertCardProps {
  alert: Alert;
  userMap: Map<string, User>;
}

export default function AlertCard({ alert, userMap }: AlertCardProps) {
  const navigate = useNavigate();
  const user = userMap.get(alert.userId);
  const EventIcon = EVENT_ICONS[alert.eventType];

  const severityBorder: Record<string, string> = {
    critical: 'border-red-500/40 bg-red-500/5',
    high: 'border-orange-500/40 bg-orange-500/5',
    medium: 'border-amber-500/40 bg-amber-500/5',
    low: 'border-cyan-500/20 bg-cyan-500/5',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/dashboard/alerts/${alert.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/dashboard/alerts/${alert.id}`); }}
      className={`
        glass-card rounded-xl p-4 border cursor-pointer transition-all duration-300
        hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5
        ${severityBorder[alert.severity]}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: `${user?.avatarColor}20`, color: user?.avatarColor }}
          >
            {user?.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{user?.name || 'Unknown'}</h4>
            <p className="text-xs text-white/40">{user?.department} · {alert.userId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SEVERITY_BADGES[alert.severity]}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {EventIcon && <EventIcon size={14} className="text-white/40" />}
        <span className="text-xs text-white/50 capitalize">{alert.eventType.replace('_', ' ')}</span>
        <span className="text-xs text-white/30">·</span>
        <span className="text-xs text-white/40">{formatTimestamp(alert.timestamp)}</span>
      </div>

      <p className="text-sm text-white/70 mb-3 leading-relaxed">{alert.explanation}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGES[alert.status]}`}>
            {alert.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Risk</span>
          <div className="w-20 h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getRiskBarColor(alert.riskScore)}`}
              style={{ width: `${alert.riskScore}%` }}
            />
          </div>
          <span className="text-xs font-bold text-white/70">{alert.riskScore}</span>
        </div>
      </div>
    </div>
  );
}
