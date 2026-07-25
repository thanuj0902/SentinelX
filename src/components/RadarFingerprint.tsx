import type { BaselineProfile } from '../types';

interface RadarFingerprintProps {
  baseline: BaselineProfile;
  userName: string;
}

export default function RadarFingerprint({ baseline, userName }: RadarFingerprintProps) {
  const metrics = [
    { label: 'Login Freq', value: Math.min(baseline.avgLoginsPerDay / 15, 1) },
    { label: 'File Access', value: Math.min(baseline.avgFileAccessPerDay / 40, 1) },
    { label: 'Data Transfer', value: Math.min(baseline.avgDataTransferPerDay / 8, 1) },
    { label: 'Hourly Spread', value: baseline.typicalHours.length / 24 },
    { label: 'Activity Peak', value: Math.max(...baseline.hourlyActivity) },
  ];

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 35;
  const levels = 4;

  const angleStep = (Math.PI * 2) / metrics.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * maxR * value,
      y: cy + Math.sin(angle) * maxR * value,
    };
  };

  const polygonPoints = metrics.map((m, i) => {
    const p = getPoint(i, m.value);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="glass-card rounded-xl p-4">
      <h4 className="text-sm font-semibold text-white mb-1">Activity Fingerprint</h4>
      <p className="text-xs text-white/40 mb-3">{userName}</p>
      <div className="flex justify-center">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[220px]">
          {Array.from({ length: levels }, (_, i) => {
            const r = (maxR / levels) * (i + 1);
            const points = metrics.map((_, j) => {
              const angle = angleStep * j - Math.PI / 2;
              return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
            }).join(' ');
            return (
              <polygon
                key={i}
                points={points}
                fill="none"
                stroke="rgba(34, 211, 238, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {metrics.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(angle) * maxR}
                y2={cy + Math.sin(angle) * maxR}
                stroke="rgba(34, 211, 238, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="rgba(34, 211, 238, 0.15)"
            stroke="rgba(34, 211, 238, 0.6)"
            strokeWidth="2"
          />

          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#22d3ee"
              />
            );
          })}

          {metrics.map((m, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const labelR = maxR + 18;
            const lx = cx + Math.cos(angle) * labelR;
            const ly = cy + Math.sin(angle) * labelR;
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white/50 text-[9px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {m.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
