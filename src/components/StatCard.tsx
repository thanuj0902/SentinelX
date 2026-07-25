interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export default function StatCard({ label, value, sublabel, trend, icon, color = 'cyan', className = '' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/15 text-cyan-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/15 text-red-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/15 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/15 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/15 text-purple-400',
  };

  return (
    <div className={`glass-card rounded-xl p-5 bg-gradient-to-br ${colorMap[color]} border ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</p>
        {icon && <span className={`${colorMap[color].split(' ').pop()}`}>{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        {trend && (
          <span className={`text-xs font-medium mb-1 ${trend.direction === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
            {trend.direction === 'up' ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      {sublabel && <p className="text-xs text-white/30 mt-1">{sublabel}</p>}
    </div>
  );
}
