import { ClipboardList, Info, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { formatTimestamp } from '../data/seed';
import type { ActionLogEntry } from '../types';
import type { LucideIcon } from 'lucide-react';

interface ActionLogProps {
  entries: ActionLogEntry[];
}

const LEVEL_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

export default function ActionLog({ entries }: ActionLogProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Transparent Action Log</h1>
          <p className="text-sm text-white/40 mt-1">Complete audit trail of detection engine activity</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <ClipboardList size={14} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 font-medium">{entries.length} entries</span>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Settings size={18} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Engine Transparency</h3>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">
          Every action taken by the anomaly detection engine is logged here for full auditability.
          This includes baseline recalculations, sensitivity changes, alert escalations, and feedback processing.
          In production, this log would integrate with SIEM tools like Splunk or ELK for compliance reporting.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent" />

        <div className="space-y-4">
          {entries.map((entry: ActionLogEntry, i: number) => {
            const config = LEVEL_CONFIG[entry.level];
            const Icon = config.icon;
            return (
              <div key={entry.id} className="relative pl-14 animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className={`absolute left-4 w-5 h-5 rounded-full ${config.bg} border ${config.border} flex items-center justify-center z-10`}>
                  <Icon size={10} className={config.color} />
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`text-sm font-semibold ${config.color}`}>{entry.action}</h4>
                      <p className="text-xs text-white/40 mt-0.5">{entry.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 font-mono">{entry.id}</span>
                    <span className="text-[10px] text-white/20">·</span>
                    <span className="text-[10px] text-white/20">{formatTimestamp(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
