import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';
import { useUserMap } from '../hooks/useUserMap';
import { formatTimestamp, getRiskColor, getFactorColor } from '../utils/helpers';
import type { Alert, User, AnomalyFactor } from '../types';

interface ExplainPageProps {
  alerts: Alert[];
  users: User[];
}

export default function ExplainPage({ alerts, users }: ExplainPageProps) {
  const navigate = useNavigate();
  const userMap = useUserMap(users);
  const topAlerts = useMemo(
    () => [...alerts].sort((a: Alert, b: Alert) => b.riskScore - a.riskScore).slice(0, 15),
    [alerts]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Explainable AI Panel</h1>
        <p className="text-sm text-white/40 mt-1">Click any alert to see why it was flagged — full factor breakdown</p>
      </div>

      <div className="glass-card rounded-xl p-5 border border-cyan-500/15">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={20} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">How Explainability Works</h3>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">
          Every alert is scored using statistical deviation from per-user behavioral baselines.
          The explainability panel breaks down each contributing factor (login pattern, file access volume,
          data transfer volume, time-of-access) with individual scores and plain-English descriptions.
          No black-box decisions — fully auditable.
        </p>
      </div>

      <div className="space-y-3">
        {topAlerts.map((alert: Alert) => {
          const user = userMap.get(alert.userId);
          return (
            <div
              key={alert.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/dashboard/alerts/${alert.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/dashboard/alerts/${alert.id}`); }}
              className="glass-card rounded-xl p-4 cursor-pointer hover:border-cyan-500/20 transition-all duration-300 hover:scale-[1.005]"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: `${user?.avatarColor}20`, color: user?.avatarColor }}
                >
                  {user?.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <span className="text-[10px] text-white/30">{alert.id}</span>
                  </div>
                  <p className="text-xs text-white/50 truncate">{alert.explanation}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {alert.factors.map((f: AnomalyFactor, i: number) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[10px] text-white/30">{f.name}:</span>
                        <span className={`text-[10px] font-bold ${getFactorColor(f.score)}`}>+{f.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getRiskColor(alert.riskScore)}`}>{alert.riskScore}</p>
                    <p className="text-[10px] text-white/30">{formatTimestamp(alert.timestamp)}</p>
                  </div>
                  <ArrowRight size={16} className="text-white/20" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
